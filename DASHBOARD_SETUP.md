# Defocus2Focus React Native Dashboard

A modern, gamified dashboard screen for the Defocus2Focus app built with React Native, Expo, and NativeWind.

## Features

✅ **Interactive & Gamified Dashboard**

- Dynamic user greeting with personalized name
- Daily motivational quotes that rotate every 30 seconds
- Streak tracker with fire emoji
- XP and Coins display

✅ **Progress Tracking**

- Circular progress indicator for daily focus sessions
- Horizontal stat cards for key metrics
- Real-time progress updates

✅ **Action Grid**

- 6 feature buttons with attractive colors and icons
- "Start Defocus" highlighted as the main action
- Smooth animations on button press

✅ **Theme Support**

- Dark mode, light mode, and auto mode
- System theme detection
- Persistent theme preferences

✅ **Smooth Animations**

- React Native Reanimated for button interactions
- Staggered animations for stat cards
- Spring animations for natural feel

## Components Created

### 1. DashboardScreen (`src/screens/DashboardScreen.js`)

Main dashboard component with:

- Profile greeting section
- Progress tracking section
- Action buttons grid
- Focus goal progress bar
- Challenge friend button

### 2. ThemeContext (`src/contexts/ThemeContext.js`)

Theme management with:

- Dark/light/auto mode support
- System theme detection
- Persistent storage
- Context provider for app-wide theme access

### 3. UserContext (`src/contexts/UserContext.js`)

User data management with:

- User profile information
- Statistics tracking
- Daily progress monitoring
- Session management functions

### 4. Reusable Components

- `StatCard`: Animated stat display cards
- `ActionButton`: Interactive feature buttons
- `CircularProgress`: Progress indicator component

## Dependencies Added

```json
{
  "react-native-reanimated": "~3.6.2",
  "react-native-svg": "14.1.0",
  "lucide-react-native": "^0.263.1",
  "nativewind": "^2.0.11",
  "tailwindcss": "3.3.0"
}
```

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure NativeWind**

   - `tailwind.config.js` - TailwindCSS configuration
   - `metro.config.js` - Metro bundler configuration
   - `babel.config.js` - Babel configuration with NativeWind plugin
   - `global.css` - Global CSS file for TailwindCSS

3. **Run the App**
   ```bash
   npm start
   # or
   expo start
   ```

## Usage

The dashboard automatically:

- Displays the user's name from UserContext
- Shows real-time statistics and progress
- Updates daily goals and streaks
- Provides smooth animations and interactions

### User Data Structure

```javascript
const user = {
  name: "Paridhi",
  email: "",
  avatar: null,
  preferences: {
    notifications: true,
    soundEnabled: true,
    hapticFeedback: true,
  },
};

const stats = {
  totalFocusSessions: 0,
  totalDefocusSessions: 0,
  totalHoursFocused: 0,
  journalEntries: 0,
  currentStreak: 0,
  xp: 0,
  coins: 0,
  level: 1,
};
```

## Customization

### Colors

The dashboard uses a vibrant color scheme:

- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#ef4444)

### Animations

- Button press animations with spring physics
- Staggered card animations with delays
- Smooth transitions between states

### Layout

- Responsive design for different screen sizes
- Safe area handling for notched devices
- Scrollable content with proper spacing

## Integration

The dashboard integrates with:

- Theme system for dark/light mode
- User context for personalized data
- AsyncStorage for persistent data
- React Navigation for screen transitions

## Next Steps

1. Add navigation to feature screens
2. Implement actual session tracking
3. Add push notifications
4. Integrate with backend API
5. Add more gamification elements
6. Implement social features

## File Structure

```
src/
├── screens/
│   └── DashboardScreen.js
├── contexts/
│   ├── ThemeContext.js
│   └── UserContext.js
├── App.js
└── ...

Configuration Files:
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
├── global.css
└── nativewind.d.ts
```

The dashboard is now ready to use and provides a solid foundation for the Defocus2Focus app's main interface!
