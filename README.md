# Quantum Singularity Engine 🌌🌀

An advanced, interactive WebGL-raymarching visual simulator and custom full-stack environment built using React, Vite, Tailwind CSS, Express, and the real-time bidirectional **Gemini Live API** (@google/genai).

The Quantum Singularity Engine renders a highly complex volumetric simulation of a cosmic core, accretion rings, gravitational event horizons, and spatial distortions entirely on the GPU. Accompanying this visual deck is **The Sentinel**, an autonomous, voice-capable artificial intelligence entity with direct telemetry access and a dynamic long-term memory sub-engine that integrates directly into the live conversation.

---

## 🎨 System Architecture Overview

The system operates as a cohesive, full-stack reactive application. It couples real-time shader variables, audio synthesizers, and bidirectional streaming protocols to bridge high-performance graphics with intelligent conversational capabilities.

```
       ┌────────────────────────────────────────────────────────┐
       │                   Desktop User Interface               │
       │  ┌──────────────────────┐    ┌──────────────────────┐  │
       │  │  WebGL Renderer      │    │  Control Panel UI    │  │
       │  │  (GLSL Shader Core)  │    │  (Tailwind, React)   │  │
       │  └──────────▲───────────┘    └──────────┬───────────┘  │
       └─────────────┼───────────────────────────┼──────────────┘
                     │                           │
                     │ State Synchronization     │ WebSockets (audio/text)
                     │ (Uniform updates)         │ & Memory APIs
                     │                           ▼
       ┌─────────────┴───────────────────────────┴──────────────┐
       │                   Custom Express Server                │
       │  ┌──────────────────────────────────────────────────┐  │
       │  │           Local WebGL Asset & SPA Server          │  │
       │  ├──────────────────────────────────────────────────┤  │
       │  │           WebSocket Gateway (/live)              │  │
       │  │  - Encapsulates Base64 PCM Mic Streaming Data    │  │
       │  │  - Proxies client requests to Gemini Live        │  │
       │  └──────────▲───────────────────────────┬──────────┘  │
       └─────────────┼───────────────────────────┼──────────────┘
                     │                           │
                     │ Bidirectional WebSocket   │ Gemini API responses
                     │ Connection                │ (PCM audio / JSON tools)
                     ▼                           ▼
       ┌────────────────────────────────────────────────────────┐
       │                   Gemini Live API                      │
       │  - Model: gemini-3.1-flash-live-preview                │
       │  - Prebuilt Voice Voice Config (Zephyr)                │
       │  - Direct Function Tool Declarations                   │
       └────────────────────────────────────────────────────────┘
```

---

## ✨ Features and Capabilities

### 1. Volumetric WebGL Raymarching Core
A monolithic, high-performance GLSL fragment shader renders the scene inside a single WebGL context. Unlike standard polygon-based 3D engines, every pixel is evaluated using a customized ray-casting pipeline calculating Signed Distance Fields (SDFs):
- **Signed Distance Fields (SDFs)**: Math-defined primitives including a central volumetric singularity sphere, orbiting torus rings, and high-frequency noise fields resembling swirling cosmic dust.
- **Gravitational Lensing & Event Horizons**: Activating the **Void Singularity** alters the path of the marching rays, bending space-time. The visual result mimics gravitational light-lensing around a black hole, creating an accretion disk profile that pulls the surrounding environment and starfield into its center.
- **Quantum Resonance & Aberration**: Modulating the resonance refracts local space, inducing temporal echoes, infinite motion trails, chromatic light-separation, and dynamic full-frame flashes.
- **Aesthetic Modalities (Color Presets)**: Seamlessly toggle between visual profiles like *Cyan*, *Magenta*, *Gold*, *Void*, *Ice*, and *Solar* to change the ambient signature and volumetric lighting profiles instantly.

### 2. Bidirectional "Sentinel" Live Voice Interface
A full voice, low-latency communication interface powered by the modern `@google/genai` Live API protocol:
- **Low-Latency Streaming**: Bidirectional WebSockets feed 16kHz raw mono linear PCM audio directly from your microphone into the Gemini Live Session.
- **Real-Time Synthesis**: The Gemini engine generates prebuilt speech audio chunks (using the "Zephyr" voice profile) which are returned to the browser and queued instantly in a dynamic client-side `AudioContext` buffer.
- **Robust Text Fallback**: Type messages directly into the terminal terminal input. The server packages textual turns into `sendClientContent` wrappers and instantly transmits them, allowing hands-free voice work or classic command-line telemetry typing.
- **Visual Synthesis Feedback**: Audio signals from the Sentinel are visualized in real time as animated, glowing waveform monitors and pulsing particle arrays on the control deck.

### 3. Smart Long-Term Memory Engine
The Sentinel isn't just an empty voice; it has a persistent cognitive state. The application features a persistent JSON-based memory bank:
- **Automatic Factual Extraction**: Through Gemini tool-calling, the Sentinel can proactively execute `save_fact` when it learns something durable, unique, or interesting about you or your simulation preferences.
- **Self-Cleaning / Deletion**: The Sentinel can call the `delete_fact` tool dynamically to remove obsolete, outdated, or redundant facts.
- **Client Synchronization**: Whenever memory updates are saved or deleted by the Sentinel or manually adjusted via the UI Memory Panel, the client is signaled instantly via JSON payloads to redraw state cleanly without needing a full-page reload.

---

## 🛠️ Technical Specifications & Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18+ (Vite) | High-performance, functional components, reactive state synchronization, and modular UI structure. |
| **Styling** | Tailwind CSS | Sleek, dark futuristic dashboard layout mimicking a space craft terminal. |
| **Animation Engine** | `motion` (`motion/react`) | Fluid, hardware-accelerated user interface transitions, sliders, state shifts, and sidebar drawers. |
| **Real-time Audio** | Web Audio API | Custom PCM audio capturing, base64 formatting, buffer queueing, and volume-envelope analysis. |
| **Backend runtime** | Node.js (Express) | Full-stack production-ready Express server driving HTTP memory CRUD APIs and WebSockets. |
| **Live AI Gateway** | `@google/genai` (SDK) | Uses `ai.live.connect` to establish a bidirectional session with `gemini-3.1-flash-live-preview`. |
| **Persistence** | File System (JSON) | Lightweight, persistent `memory.json` engine storing recorded facts and preferences. |

---

## 📁 Repository Structure

```
├── .env.example          # Sample environment variables config
├── metadata.json         # Application registration, name, and camera permissions
├── package.json          # Dependency listings and execution scripts
├── server.ts             # Custom full-stack Express server + WebSocket proxy
├── tsconfig.json         # TypeScript compiler configurations
├── vite.config.ts        # Vite configuration mapping and building pipelines
├── memory.json           # Local storage representing the Sentinel's long-term memory
└── src/
    ├── App.tsx           # Primary application container, WebGL canvas, core animations, and shader lifecycle
    ├── main.tsx          # React application bootstrapping
    ├── index.css         # Tailwind directives and customized global styles
    ├── types.ts          # Declarations of types, models, interfaces, and enums
    ├── components/
    │   └── CommandCenter.tsx # Modular control center UI containing the command terminal, micro-sliders, system alerts, and long-term memory panel
    └── lib/
        └── audioUtils.ts # High-performance browser utilities for PCM conversion and playback buffers
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18` or later.
- **Gemini API Key**: Retrieve an API key from Google AI Studio.

### Installation
1. Clone the repository and navigate to the project directory.
2. Install the necessary node packages:
   ```bash
   npm install
   ```

### Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and insert your API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### Running the Application

To spin up the development environment (Express Server hosting the Vite development middleware):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🕹️ Interface Manual & Control Parameters

### The Visual Controls
- **Speed**: Controls the time coefficient uniform fed into the raymarching shader, accelerating orbital patterns and solar flares.
- **Lighting**: Modifies volumetric dispersion and brightness parameters.
- **Zoom / Yaw / Pitch**: Dynamic navigation uniforms determining the camera's orientation matrix in 3D SDF space.
- **Atmospherics**: Modulates sub-noises to simulate cosmic wind speed, particulate fields, and core oscillation speeds.

### Interactive Anomalies
- **Quantum Resonance**: Adjusts spatial tearing. Pushing this to high thresholds induces multiple shader render passes with chromatic aberration and high-energy light flares.
- **Void Singularity**: Shifts rendering from a glowing core model to a black-hole-style gravitational lensing formula, distorting space-time around the central event horizon.

### The Memory Hub
- Manage long-term memories manually or let the **Cosmic Sentinel** adjust them dynamically during voice sessions.
- Edit, delete, or create memories directly using the sliding control drawer.

---

## 🔒 Security & Deployment Best Practices

1. **API Keys**: The `GEMINI_API_KEY` is a critical secret and should **never** be exposed in client-side code. The full-stack proxy architecture in `server.ts` encapsulates the key completely on the server-side.
2. **Production Builds**:
   Before deploying to Cloud Run or another container platform, compile the static front-end assets and bundle the typescript backend server into a single file with:
   ```bash
   npm run build
   ```
   Start the standalone production container:
   ```bash
   npm run start
   ```

---

## 💡 Troubleshooting & Diagnostics

- **Linter / Build Check**: Run `npm run lint` or `npm run build` to verify the codebase structure is completely valid.
- **No Microphone Response**: If microphone permission is blocked or denied, the Quantum Singularity Engine will gracefully downgrade to **Text-Only Input Mode**, allowing you to converse with the Sentinel using the console text prompt.
- **No Agent Response**: Verify that `GEMINI_API_KEY` is present and active in your environmental configurations, and that your internet connection supports secure websocket transactions (`ws://` or `wss://`). Inspect the terminal output or consult `server.log` to trace live connection progress and WebSocket handshakes.
