import React, { useState, useEffect } from 'react';
import { UserDataProvider } from './contexts/UserDataContext';
import Navigation from './components/Navigation';
import Dashboard from './screens/Dashboard';
import FocusSession from './screens/FocusSession';
import DefocusBreak from './screens/DefocusBreak';
import Stats from './screens/Stats';
import TodoScreen from './screens/TodoScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  // Render the appropriate screen based on current state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} />;
      case 'focus':
        return <FocusSession onNavigate={setCurrentScreen} />;
      case 'defocus':
        return <DefocusBreak onNavigate={setCurrentScreen} />;
      case 'stats':
        return <Stats onNavigate={setCurrentScreen} />;
      case 'todos':
        return <TodoScreen onNavigate={setCurrentScreen} />;
      default:
        return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <UserDataProvider>
      <div className="min-h-screen bg-neutral-50">
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
            onNavigate={setCurrentScreen} 
          />
        </div>
      </div>
    </UserDataProvider>
  );
}

export default App;
