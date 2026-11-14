# 🎂 Birthday — A Cinematic Birthday Experience

<p align="center">
  <strong>A birthday is more than a date. It's a collection of memories, emotions, and moments worth celebrating.</strong>
</p>

<p align="center">
  An interactive, cinematic birthday website built with React, Framer Motion, and modern web technologies.
</p>

<p align="center">
  <a href="https://github.com/nc3882139-hub/Birthday">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-Powered-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer" alt="Framer Motion">
</p>

---

## ✨ About the Project

**Birthday** is a personalized digital birthday experience designed to turn a simple birthday greeting into an interactive visual journey.

Instead of presenting a conventional birthday card, the website welcomes visitors with an animated gift-opening experience and gradually reveals a collection of birthday wishes, memories, and heartfelt moments.

The experience combines elegant visual design, smooth animations, interactive elements, and ambient synthesized audio to create a cinematic atmosphere.

The project is designed around a premium visual identity featuring:

- Deep black backgrounds.
- Burgundy and wine-inspired accents.
- Champagne gold highlights.
- Soft rose and ivory tones.
- Atmospheric lighting and floating particles.

**The idea is simple: make someone feel special, not just wish them a happy birthday.**

---

## 🎬 Features

### 🎁 1. Interactive Gift Reveal
- Animated gift-opening experience.
- Cinematic screen transitions.
- Smooth reveal animations.
- Option to skip the introduction and enter the main experience.

### 🎈 2. Interactive Floating Balloons
- Multiple balloon shapes and colour variations.
- Glossy gradients, highlights, and reflections.
- Animated floating, rotation, and gentle swaying.
- Interactive balloon-popping effects.
- Glowing particles and personalized birthday wishes.

### 💌 3. Personal Birthday Story
- Dedicated storytelling experience.
- Multiple sections for memories, wishes, and special moments.
- Animated text and cinematic transitions.
- Personal birthday message and finale.

### 🎵 4. Ambient Audio Experience
- Original synthesized ambient music generated through the Web Audio API.
- Soft musical tones and atmospheric sound effects.
- Play and pause controls.
- Mute and unmute functionality.
- Adjustable volume.
- Smooth audio fade transitions.
- Audio starts following user interaction.

### 🌌 5. Animated Background
- Atmospheric WebGL shader background.
- Floating visual elements.
- Subtle lighting and depth effects.
- Smooth transitions between different sections.

### 📱 6. Responsive Design
- Responsive layouts for different screen sizes.
- Mobile navigation.
- Adaptive typography and spacing.
- Touch-friendly interactive elements.

### 🎞️ 7. Smooth Motion & Scrolling
- Framer Motion animations.
- Lenis smooth scrolling.
- Animated section transitions.
- Interactive hover and click effects.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI development |
| Vite | Development server and build tool |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations and transitions |
| Lenis | Smooth scrolling |
| Web Audio API | Synthesized ambient music and sound effects |
| WebGL | Animated shader background |
| JavaScript (ES6+) | Application logic |
| CSS3 | Custom visual effects and styling |

---

## 📂 Project Structure

```text
Birthday/
│
├── public/
│   └──                  # Static assets
│
├── src/
│   ├── components/
│   │   ├── BackgroundShader.jsx
│   │   ├── Balloon.jsx
│   │   ├── MusicControls.jsx
│   │   ├── TopNavbar.jsx
│   │   └── MobileMenu.jsx
│   │
│   ├── context/
│   │   └── AudioContext.jsx
│   │
│   ├── sections/
│   │   ├── GiftReveal.jsx
│   │   └── OurStory.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/nc3882139-hub/Birthday.git
```

### 2. Navigate to the Project Directory

```bash
cd Birthday
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Visit the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

---

## 📦 Available Commands

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Generate production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Oxlint code analysis |

---

## 🎨 Design Philosophy

The visual direction of this project follows a cinematic and elegant design philosophy.

Rather than using overly bright colours and conventional birthday decorations, the interface focuses on atmosphere, contrast, depth, and subtle animation.

**Design elements:**

- Dark cinematic backgrounds.
- Burgundy, champagne, and dusty rose colour palette.
- Soft gradients and glowing highlights.
- Layered animations and floating elements.
- Smooth typography and visual hierarchy.
- Minimal yet expressive interactions.

The goal is to create an experience that feels personal, premium, and memorable.

---

## 🌐 Deployment

This is a Vite-based frontend application and can be deployed using platforms such as:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

### Production Build

```bash
npm run build
```

The optimized production files will be generated inside the `dist/` directory.

For Vercel or Netlify, use the following settings:

| Setting | Value |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## 💡 Future Improvements

Potential enhancements for future versions:

- More realistic 3D balloon physics.
- Additional interactive memory galleries.
- More personalized storytelling experiences.
- Additional ambient music themes.
- Enhanced mobile animations.
- Improved accessibility and performance.
- More cinematic transitions and visual effects.

---

## ❤️ A Personal Note

This project was created to make a birthday celebration feel different.

Every animation, floating balloon, transition, and message contributes to a small digital world built around one special person.

Because sometimes, the best gifts aren't things you can hold — they're experiences you remember.

**Made with ❤️, creativity, and a little bit of magic.**

---

<p align="center">
  <strong>✨ Celebrate memories. Create moments. Make someone smile. ✨</strong>
</p>