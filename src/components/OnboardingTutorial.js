import React, { useState, useEffect } from 'react';

const OnboardingTutorial = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Defocus2Focus! 🎯',
      subtitle: 'Where Procrastination Meets Play',
      description: 'Transform your productivity with our gamified approach to focus and breaks.',
      icon: '🎯',
      color: 'blue',
      illustration: '✨'
    },
    {
      id: 'focus-mode',
      title: 'Focus Mode 🎯',
      subtitle: 'Deep Work Made Fun',
      description: 'Set timers, track progress, and complete tasks while earning energy points and unlocking achievements.',
      icon: '🎯',
      color: 'blue',
      illustration: '⏰',
      features: ['Pomodoro Timer', 'Task Management', 'Progress Tracking', 'Energy Points']
    },
    {
      id: 'defocus-mode',
      title: 'Defocus Mode 🌿',
      subtitle: 'Mindful Breaks & Recovery',
      description: 'Take purposeful breaks with guided activities, mini-games, and relaxation techniques.',
      icon: '🌿',
      color: 'orange',
      illustration: '🧘',
      features: ['Mini Games', 'Breathing Exercises', 'Journaling', 'AI Therapist']
    },
    {
      id: 'switching-modes',
      title: 'Smart Mode Switching 🔄',
      subtitle: 'Seamless Transitions',
      description: 'Easily switch between Focus and Defocus modes with our intuitive toggle system.',
      icon: '🔄',
      color: 'purple',
      illustration: '⚡',
      features: ['One-Click Toggle', 'Smart Suggestions', 'Context Awareness', 'Smooth Transitions']
    },
    {
      id: 'rewards',
      title: 'Rewards & Motivation 🏆',
      subtitle: 'Stay Motivated',
      description: 'Earn badges, track streaks, and unlock achievements as you build better productivity habits.',
      icon: '🏆',
      color: 'green',
      illustration: '⭐',
      features: ['Achievement Badges', 'Daily Streaks', 'Energy Points', 'Progress Analytics']
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="relative bg-gray-50 px-4 py-3">
          <div className={`h-2 bg-gradient-to-r ${
            currentStepData.color === 'blue' ? 'from-blue-400 to-blue-600' :
            currentStepData.color === 'orange' ? 'from-orange-400 to-orange-600' :
            currentStepData.color === 'purple' ? 'from-purple-400 to-purple-600' :
            'from-green-400 to-green-600'
          }`} style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
          
          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-2 right-4 px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-all duration-200 text-sm font-medium rounded-lg border border-gray-300 bg-white shadow-sm"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Illustration */}
          <div className="mb-6">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${
              currentStepData.color === 'blue' ? 'bg-blue-100' :
              currentStepData.color === 'orange' ? 'bg-orange-100' :
              currentStepData.color === 'purple' ? 'bg-purple-100' :
              'bg-green-100'
            }`}>
              <span className="text-4xl">{currentStepData.illustration}</span>
            </div>
            <div className="text-6xl mb-2">{currentStepData.icon}</div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          
          {/* Subtitle */}
          <h3 className={`text-lg font-semibold mb-4 ${
            currentStepData.color === 'blue' ? 'text-blue-600' :
            currentStepData.color === 'orange' ? 'text-orange-600' :
            currentStepData.color === 'purple' ? 'text-purple-600' :
            'text-green-600'
          }`}>
            {currentStepData.subtitle}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Features List */}
          {currentStepData.features && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? currentStepData.color === 'blue' ? 'bg-blue-500' :
                      currentStepData.color === 'orange' ? 'bg-orange-500' :
                      currentStepData.color === 'purple' ? 'bg-purple-500' :
                      'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="flex justify-between items-center">
            {/* Back Button */}
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isFirstStep
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Back
            </button>

            {/* Skip Button (Center) */}
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
            >
              Skip Tutorial
            </button>

            {/* Next/Complete Button */}
            <button
              onClick={nextStep}
              className={`px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 transform hover:scale-105 ${
                currentStepData.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                currentStepData.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                currentStepData.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600' :
                'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isLastStep ? 'Start My Journey' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
