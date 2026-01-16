# ATS Pro CV Maker

A modern, AI-powered resume builder designed to create ATS-optimized CVs. Built with React, TypeScript, and Vite.

**Live Demo:** [https://mustafazahter.github.io/ai-cv-maker/](https://mustafazahter.github.io/ai-cv-maker/#/)

## Features

- **AI-Assisted CV Generation**: Chat with an AI agent to build your resume conversationally. Powered by Google Gemini.
- **Multiple Themes**: Choose from 7 professionally designed themes (Classic, Executive, Modern, Sidebar, Professional, Elegant, Creative).
- **ATS Optimization**: Generated content follows ATS best practices with proper keyword density and formatting.
- **Manual Editor**: Full control over every section with a form-based editor.
- **Skill Level Ratings**: Optional visual skill proficiency indicators.
- **PDF Export**: Export your CV directly to PDF via browser print.
- **Bilingual Support**: Full Turkish and English localization.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API
- i18next (internationalization)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-cv-maker.git
cd ai-cv-maker

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Setup

You will need a Google Gemini API key to use the AI features. You can obtain one from [Google AI Studio](https://aistudio.google.com/).

The API key can be configured directly in the application UI via the key icon in the toolbar.

## Usage

### AI Agent Mode

1. Click on "AI Agent" tab in the sidebar.
2. Enter your API key when prompted.
3. Start a conversation. You can:
   - Paste your existing CV text and ask the AI to format it.
   - Describe your experience and let the AI build a CV from scratch.
   - Upload a PDF or image of your current resume for analysis.

### Manual Editor Mode

1. Click on "Editor" tab in the sidebar.
2. Fill in each section using the form fields.
3. Add or remove entries as needed.

### Exporting

Click the "Export PDF" button in the top toolbar. Use your browser's print dialog to save as PDF.

For best results, ensure "Background graphics" is enabled in print settings.

## Project Structure

```
src/
  app/           # Application entry, global providers, routing
  pages/         # Page components
  widgets/       # Complex UI blocks (ChatAssistant, ManualEditor)
  features/      # User interactions (API key modal, language switcher)
  entities/      # Domain models and UI (Resume, CV themes)
  shared/        # Shared utilities, types, UI components, API clients
```

The project follows Feature-Sliced Design (FSD) architecture.

## Deployment

### GitHub Pages

```bash
pnpm run deploy
```

This will build the project and deploy to the `gh-pages` branch.

### Manual Build

```bash
pnpm run build
```

Output will be in the `dist/` directory.

## Configuration

### Vite Configuration

Modify `vite.config.ts` for build options, base path, and chunk splitting.

### Theme Customization

Theme renderers are located in:
- `entities/resume/ui/themes/CVThemes.tsx`
- `entities/resume/ui/themes/NewThemes.tsx`

## License

MIT

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.
