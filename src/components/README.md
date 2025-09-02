# 🧩 Components

The Defocus2Focus components library provides reusable UI components for both React Native and web platforms. These components follow consistent design patterns and are designed for modularity and reusability.

## 📁 Component Overview

```
src/components/
├── CycleCounter.js          # Session cycle tracking component
├── DefocusButton.js         # Defocus session trigger button
├── MiniGame.js              # Mini-games for break activities
├── Navigation.js            # App navigation component
├── ProgressBar.js           # Visual progress indicators
├── ProgressRing.js          # Circular progress displays
├── QuickResetModal.js       # Quick reset functionality
├── SessionDebugger.js       # Debug information display
├── StatCard.js              # Statistics display cards
├── TaskFilters.js           # Task filtering controls
├── TaskInput.js             # Task creation input
├── TaskItem.js              # Individual task display
├── TaskList.js              # Task list container
├── WebTaskInput.js          # Web-specific task input
├── WebTaskItem.js           # Web-specific task item
└── README.md                # This documentation
```

## 🎯 Core Components

### 📊 Progress Components

#### `ProgressBar.js`

Linear progress indicator for timers and goals.

**Props:**

- `progress` (number): Progress value (0-100)
- `color` (string): Progress bar color
- `height` (number): Bar height in pixels
- `animated` (boolean): Enable smooth animations

**Usage:**

```jsx
<ProgressBar progress={75} color="#4CAF50" height={8} animated={true} />
```

#### `ProgressRing.js`

Circular progress indicator for focus sessions.

**Props:**

- `progress` (number): Progress value (0-100)
- `size` (number): Ring diameter
- `strokeWidth` (number): Ring thickness
- `color` (string): Ring color
- `backgroundColor` (string): Background ring color

**Usage:**

```jsx
<ProgressRing progress={60} size={120} strokeWidth={8} color="#2196F3" />
```

### 🎮 Interactive Components

#### `DefocusButton.js`

Smart button for triggering defocus sessions with lock state management.

**Props:**

- `onPress` (function): Button press handler
- `isLocked` (boolean): Lock state
- `lockMessage` (string): Message when locked
- `disabled` (boolean): Disable button

**Usage:**

```jsx
<DefocusButton
  onPress={handleDefocus}
  isLocked={isDefocusLocked}
  lockMessage="Defocus will unlock after your session"
/>
```

#### `QuickResetModal.js`

Modal for quick reset functionality during locked states.

**Props:**

- `visible` (boolean): Modal visibility
- `onClose` (function): Close handler
- `onReset` (function): Reset handler
- `duration` (number): Reset duration in minutes

**Usage:**

```jsx
<QuickResetModal
  visible={showResetModal}
  onClose={() => setShowResetModal(false)}
  onReset={handleQuickReset}
  duration={1}
/>
```

### 📝 Task Management Components

#### `TaskInput.js`

Input component for creating new tasks.

**Props:**

- `onSubmit` (function): Submit handler
- `placeholder` (string): Input placeholder
- `categories` (array): Available categories
- `priorities` (array): Available priorities

**Usage:**

```jsx
<TaskInput
  onSubmit={handleTaskSubmit}
  placeholder="Enter new task..."
  categories={["Work", "Study", "Personal"]}
  priorities={["High", "Medium", "Low"]}
/>
```

#### `TaskItem.js`

Individual task display with edit and delete functionality.

**Props:**

- `task` (object): Task data
- `onToggle` (function): Toggle completion
- `onEdit` (function): Edit handler
- `onDelete` (function): Delete handler

**Usage:**

```jsx
<TaskItem
  task={task}
  onToggle={handleTaskToggle}
  onEdit={handleTaskEdit}
  onDelete={handleTaskDelete}
/>
```

#### `TaskList.js`

Container for displaying and managing task lists.

**Props:**

- `tasks` (array): Task data array
- `onTaskUpdate` (function): Task update handler
- `onTaskDelete` (function): Task delete handler
- `filter` (string): Current filter
- `sortBy` (string): Sort criteria

**Usage:**

```jsx
<TaskList
  tasks={tasks}
  onTaskUpdate={handleTaskUpdate}
  onTaskDelete={handleTaskDelete}
  filter="all"
  sortBy="dueDate"
/>
```

#### `TaskFilters.js`

Filtering and sorting controls for tasks.

**Props:**

- `onFilterChange` (function): Filter change handler
- `onSortChange` (function): Sort change handler
- `currentFilter` (string): Active filter
- `currentSort` (string): Active sort

**Usage:**

```jsx
<TaskFilters
  onFilterChange={handleFilterChange}
  onSortChange={handleSortChange}
  currentFilter="work"
  currentSort="priority"
/>
```

### 📊 Statistics Components

#### `StatCard.js`

Display card for statistics and metrics.

**Props:**

- `title` (string): Card title
- `value` (string/number): Display value
- `icon` (string): Icon name or emoji
- `color` (string): Card color theme
- `trend` (object): Trend data (optional)

**Usage:**

```jsx
<StatCard
  title="Focus Sessions"
  value={12}
  icon="🎯"
  color="blue"
  trend={{ direction: "up", value: 15 }}
/>
```

#### `CycleCounter.js`

Component for tracking session cycles and streaks.

**Props:**

- `cycles` (number): Number of completed cycles
- `streak` (number): Current streak
- `goal` (number): Daily goal
- `onGoalUpdate` (function): Goal update handler

**Usage:**

```jsx
<CycleCounter cycles={5} streak={3} goal={8} onGoalUpdate={handleGoalUpdate} />
```

### 🎮 Game Components

#### `MiniGame.js`

Mini-games for break activities and engagement.

**Props:**

- `gameType` (string): Type of game
- `duration` (number): Game duration
- `onComplete` (function): Completion handler
- `difficulty` (string): Game difficulty

**Usage:**

```jsx
<MiniGame
  gameType="breathing"
  duration={120}
  onComplete={handleGameComplete}
  difficulty="easy"
/>
```

### 🧭 Navigation Components

#### `Navigation.js`

Main navigation component for app routing.

**Props:**

- `currentScreen` (string): Active screen
- `onScreenChange` (function): Screen change handler
- `screens` (array): Available screens

**Usage:**

```jsx
<Navigation
  currentScreen="home"
  onScreenChange={handleScreenChange}
  screens={["home", "focus", "breaks", "rewards"]}
/>
```

### 🔧 Utility Components

#### `SessionDebugger.js`

Debug information display for development.

**Props:**

- `sessionState` (object): Current session state
- `isVisible` (boolean): Debug panel visibility
- `onToggle` (function): Toggle handler

**Usage:**

```jsx
<SessionDebugger
  sessionState={sessionState}
  isVisible={showDebug}
  onToggle={() => setShowDebug(!showDebug)}
/>
```

## 🌐 Web-Specific Components

### `WebTaskInput.js`

Web-optimized task input with enhanced features.

**Features:**

- Keyboard shortcuts
- Auto-save functionality
- Rich text formatting
- Drag and drop support

### `WebTaskItem.js`

Web-optimized task item with advanced interactions.

**Features:**

- Hover effects
- Context menus
- Keyboard navigation
- Accessibility support

## 🎨 Styling Guidelines

### Design System

- **Colors**: Consistent color palette across components
- **Typography**: Standardized font sizes and weights
- **Spacing**: Consistent margin and padding values
- **Animations**: Smooth transitions and micro-interactions

### Responsive Design

- **Mobile First**: Components designed for mobile screens
- **Breakpoints**: Consistent responsive breakpoints
- **Touch Targets**: Minimum 44px touch targets
- **Accessibility**: Screen reader and keyboard support

## 🔧 Development

### Adding New Components

1. **Create component file** in appropriate directory
2. **Follow naming convention** (PascalCase)
3. **Add PropTypes** for type checking
4. **Include JSDoc comments** for documentation
5. **Add to this README** with usage examples

### Component Structure

```jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {function} props.onPress - Press handler
 */
const MyComponent = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // styles
  },
  title: {
    // styles
  },
});

export default MyComponent;
```

### Testing Components

- **Unit Tests**: Test individual component behavior
- **Integration Tests**: Test component interactions
- **Visual Tests**: Test component appearance
- **Accessibility Tests**: Test screen reader support

## 📚 Related Documentation

- [Main README](../README.md) - Project overview
- [Screens Documentation](../screens/README.md) - App screens
- [Audio System Documentation](../../assets/audio/README.md) - Audio implementation
- [Web App Documentation](../../public/README.md) - Web implementation

## 🚀 Future Enhancements

### Planned Components

- **AudioPlayer**: Dedicated audio playback component
- **Calendar**: Task scheduling and due date management
- **Charts**: Data visualization components
- **Notifications**: Toast and alert components
- **Settings**: Configuration and preferences

### Technical Improvements

- **TypeScript**: Type safety for all components
- **Storybook**: Component documentation and testing
- **Testing**: Comprehensive test coverage
- **Performance**: Optimize rendering and memory usage

---

**Need help with components?** Check the [development section](#-development) or create an issue in the repository.
