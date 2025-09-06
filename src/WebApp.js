import React, { useState, useEffect } from 'react';
import OnboardingTutorial from './components/OnboardingTutorial';
import WebAnalyticsDashboard from './components/WebAnalyticsDashboard';
import DefocusSection from './components/defocus/DefocusSection';
import WelcomeScreen from './components/WelcomeScreen';
// Global CSS import removed to avoid Metro parsing CSS

const WebApp = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding before
    const completed = localStorage.getItem('defocus2focus_onboarding_completed');
    if (!completed) {
      setShowOnboarding(true);
    } else {
      setHasCompletedOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('defocus2focus_onboarding_completed', 'true');
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
    setCurrentScreen('dashboard');
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('defocus2focus_onboarding_completed', 'true');
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
    setCurrentScreen('dashboard');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('defocus2focus_onboarding_completed');
    setShowOnboarding(true);
    setHasCompletedOnboarding(false);
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">🎯 Defocus2Focus</h1>
              <span className="ml-3 text-sm text-gray-500">Where Procrastination Meets Play</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentScreen('analytics')}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                📊 Analytics Dashboard
              </button>
              <button
                onClick={resetOnboarding}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                🔄 Reset Tutorial
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Focus Mode Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Focus Mode</h3>
                <p className="text-sm text-gray-600">Deep work sessions</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Set timers, track progress, and complete tasks while earning energy points.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Pomodoro Timer</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Task Management</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Progress Tracking</span>
            </div>
          </div>

          {/* Defocus Mode Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Defocus Mode</h3>
                <p className="text-sm text-gray-600">Mindful breaks</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Take purposeful breaks with guided activities and relaxation techniques.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Mini Games</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Breathing</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Journaling</span>
            </div>
          </div>

          {/* Mode Switching Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Switching</h3>
                <p className="text-sm text-gray-600">Seamless transitions</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Easily switch between Focus and Defocus modes with our intuitive toggle system.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">One-Click Toggle</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Smart Suggestions</span>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Rewards & Motivation</h3>
                <p className="text-sm text-gray-600">Stay motivated</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Earn badges, track streaks, and unlock achievements as you build better habits.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Achievement Badges</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Daily Streaks</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Energy Points</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <span className="mr-2">🎯</span>
                Start Focus Session
              </button>
              <button onClick={() => setCurrentScreen('defocus')} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <span className="mr-2">🌿</span>
                Take Defocus Break
              </button>
              <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <span className="mr-2">📝</span>
                Manage Tasks
              </button>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Focus Sessions</span>
                <span className="text-sm font-semibold text-blue-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Energy Points</span>
                <span className="text-sm font-semibold text-green-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Streak</span>
                <span className="text-sm font-semibold text-orange-600">0 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        {hasCompletedOnboarding && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🎉</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Welcome to Defocus2Focus!</h3>
                <p className="text-blue-100">You're all set to start your productivity journey. Ready to transform procrastination into play?</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  const handleGetStarted = () => {
    setShowOnboarding(true);
    setCurrentScreen('onboarding');
  };

  return (
    <div>
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onGetStarted={handleGetStarted}
          onLearnMore={() => setCurrentScreen('analytics')}
          logoSrc="/assets/logo/defocus2focus-hero.png"
          logoAlt="Defocus2Focus"
        />
      )}

      {showOnboarding && (
        <OnboardingTutorial
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {hasCompletedOnboarding && currentScreen === 'analytics' && (
        <WebAnalyticsDashboard
          user={{ name: 'Paridhi', level: 12 }}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {hasCompletedOnboarding && currentScreen === 'defocus' && (
        <DefocusSection />
      )}

      {hasCompletedOnboarding && currentScreen === 'dashboard' && renderDashboard()}
    </div>
  );
};

export default WebApp;
