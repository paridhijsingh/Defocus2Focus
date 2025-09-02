# 📱 Screens & Features

The Defocus2Focus app screens provide the main user interface for all core features. Each screen is designed for specific functionality while maintaining consistent design patterns and user experience.

## 📁 Screen Overview

```
src/screens/
├── Dashboard.js              # Main dashboard and navigation
├── DashboardScreen.js        # Enhanced dashboard with statistics
├── EnhancedDashboard.js      # Advanced dashboard features
├── HomeScreen.js             # Welcome and quick actions
├── SplashScreen.js           # App loading and initialization
├── FocusSession.js           # Focus timer and session management
├── FocusSessionScreen.js     # Enhanced focus session interface
├── EnhancedFocusSession.js   # Advanced focus features
├── DefocusScreen.js          # Defocus activities and games
├── DefocusBreak.js           # Defocus break management
├── DefocusBreakScreen.js     # Enhanced defocus break interface
├── EnhancedDefocusBreak.js   # Advanced defocus features
├── BreakScreen.js            # Break timer and activities
├── PomodoroScreen.js         # Pomodoro technique implementation
├── TodoScreen.js             # Task management interface
├── EnhancedTodoScreen.js     # Advanced task management
├── WebTodoScreen.js          # Web-specific task interface
├── MusicScreen.js            # Music and relaxation interface
├── RewardsScreen.js          # Rewards and achievements
├── Stats.js                  # Statistics and analytics
├── StatsScreen.js            # Enhanced statistics interface
└── README.md                 # This documentation
```

## 🎯 Core Feature Screens

### 🏠 Dashboard & Navigation

#### `Dashboard.js` / `DashboardScreen.js` / `EnhancedDashboard.js`

Main navigation hub providing access to all app features.

**Key Features:**

- **Quick Actions**: Start focus, take break, view tasks
- **Statistics Overview**: Daily progress and achievements
- **Energy Points Display**: Current energy and daily goal
- **Session Cycle Status**: Defocus/Focus lock state
- **Recent Activity**: Last sessions and completed tasks

**Navigation:**

- Focus Session → `FocusSessionScreen.js`
- Defocus Activities → `DefocusScreen.js`
- Break Management → `BreakScreen.js`
- Task Management → `TodoScreen.js`
- Music & Relaxation → `MusicScreen.js`
- Rewards & Achievements → `RewardsScreen.js`

### 🎯 Focus Sessions

#### `FocusSession.js` / `FocusSessionScreen.js` / `EnhancedFocusSession.js`

Pomodoro timer implementation with session cycle management.

**Key Features:**

- **Timer Display**: Visual countdown with progress ring
- **Session Controls**: Start, pause, stop, reset
- **Session Cycle**: Defocus → Focus → Unlock workflow
- **Progress Tracking**: Visual progress bars and statistics
- **Energy Points**: Earn points for completing sessions
- **Notifications**: Session start/end alerts

**Session Flow:**

1. **Defocus Required**: Must complete defocus before focus
2. **Focus Session**: 25-minute timer (customizable)
3. **Break Suggestion**: Automatic break recommendation
4. **Cycle Complete**: Unlock defocus for next cycle

**Customization:**

- **Session Duration**: Adjustable focus time
- **Break Duration**: Customizable break length
- **Sound Alerts**: Audio notifications for session events
- **Visual Themes**: Customizable color schemes

### 🧘 Defocus Activities

#### `DefocusScreen.js` / `DefocusBreak.js` / `EnhancedDefocusBreak.js`

Activities and mini-games for mental breaks and relaxation.

**Key Features:**

- **Activity Types**: Journaling, games, AI therapist, breathing
- **Mini-Games**: Simple, engaging games for breaks
- **Guided Activities**: Step-by-step relaxation exercises
- **Session Lock**: Prevents multiple defocus sessions
- **Energy Points**: Earn points for completing activities

**Activity Categories:**

- **Mindfulness**: Breathing exercises, meditation
- **Creative**: Journaling, drawing, writing
- **Physical**: Stretching, walking, movement
- **Mental**: Puzzles, games, brain training

**Lock System:**

- **One-Time Use**: Defocus can only be used once per focus cycle
- **Lock Message**: Friendly reminder when locked
- **Quick Reset**: 1-minute breathing exercise always available
- **Cycle Reset**: Unlocks after focus session completion

### ☕ Break Management

#### `BreakScreen.js` / `PomodoroScreen.js`

Smart break management with customizable durations and activities.

**Key Features:**

- **Break Types**: Micro (2min), Short (5min), Long (15min)
- **Break Activities**: Guided breathing, stretching, walking
- **Break Timer**: Visual countdown with progress tracking
- **Break Statistics**: Completion rates and streaks
- **Energy Points**: Earn points for taking breaks

**Break Types:**

- **Micro Break**: 2 minutes - Quick refresh
- **Short Break**: 5 minutes - Standard Pomodoro break
- **Long Break**: 15 minutes - Extended rest
- **Custom Break**: User-defined duration

**Break Activities:**

- **Guided Breathing**: 4-7-8 breathing technique
- **Stretching**: Simple desk stretches
- **Walking**: Step counter and walking guide
- **Meditation**: Short mindfulness exercises

### 📝 Task Management

#### `TodoScreen.js` / `EnhancedTodoScreen.js` / `WebTodoScreen.js`

Comprehensive task management with categories, priorities, and progress tracking.

**Key Features:**

- **Task Creation**: Add, edit, delete tasks
- **Categories**: Work, Study, Personal, Health, Shopping
- **Priorities**: High, Medium, Low with color coding
- **Due Dates**: Set and track task deadlines
- **Progress Tracking**: Daily completion statistics
- **Energy Points**: Earn points for task interactions

**Task Organization:**

- **Categories**: Organize tasks by type
- **Priorities**: Visual priority indicators
- **Due Dates**: Calendar integration
- **Completion Status**: Track progress
- **Search & Filter**: Find tasks quickly

**Progress Features:**

- **Daily Progress**: Completion percentage
- **Category Breakdown**: Progress by category
- **Streak Tracking**: Consecutive completion days
- **Statistics**: Total tasks, completion rates

### 🎵 Music & Relaxation

#### `MusicScreen.js`

Therapeutic audio system with background playback and mini-player.

**Key Features:**

- **4 Audio Categories**: Nature, Ambient, Focus, Relax
- **24 Audio Files**: High-quality, offline-capable sounds
- **Background Playback**: Music continues when switching features
- **Mini Player**: Floating controls for seamless management
- **Volume Control**: Persistent volume settings
- **Playlist Support**: Queue and manage multiple tracks

**Audio Categories:**

- **Nature**: Rain, forest, ocean, thunder, birds, wind
- **Ambient**: Space, city, cafe, library, fireplace, train
- **Focus**: Binaural beats, classical, lofi, piano, white/brown noise
- **Relax**: Meditation, spa, zen, chimes, singing bowls, flute

**Player Features:**

- **Play/Pause**: Space bar or touch controls
- **Volume Control**: Slider or keyboard shortcuts
- **Track Navigation**: Previous/next track
- **Background Mode**: Continues when app is backgrounded
- **Mini Player**: Floating controls for easy access

### 🏆 Rewards & Achievements

#### `RewardsScreen.js`

Gamified rewards system with energy points and badge unlocking.

**Key Features:**

- **Energy Points**: Earn points for every interaction
- **Badge System**: 6 unlockable badges (Bronze to Legendary)
- **Daily Goals**: Track daily energy point targets
- **Real-time Notifications**: Instant feedback for achievements
- **Progress Tracking**: Visual progress bars and statistics
- **Streak Tracking**: Consecutive day achievements

**Energy Points System:**

- **Focus Session Started**: +2 points
- **Break Started**: +1 point
- **Music Played**: +1 point
- **Task Completed**: +2 points
- **Task Created**: +1 point
- **Defocus Opened**: +1 point

**Badge System:**

- 🥉 **Bronze**: 10 energy points
- 🥈 **Silver**: 25 energy points
- 🥇 **Gold**: 50 energy points
- 💎 **Platinum**: 100 energy points
- 💠 **Diamond**: 250 energy points
- 👑 **Legendary**: 500 energy points

**Progress Features:**

- **Daily Progress**: Energy points toward daily goal
- **Badge Progress**: Progress toward next badge
- **Streak Display**: Consecutive achievement days
- **Statistics**: Total points, badges, sessions

### 📊 Statistics & Analytics

#### `Stats.js` / `StatsScreen.js`

Comprehensive analytics and progress tracking.

**Key Features:**

- **Session Statistics**: Focus sessions, breaks, completion rates
- **Task Statistics**: Tasks created, completed, categories
- **Energy Statistics**: Points earned, badges unlocked
- **Time Tracking**: Total focus time, break time
- **Progress Trends**: Daily, weekly, monthly progress
- **Achievement History**: Badge unlocks and milestones

**Statistics Categories:**

- **Focus Sessions**: Duration, completion, streaks
- **Break Activities**: Types, duration, completion
- **Task Management**: Created, completed, categories
- **Energy Points**: Earned, spent, daily goals
- **Badges**: Unlocked, progress, achievements

## 🔧 Technical Implementation

### Screen Architecture

- **React Native**: Cross-platform mobile development
- **Navigation**: Stack navigation between screens
- **State Management**: React Context for global state
- **Local Storage**: AsyncStorage for data persistence
- **Responsive Design**: Adaptive layouts for different screen sizes

### Data Flow

1. **User Interaction**: Touch, gesture, or voice input
2. **State Update**: Context or local state modification
3. **UI Update**: Component re-render with new data
4. **Persistence**: Save to AsyncStorage
5. **Notification**: Show feedback to user

### Performance Optimization

- **Lazy Loading**: Load screens on demand
- **Memoization**: Prevent unnecessary re-renders
- **Image Optimization**: Compress and cache images
- **Memory Management**: Clean up resources on unmount

## 🎨 Design Patterns

### Consistent UI Elements

- **Headers**: Standardized screen headers with back navigation
- **Buttons**: Consistent button styles and interactions
- **Cards**: Standardized card layouts for content
- **Progress Indicators**: Visual progress bars and rings
- **Notifications**: Toast messages and alerts

### Responsive Design

- **Mobile First**: Designed for mobile screens
- **Tablet Support**: Optimized for larger screens
- **Landscape Mode**: Support for landscape orientation
- **Accessibility**: Screen reader and keyboard support

## 🧪 Testing

### Screen Testing

- **Unit Tests**: Test individual screen components
- **Integration Tests**: Test screen interactions
- **Navigation Tests**: Test screen transitions
- **Performance Tests**: Test screen loading times

### User Testing

- **Usability Testing**: Test user interactions
- **Accessibility Testing**: Test screen reader support
- **Performance Testing**: Test on different devices
- **Cross-platform Testing**: Test on iOS and Android

## 📚 Related Documentation

- [Main README](../README.md) - Project overview
- [Components Documentation](../components/README.md) - UI components
- [Audio System Documentation](../../assets/audio/README.md) - Audio implementation
- [Web App Documentation](../../public/README.md) - Web implementation

## 🚀 Future Enhancements

### Planned Features

- **Advanced Analytics**: Detailed usage insights
- **Custom Themes**: User-selectable color schemes
- **Voice Commands**: Voice control for hands-free use
- **Social Features**: Share achievements and compete
- **AI Integration**: Smart recommendations and insights

### Technical Improvements

- **Offline Sync**: Sync data when connection is restored
- **Push Notifications**: Reminder and achievement notifications
- **Widgets**: Home screen widgets for quick access
- **Apple Watch**: Companion app for Apple Watch
- **Android Wear**: Companion app for Android Wear

---

**Need help with screens?** Check the [technical implementation section](#-technical-implementation) or create an issue in the repository.
