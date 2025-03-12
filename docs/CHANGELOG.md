# Changelog

All notable changes to the AA_02 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure and documentation
- Basic Next.js application setup with TypeScript
- Tailwind CSS configuration with custom theme
- Supabase authentication integration
- Layout component with responsive design
- Home page with feature overview
- Chat interface with model selection
- Authentication page with email and OAuth providers
- Model service interfaces for AI integration
- Claude service implementation
- OpenAI service implementation for GPT models
- Local model service for managing offline AI models
- Models page with download management UI
- Utility functions for formatting data (bytes, dates, durations)
- Model grouping by provider in the UI

### Changed
- Updated navigation sidebar to include Models page with appropriate icons
- Modified DashboardLayout component to use correct navigation structure
- Implemented monochromatic color scheme in Tailwind configuration
- Moved Models page from app directory to pages directory
- Fixed ModelManager.ts to use correct function signature
- Updated Next.js configuration to handle build errors

### Fixed
- Corrected import paths for utility functions
- Fixed model selection in chat interface
- Resolved navigation highlighting for current page
- Fixed ModelManager.createModelService function to use correct parameter structure
- Resolved conflicts between app and pages directories

## [0.1.0] - 2025-03-11

### Added
- Initial project setup
- Basic documentation
- Configuration files
- Directory structure
