---
name: Cinematic Gala
colors:
  surface: '#111415'
  surface-dim: '#111415'
  surface-bright: '#373a3b'
  surface-container-lowest: '#0c0f10'
  surface-container-low: '#191c1d'
  surface-container: '#1d2021'
  surface-container-high: '#282a2b'
  surface-container-highest: '#323536'
  on-surface: '#e1e3e4'
  on-surface-variant: '#d6c2c1'
  inverse-surface: '#e1e3e4'
  inverse-on-surface: '#2e3132'
  outline: '#9e8d8b'
  outline-variant: '#514343'
  surface-tint: '#f7b7b3'
  primary: '#f7b7b3'
  on-primary: '#4d2423'
  primary-container: '#2d0b0b'
  on-primary-container: '#a9726f'
  inverse-primary: '#83514f'
  secondary: '#efc056'
  on-secondary: '#402d00'
  secondary-container: '#946e00'
  on-secondary-container: '#fffbff'
  tertiary: '#ffb0cb'
  on-tertiary: '#640037'
  tertiary-container: '#35001a'
  on-tertiary-container: '#d84c8a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#f7b7b3'
  on-primary-fixed: '#341010'
  on-primary-fixed-variant: '#683a38'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#efc056'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cb'
  on-tertiary-fixed: '#3e0020'
  on-tertiary-fixed-variant: '#8c0550'
  background: '#111415'
  on-background: '#e1e3e4'
  surface-variant: '#323536'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

The design system is engineered to evoke the emotional weight of a cinematic milestone and the refined luxury of a high-end invitation. It targets users celebrating significant life events who demand an experience that feels both "Disney magical" and "Apple premium."

The aesthetic is **Cinematic Minimalism with Glassmorphic Depth**. It prioritizes a sense of wonder through atmospheric lighting, high-quality photography, and fluid motion. The interface acts as a stage, using heavy whitespace (or "dark-space") and translucent materials to create a layered, physical feel. The emotional response is one of awe, exclusivity, and heartfelt celebration.

## Colors

The palette centers on a "Midnight Burgundy" foundation, transitioning into pure black to create an infinite sense of depth. 

- **Primary & Background:** The #2D0B0B to #000000 gradient is the canvas. It provides a moody, sophisticated environment where light elements can glow.
- **Accents:** Gold (#F6C65B) is reserved for high-value actions, borders, and celebratory highlights, signifying luxury. Rose Pink (#FF6BAA) is used sparingly for emotional cues, micro-interactions, and secondary highlights to add a touch of warmth and "magic."
- **Typography & UI:** Soft White (#F8F9FA) ensures readability without the harshness of pure white, maintaining the premium feel.

## Typography

This design system utilizes a high-contrast typographic pairing to balance tradition with modernity.

- **Headlines:** Playfair Display provides a literary, editorial feel. Large display sizes should use tight letter-spacing and bold weights to mimic cinematic title cards.
- **Body & Labels:** Inter provides a functional, clean counterpoint. Use wider line heights for body text to maintain an airy, premium feel. Labels should use increased letter-spacing and uppercase styling to feel like architectural notations.

## Layout & Spacing

The layout follows a **Fluid Centralized Model**. Content is often centered to create a focused, "heroic" perspective common in luxury branding.

- **Grid:** A 12-column grid for desktop, reducing to 4 columns for mobile. Use generous margins (80px+) on desktop to let elements breathe.
- **Rhythm:** Use a strict 8px base unit. Vertical rhythm should be exaggerated; use `stack-xl` (64px) between major sections to create a sense of discovery while scrolling.
- **Mobile:** Transition to a single-column layout with 20px side margins, ensuring glassmorphic cards span the full width to maximize screen real estate.

## Elevation & Depth

Depth is the defining characteristic of this design system. It is achieved through **Optical Stratification**:

1.  **Base Layer:** The Deep Burgundy gradient, serving as the "void."
2.  **Middle Layer:** Glassmorphic containers. Use a `backdrop-filter: blur(20px)` with a semi-transparent Soft White fill at 5-10% opacity. Add a 1px solid stroke in Soft White (15% opacity) or Gold to define edges.
3.  **Top Layer:** Interactive elements and glowing assets. 
4.  **Shadows:** Avoid black shadows. Use "Ambient Glows"—soft, wide-spreading outer glows that inherit the color of the element (e.g., a faint Gold glow behind a primary button).

## Shapes

The shape language is organic and approachable yet structured. Rounded corners are used to soften the "tech" feel of the UI and lean into the "Disney magic" warmth.

- **Cards & Containers:** Utilize `rounded-3xl` (24px-32px) to create a friendly, high-end look.
- **Buttons:** Use slightly tighter radii (12px) to maintain a sense of precision.
- **Interactive Elements:** Checkboxes and toggles should be fully rounded (pill-shaped) to reinforce the fluid, magical aesthetic.

## Components

### Buttons
- **Primary:** Gold (#F6C65B) stroke (1.5px), transparent background, Gold text. On hover, add a soft Gold outer glow and 10% Gold fill.
- **Secondary:** Soft White border (1px at 30% opacity), white text.

### Glassmorphism Cards
- Heavy backdrop blur (minimum 20px).
- Subtle 1px inner border using a linear gradient (Soft White to Transparent).
- Content inside cards should have ample padding (32px+).

### Interactive Elements
- **Input Fields:** Bottom-border only or very subtle glass containers. The cursor/focus state should trigger a Rose Pink (#FF6BAA) glow.
- **Chips/Badges:** Pill-shaped, semi-transparent burgundy fill with a thin Gold stroke.

### Specialized Components
- **The "Magic" Reveal:** A component that uses a mask-image gradient to "reveal" content as the user scrolls, mimicking a spotlight.
- **Celebration Header:** A display component using Playfair Display with a subtle metallic Gold gradient fill and a CSS-based "shimmer" animation.