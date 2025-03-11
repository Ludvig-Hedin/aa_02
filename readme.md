# AA_02 Personal AI Assistant

AA_02 is a comprehensive personal AI assistant that integrates multiple AI functionalities into a unified web application. It supports both local model execution and API-based models, providing a versatile platform for AI-powered productivity, research, and creativity.

## Features

- **Multiple AI Model Support**: Seamlessly switch between different AI models (Claude, GPT, Gemini) or run them in parallel
- **Deep Research Capabilities**: Gather information, analyze data, and generate reports with cited sources
- **Local & Cloud Models**: Choose between cloud-based API models or run AI locally for privacy and offline capabilities
- **Browser Integration**: Access web content directly within the app for seamless research
- **Authentication**: Secure user authentication with Supabase

## Coming Soon

- **Calendar Integration**: Schedule and manage events with AI assistance
- **Screen Sharing**: Share your screen for better AI assistance
- **Voice Control**: Control your AI assistant with voice commands
- **Multimodal Generation**: Create and edit images, audio, and video

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **AI Models**: Claude, GPT, Gemini, local models (DeepSeek, Qwen)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for authentication and database)
- API keys for the AI models you want to use

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ludvighedin/aa_02.git
   cd aa_02
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
aa_02/
│
├── docs/                     # Documentation
│
├── src/
│   ├── components/           # React components
│   ├── pages/                # Next.js pages
│   │   ├── index.tsx         # Home page
│   │   ├── _app.tsx          # App wrapper
│   │   └── api/              # API routes
│   ├── styles/               # CSS styles
│   ├── services/             # Service integrations
│   ├── models/               # Model integrations
│   └── utils/                # Utility functions
│
├── public/                   # Static assets
│
├── repositories/             # Cloned repositories
│
├── package.json              # NPM package configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── README.md                 # Project readme
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Anthropic](https://www.anthropic.com/)
- [OpenAI](https://openai.com/)
- [Google AI](https://ai.google/)
