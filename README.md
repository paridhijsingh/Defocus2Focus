# Defocus2Focus 🎯

> **Where Procrastination Meets Play** - A gamified productivity app that transforms focus sessions into engaging, rewarding experiences.

## 🌟 What is Defocus2Focus?

Defocus2Focus is a comprehensive productivity app that combines the proven Pomodoro Technique with gamification, music therapy, and smart break management. Instead of fighting procrastination, we make productivity fun and rewarding through:

- **🎮 Gamified Focus Sessions** - Earn energy points and unlock badges for every interaction
- **🎵 Therapeutic Audio** - 24+ curated sounds across Nature, Ambient, Focus, and Relax categories
- **☕ Smart Break Management** - Guided activities and customizable break durations
- **📝 Integrated Task Management** - Built-in to-do lists with progress tracking
- **🔄 Session Cycle Logic** - Defocus → Focus → Unlock workflow for optimal productivity

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/Defocus2Focus.git
   cd Defocus2Focus
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   ```bash
   npm run ios      # iOS Simulator
   npm run android  # Android Emulator
   npm run web      # Web browser
   ```

### Web Version

The app includes a fully functional web version at [`public/index.html`](public/README.md) that provides the same features as the mobile app.

## 🏗️ Project Structure

```
Defocus2Focus/
├── 📱 src/                          # React Native source code
│   ├── components/                  # Reusable UI components
│   │   └── [README.md](src/components/README.md)
│   ├── contexts/                    # React Context providers
│   ├── screens/                     # App screens and features
│   │   └── [README.md](src/screens/README.md)
│   ├── services/                    # Business logic services
│   ├── utils/                       # Utility functions
│   └── App.js                       # Main app entry point
├── 🌐 public/                       # Web app files
│   └── [README.md](public/README.md)
├── 🎵 assets/                       # Static assets
│   ├── audio/                       # Audio system
│   │   └── [README.md](assets/audio/README.md)
│   └── images/                      # Images and icons
├── 📚 docs/                         # Documentation
├── 🔧 scripts/                      # Build and utility scripts
├── 🧪 tests/                        # Test files
└── 📱 ios/                          # iOS native code
```

## ✨ Core Features

### 🎯 Focus & Productivity

- **Pomodoro Timer**: 25-minute focus sessions with customizable durations
- **Session Cycle Management**: Smart defocus → focus → unlock workflow
- **Progress Tracking**: Visual progress bars and session statistics

### 🏆 Rewards & Gamification

- **Energy Points System**: Earn points for every interaction (+1 to +2 points)
- **Badge System**: 6 unlockable badges (Bronze to Legendary)
- **Daily Goals**: Track daily energy point targets
- **Real-time Notifications**: Instant feedback for achievements

### 🎵 Music & Relaxation

- **4 Audio Categories**: Nature, Ambient, Focus, Relax
- **Background Playback**: Music continues when switching between features
- **Mini Player**: Floating controls for seamless music management
- **Local Audio Files**: High-quality, offline-capable audio system

### ☕ Break Management

- **Smart Break Types**: Micro (2min), Short (5min), Long (15min) breaks
- **Break Activities**: Guided breathing, stretching, walking, meditation
- **Break Statistics**: Track completion rates and streaks

### 📝 Task Management

- **To-Do Lists**: Create, edit, delete, and organize tasks
- **Categories & Priorities**: Organize tasks by type and importance
- **Progress Tracking**: Daily completion rates and statistics

## 🛠️ Development

### Tech Stack

- **React Native** with Expo for cross-platform development
- **React Context API** for state management
- **HTML5 Audio API** for web audio functionality
- **Local Storage** for data persistence
- **CSS3** with modern animations and responsive design

### Key Features

- **Cross-platform**: iOS, Android, and Web support
- **Offline-first**: Works without internet connection
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Screen reader support and keyboard navigation

## 📱 Deployment

### Web Deployment

The web version is deployed on Netlify and automatically updates when changes are pushed to the main branch.

### Mobile Deployment

- **iOS**: Build and deploy through Expo or Xcode
- **Android**: Build and deploy through Expo or Android Studio

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Audio files sourced from royalty-free libraries
- Icons from various open-source icon sets
- Inspiration from Pomodoro Technique and productivity research

## 📞 Support

For support, email paridhijaysingh@gmail.com or create an issue in the repository.

---

**Made with ❤️ for productivity and mental wellness**

> _"The best way to get something done is to begin."_ - Defocus2Focus helps you begin with joy, not dread.
