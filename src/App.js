import React, { useState, useEffect } from 'react';
import { UserDataProvider } from './contexts/UserDataContext';
import { FocusProvider, useFocus } from './contexts/FocusContext';
import Navigation from './components/Navigation';
import Dashboard from './screens/Dashboard';
import FocusSession from './screens/FocusSession';
import DefocusBreak from './screens/DefocusBreak';
import Stats from './screens/Stats';
import TodoScreen from './screens/TodoScreen';
import SessionDebugger from './components/SessionDebugger';

// Inner App component that has access to FocusContext
const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const { isDefocusAvailable, getDefocusLockMessage } = useFocus();

  // Handle navigation with session cycle checks
  const handleNavigation = (screen) => {
    if (screen === 'defocus' && !isDefocusAvailable()) {
      // Show lock message and prevent navigation
      alert(`🔒 Defocus Locked\n\n${getDefocusLockMessage()}`);
      return;
    }
    setCurrentScreen(screen);
  };

  // Check if current screen should be accessible
  useEffect(() => {
    if (currentScreen === 'defocus' && !isDefocusAvailable()) {
      // Redirect to dashboard if defocus is locked
      setCurrentScreen('dashboard');
      alert(`🔒 Defocus Locked\n\n${getDefocusLockMessage()}`);
    }
  }, [currentScreen, isDefocusAvailable, getDefocusLockMessage]);

  // Render the appropriate screen based on current state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />;
      case 'focus':
        return <FocusSession onNavigate={handleNavigation} />;
      case 'defocus':
        return <DefocusBreak onNavigate={handleNavigation} />;
      case 'stats':
        return <Stats onNavigate={handleNavigation} />;
      case 'todos':
        return <TodoScreen onNavigate={handleNavigation} />;
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Debug Panel - Remove in production */}
      <SessionDebugger />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Defocus2Focus
          </h1>
          <p className="text-neutral-600 text-lg">
            Where Procrastination Meets Play
          </p>
        </header>

        {/* Main Content */}
        <main className="mb-8">
          {renderScreen()}
        </main>

        {/* Navigation */}
        <Navigation 
          currentScreen={currentScreen} 
          onNavigate={handleNavigation} 
        />
      </div>
    </div>
  );
};

// Main App component with providers
function App() {
  return (
    <UserDataProvider>
      <FocusProvider>
        <AppContent />
      </FocusProvider>
    </UserDataProvider>
  );
}

export default App;
