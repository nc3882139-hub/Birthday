import React, { useEffect, useRef } from 'react';

const BackgroundShader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
      console.error("WebGL not supported", e);
      return;
    }
    if (!gl) return;

    let animationFrameId;
    let resizeObserver;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 4; ++i) {
              v += a * noise(p);
              p = rot * p * 2.0 + shift;
              a *= 0.5;
          }
          return v;
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          vec2 ndcMouse = u_mouse.xy / u_resolution.xy;
          
          float t = u_time * 0.08;
          
          // 1. Swirling Animated Gradients (Burgundy, Deep Red, Gold)
          vec2 p1 = uv * 2.5 - vec2(t * 0.15, t * 0.08);
          vec2 p2 = uv * 1.2 + vec2(t * 0.04, -t * 0.08);
          
          // Mouse interaction with noise coordinates
          float mouseDist = length(uv - ndcMouse);
          float mouseForce = smoothstep(0.4, 0.0, mouseDist) * 0.05;
          vec2 dir = normalize(uv - ndcMouse + 0.0001);
          p1 += dir * mouseForce;
          p2 -= dir * mouseForce * 0.5;
          
          float n1 = fbm(p1);
          float n2 = fbm(p2 + n1 * 1.2);
          
          // Deep luxurious dark burgundy background
          vec3 spaceBg = mix(vec3(0.02, 0.004, 0.005), vec3(0.08, 0.01, 0.015), uv.y);
          
          // Soft cloud gas layers
          vec3 colorNebula1 = vec3(0.18, 0.02, 0.04) * n1; // Deep rose/burgundy cloud
          vec3 colorNebula2 = vec3(0.35, 0.22, 0.08) * n2 * 0.4; // Soft golden cloud
          
          vec3 finalColor = spaceBg + colorNebula1 + colorNebula2;
          
          // 2. Animated Light Rays (God Rays) from top-left
          vec2 raySource = vec2(-0.2, 1.2);
          vec2 toSource = uv - raySource;
          float angle = atan(toSource.y, toSource.x);
          float distToSource = length(toSource);
          float rayPattern = sin(angle * 12.0 + t * 0.8) * 0.5 + 0.5;
          rayPattern += sin(angle * 26.0 - t * 0.5) * 0.25 + 0.25;
          rayPattern *= smoothstep(1.5, 0.0, distToSource);
          vec3 rayColor = vec3(0.95, 0.82, 0.55) * rayPattern * 0.05;
          finalColor += rayColor;
          
          // 3. Moving Bokeh Lights (Warm Gold/Amber)
          float b1 = smoothstep(0.18, 0.0, length(uv - vec2(0.25 + 0.08*sin(t*0.5), 0.35 + 0.08*cos(t*0.7))));
          float b2 = smoothstep(0.25, 0.0, length(uv - vec2(0.8 + 0.05*cos(t*0.4), 0.65 + 0.06*sin(t*0.6))));
          float b3 = smoothstep(0.15, 0.0, length(uv - vec2(0.5 + 0.1*sin(t*0.3), 0.15 + 0.05*cos(t*0.5))));
          finalColor += vec3(0.95, 0.8, 0.45) * b1 * 0.06;
          finalColor += vec3(0.9, 0.72, 0.4) * b2 * 0.05;
          finalColor += vec3(0.98, 0.85, 0.55) * b3 * 0.07;
          
          // 4. Double-layered Floating Golden Particles (80 Stars)
          for(float i = 0.0; i < 80.0; i++) {
              float hashX = hash(vec2(i, 11.53));
              float hashY = hash(vec2(i, 45.21));
              
              vec2 starPos = vec2(hashX, hashY);
              
              // Drift particles upward slowly
              float speed = 0.008 + 0.015 * hash(vec2(i, 83.1));
              starPos.y = fract(starPos.y - u_time * speed);
              starPos.x = fract(starPos.x + 0.015 * sin(u_time * 0.1 + i));
              
              // Push particles away from cursor
              float starMouseDist = length(starPos - ndcMouse);
              if (starMouseDist < 0.28) {
                  float push = (0.28 - starMouseDist) * 0.15;
                  starPos += normalize(starPos - ndcMouse + 0.0001) * push;
              }
              
              float dist = length(uv - starPos);
              
              // Distinguish background (tiny, dim) vs foreground (larger, bright)
              float isForeground = step(40.0, i); 
              float baseSize = mix(0.0002, 0.0007, isForeground);
              float size = baseSize + 0.0004 * hash(vec2(i, 29.7));
              
              // Twinkle sparkles
              float pulseSpeed = mix(0.8, 2.5, hash(vec2(i, 92.4)));
              float pulse = 0.3 + 0.7 * sin(u_time * pulseSpeed + i * 3.0);
              
              // Volumetric falloff glow
              float glow = size / (dist + 0.0005);
              
              // Cinematic gold colors
              vec3 starColor = mix(
                  vec3(1.0, 0.78, 0.42), // Rich gold/amber
                  vec3(1.0, 0.95, 0.8),  // Bright champagne
                  hash(vec2(i, 63.8))
              );
              
              finalColor += glow * starColor * pulse;
          }
          
          // 5. Film Grain / Subtle Noise
          float grain = hash(uv + fract(sin(u_time))) * 0.015;
          finalColor += vec3(grain);
          
          // 6. Soft Vignette Shadow
          float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
          vignette = clamp(pow(16.0 * vignette, 0.45), 0.0, 1.0);
          finalColor *= mix(0.4, 1.0, vignette);
          
          gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
      }
    `;

    const compileShader = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    // Track smooth mouse position relative to canvas
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let targetMouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        targetMouse.x = nx * canvas.width;
        targetMouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        targetMouse.x = w / 2;
        targetMouse.y = h / 2;
      }
    };

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    // Render loop
    const render = (time) => {
      if (typeof ResizeObserver === 'undefined') {
        syncSize();
      }

      // Linear interpolation (lerp) for smooth mouse movement
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none mix-blend-screen opacity-70">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default BackgroundShader;
