# Defocus2Focus - Productivity App

A React Native productivity app that helps you balance focused work sessions with mindful breaks through gamification and progress tracking.

## Features

### 🎯 Core Workflow

- **Onboarding & Login**: Welcome screen with carousel and simple authentication
- **Dashboard**: Dynamic greeting, progress tracking, and quick actions
- **Defocus Lock Mode**: Timer-based focus sessions with calming animations
- **Journaling**: Text editor with word count and streak tracking
- **Mini Games**: Memory Match and Tap Game for relaxation
- **History**: Timeline view of all activities with filtering
- **Profile**: Settings, achievements, and account management

### 🎮 Gamification

- **XP & Coins**: Earn rewards for completing sessions and activities
- **Achievements**: Unlock badges for various milestones
- **Streaks**: Track consecutive days of productivity
- **Progress Tracking**: Visual progress bars and statistics

### 🎨 Design Features

- **Modern UI**: Clean design with TailwindCSS styling
- **Animations**: Smooth transitions with Framer Motion and Reanimated
- **Dark Mode**: Support for light, dark, and auto themes
- **Responsive**: Optimized for different screen sizes

## Tech Stack

- **React Native** with Expo
- **TailwindCSS** for styling
- **React Navigation** for navigation
- **React Native Reanimated** for animations
- **Context API** for state management
- **AsyncStorage** for data persistence
- **Expo Haptics** for tactile feedback
- **Expo AV** for audio features

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd defocus2focus
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Card.js
│   ├── StatCard.js
│   ├── ProgressCircle.js
│   └── ActionButton.js
├── context/            # Global state management
│   └── AppContext.js
├── navigation/         # Navigation setup
│   ├── AppNavigator.js
│   └── MainTabNavigator.js
└── screens/           # App screens
    ├── OnboardingScreen.js
    ├── LoginScreen.js
    ├── DashboardScreen.js
    ├── DefocusLockScreen.js
    ├── JournalScreen.js
    ├── GamesScreen.js
    ├── HistoryScreen.js
    └── ProfileScreen.js
```

## Key Components

### AppContext

Global state management with Context API including:

- User authentication state
- App statistics (XP, coins, streaks)
- History tracking
- Settings management
- Game statistics

### Navigation

- Stack navigator for main app flow
- Bottom tab navigator for main screens
- Conditional navigation based on app state

### Reusable Components

- **Card**: Flexible container with gradient support
- **StatCard**: Display statistics with icons and colors
- **ProgressCircle**: Animated circular progress indicator
- **ActionButton**: Customizable button with animations

## Features in Detail

### Onboarding

- 4-slide carousel explaining app features
- Smooth animations and transitions
- Skip option for returning users

### Dashboard

- Personalized greeting with username
- Motivational quotes rotation
- Progress tracking with circular indicators
- Quick action cards for main features
- Real-time statistics display

### Defocus Lock Mode

- Timer-based focus sessions (5-30 minutes)
- Calming breathing animations
- Progress tracking with visual feedback
- Prevention of early exit with warnings
- Reward calculation and display

### Journaling

- Rich text editor with word count
- Entry management (create, edit, delete)
- Streak tracking
- Local storage persistence

### Mini Games

- **Memory Match**: Find matching emoji pairs
- **Tap Game**: Quick reflexes test
- Score tracking and high scores
- XP and coin rewards

### History

- Timeline view of all activities
- Filtering by activity type
- Detailed session information
- Progress visualization

### Profile

- Achievement system with progress tracking
- Theme selection (light/dark/auto)
- Settings management
- Account actions

## State Management

The app uses React Context API for global state management with the following structure:

```javascript
{
  user: {
    username: '',
    isLoggedIn: false,
    hasCompletedOnboarding: false,
  },
  stats: {
    streak: 0,
    totalSessions: 0,
    totalHours: 0,
    journalEntries: 0,
    xp: 0,
    coins: 0,
    todaySessions: 0,
    todayGoal: 5,
  },
  history: [],
  journalEntries: [],
  games: { ... },
  settings: { ... }
}
```

## Data Persistence

- **AsyncStorage**: All user data is persisted locally
- **Automatic saving**: State changes are automatically saved
- **Data loading**: App state is restored on startup

## Customization

### Themes

The app supports three theme modes:

- **Light**: Clean white background
- **Dark**: Dark gray background
- **Auto**: Follows system preference

### Defocus Duration

Users can customize default session duration:

- 5, 10, 15, 20, 25, or 30 minutes

### Notifications

Toggle for session reminders and achievements

## Development

### Adding New Features

1. Create new screen in `src/screens/`
2. Add navigation route in `AppNavigator.js`
3. Update state management in `AppContext.js` if needed
4. Add any new reusable components in `src/components/`

### Styling

- Use TailwindCSS classes for styling
- Follow the existing color scheme
- Maintain consistency with existing components

### Animations

- Use React Native Reanimated for complex animations
- Keep animations smooth and purposeful
- Test on both iOS and Android

## Production Build

1. **Configure app.json** with your app details
2. **Build for production**
   ```bash
   expo build:android
   expo build:ios
   ```
3. **Submit to app stores** following Expo's guidelines

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
