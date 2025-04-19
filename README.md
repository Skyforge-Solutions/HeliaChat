# HeliaChat

HeliaChat is a modern, responsive chat application built with React and Vite.

## Features

- 💬 Chat interface with simulated AI responses
- 🌓 Light and dark mode support
- 📁 Multiple chat sessions with local storage persistence
- 📱 Responsive design for desktop and mobile devices
- 🖼️ Image upload functionality
- 🔄 Real-time message streaming simulation

## Contribution Guidelines

### Workflow

1. **Fork the Repository**: Create a fork of this repository to your GitHub account.

2. **Clone the Repository**: Clone your forked repository to your local machine.
   ```bash
   git clone https://github.com/your-username/HeliaChat.git
   cd HeliaChat
   ```

3. **Create a Branch**: Always create a new feature branch for your changes.
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**: Implement your changes following the coding standards.

5. **Run Tests**: Ensure all tests pass before submitting.
   ```bash
   npm run test
   ```

6. **Code Quality**: Run linting checks.
   ```bash
   npm run lint
   ```

7. **Commit Changes**: Use descriptive commit messages.
   ```bash
   git commit -m "feat: add new feature"
   ```

8. **Push Changes**: Push your branch to your forked repository.
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create Pull Request**: Open a pull request from your branch to the main repository's `main` branch.

### Pull Request Guidelines

- Provide a clear description of the changes in the PR description
- Reference any related issues using GitHub's issue linking syntax (#issue-number)
- Ensure all CI checks pass
- Request review from appropriate team members
- Do not merge your own pull requests

### Code Standards

- Follow the existing code style and conventions
- Write comprehensive documentation for new features
- Include unit tests for new functionality
- Ensure backward compatibility unless explicitly specified

### Versioning

This project follows [Semantic Versioning](https://semver.org/). When proposing version changes:

- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality additions
- PATCH version for backwards-compatible bug fixes

## Technologies Used

### Core Dependencies

- **React v19.0.0** - Frontend library for building user interfaces
- **React DOM v19.0.0** - React renderer for the DOM
- **React Icons v5.5.0** - Icon library for React applications
- **Tailwind CSS v4.1.4** - Utility-first CSS framework
- **Vite v6.3.1** - Fast build tool and development server

### Dev Dependencies

- **ESLint v9.22.0** - Linting utility for JavaScript and JSX
- **Tailwind Typography v0.5.16** - Typography plugin for Tailwind CSS
- **PostCSS v8.5.3** - CSS transformation tool
- **Autoprefixer v10.4.21** - PostCSS plugin to parse CSS and add vendor prefixes

## Project Structure

```
src/
├── App.jsx                # Main application component
├── index.css              # Global styles
├── main.jsx               # Application entry point
├── assets/                # Static assets like images and icons
├── components/            # Reusable UI components
│   ├── chat/              # Chat-related components
│   │   ├── ChatArea.jsx   # Main chat display area
│   │   ├── ChatInput.jsx  # Message input container
│   │   ├── ChatMessage.jsx # Individual message component
│   │   ├── input/         # Input-related subcomponents
│   │   └── message/       # Message-related subcomponents
│   ├── layout/            # Layout components
│   │   ├── Navbar.jsx     # Top navigation bar
│   │   └── Sidebar.jsx    # Side navigation panel
│   ├── navbar/            # Navbar-related components
│   └── sidebar/           # Sidebar-related components
├── context/               # React context providers
│   ├── ChatContext.jsx    # Chat state management
│   └── ThemeContext.jsx   # Theme state management
└── services/              # External services and API clients
    └── aiService.js       # Simulated AI response service
```

## Key Components

### Context Providers

- **ThemeContext** - Manages light/dark mode preferences
- **ChatContext** - Manages chat sessions, messages, and related operations

### Layout Components

- **Navbar** - Contains theme switcher and user profile menu
- **Sidebar** - Shows chat sessions and allows switching between them

### Chat Components

- **ChatArea** - Displays messages and handles the AI response simulation
- **ChatInput** - Contains message input, model selector, and image uploader
- **ChatMessage** - Renders individual messages with appropriate styling

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HeliaChat
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Features in Detail

### Chat Sessions

The application allows multiple chat sessions that are persisted in the browser's local storage. You can:
- Create new chat sessions
- Switch between existing sessions
- Rename sessions
- Delete individual sessions
- Clear all sessions

### Theme Support

HeliaChat automatically detects your system's theme preference but also allows manual switching between light and dark modes. Theme preferences are saved in local storage.

### AI Interaction

The application simulates AI interactions with a typing effect. In a production environment, you would replace the mock `aiService.js` with actual API calls to an AI service.

## Customization

### Changing the Theme Colors

Edit the `tailwind.config.js` file to customize the color scheme.

### Adding New AI Models

Modify the `ModelSelector.jsx` component and update `aiService.js` to handle different model types.

## License

[MIT](LICENSE)