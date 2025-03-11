# AA_02 Project Structure

This document outlines the complete folder structure for the AA_02 personal AI assistant project. To set up this project, create the following folder structure at `users/ludvighedin/programming/aa_02`:

```
aa_02/
│
├── docs/
│   ├── PRD.md                  # Product Requirements Document
│   ├── CHANGELOG.md            # Changelog template
│   ├── CURSOR_RULES.md         # Rules for Cursor
│   └── TODO.md                 # Project to-do list
│
├── src/
│   ├── components/             # React components
│   ├── pages/                  # Next.js pages
│   │   ├── index.tsx           # Home page
│   │   ├── _app.tsx            # App wrapper
│   │   └── api/                # API routes
│   ├── styles/                 # CSS styles
│   ├── services/               # Service integrations
│   ├── models/                 # Model integrations
│   └── utils/                  # Utility functions
│
├── public/                     # Static assets
│
├── repositories/               # Cloned repositories
│   ├── browser-use/            # Browser functionality
│   ├── web-ui/                 # Web UI components
│   ├── gpt-researcher/         # Research capabilities
│   ├── gptr.dev/               # Additional research tools
│   ├── deepseek-ai/            # Local model integration
│   ├── Qwen/                   # Local model integration
│   └── Wan2.1/                 # Video generation
│
├── package.json                # NPM package configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── .gitignore                  # Git ignore file
├── README.md                   # Project readme
└── clone_repos.sh              # Script to clone repositories
```

## Setup Instructions

1. Create the main project directory:
   ```
   mkdir -p ~/programming/aa_02
   cd ~/programming/aa_02
   ```

2. Create all the necessary subdirectories:
   ```
   mkdir -p docs src/components src/pages src/api src/styles src/services src/models src/utils public repositories
   ```

3. Initialize git repository:
   ```
   git init
   git remote add origin https://github.com/ludvighedin/aa_02.git
   ```

4. Place all documentation files in the docs directory
5. Set up the initial Next.js configuration
6. Clone the required repositories using the clone_repos.sh script
