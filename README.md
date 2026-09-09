# DarkGen Studio: Image Generator

**ModelsLab text-to-image generation interface** featuring a dark-themed UI. DarkGen exposes direct parameter controls, saves prompt history locally, and applies preset style modifiers.

## Features
- **ModelsLab API**: Direct client-to-API text-to-image generation.
- **Granular Controls**: Adjust guidance scale, inference steps, sampling methods, and negative prompts.
- **Style Modifiers**: Append predefined artistic style text arrays to your prompts.
- **Local Storage**: Images and prompts save directly to your browser's local storage.
- **API Key Handling**: Enter your API key in the UI. Keys remain local and do not route through an intermediary backend.

## Tech Stack
- React 19
- Vite
- Tailwind CSS
- Lucide React Icons

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/markkirby125/Image-Generator-DarkGen.git
   cd Image-Generator-DarkGen
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application and enter your ModelsLab API Key when prompted.

## License
MIT License
