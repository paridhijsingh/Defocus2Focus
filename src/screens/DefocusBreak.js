import React, { useState, useEffect, useRef } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import ProgressRing from '../components/ProgressRing';

const DefocusBreak = ({ onNavigate }) => {
  const { settings } = useUserData();
  const [timeLeft, setTimeLeft] = useState(settings.breakDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentGame, setCurrentGame] = useState('breathing');
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(0);
  
  const intervalRef = useRef(null);
  const breathIntervalRef = useRef(null);

  // Calculate progress percentage
  const totalTime = settings.breakDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start break timer
  const startBreak = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start breathing exercise
      startBreathingExercise();
    }
  };

  // Pause break
  const pauseBreak = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      clearInterval(intervalRef.current);
      clearInterval(breathIntervalRef.current);
    }
  };

  // Resume break
  const resumeBreak = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      startBreathingExercise();
    }
  };

  // Stop break
  const stopBreak = () => {
    setIsRunning(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    clearInterval(breathIntervalRef.current);
    setTimeLeft(settings.breakDuration * 60);
    setBreathCount(0);
    setBreathPhase('inhale');
  };

  // Complete break
  const completeBreak = () => {
    clearInterval(intervalRef.current);
    clearInterval(breathIntervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    
    alert('🌿 Break completed! Ready to focus again?');
    
    setTimeLeft(settings.breakDuration * 60);
    setBreathCount(0);
    setBreathPhase('inhale');
  };

  // Start breathing exercise
  const startBreathingExercise = () => {
    let phaseTime = 0;
    const phaseDuration = 4000; // 4 seconds per phase
    
    breathIntervalRef.current = setInterval(() => {
      phaseTime += 100;
      
      if (phaseTime >= phaseDuration) {
        phaseTime = 0;
        setBreathCount(prev => prev + 1);
      }
      
      if (phaseTime < 2000) {
        setBreathPhase('inhale');
      } else if (phaseTime < 3000) {
        setBreathPhase('hold');
      } else {
        setBreathPhase('exhale');
      }
    }, 100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, []);

  // Mini-game components
  const BreathingGame = () => (
    <div className="text-center">
      <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-1000 ${
        breathPhase === 'inhale' ? 'bg-defocus-400 scale-110' :
        breathPhase === 'hold' ? 'bg-defocus-500 scale-125' :
        'bg-defocus-300 scale-100'
      }`}>
        <span className="text-4xl">🌬️</span>
      </div>
      
      <div className="text-2xl font-bold text-defocus-700 mb-2">
        {breathPhase === 'inhale' ? 'Breathe In...' :
         breathPhase === 'hold' ? 'Hold...' :
         'Breathe Out...'}
      </div>
      
      <div className="text-lg text-neutral-600">
        Breath #{breathCount + 1}
      </div>
    </div>
  );

  const PuzzleGame = () => (
    <div className="text-center">
      <div className="text-6xl mb-4">🧩</div>
      <div className="text-xl font-semibold text-neutral-800 mb-2">
        Mind Puzzle
      </div>
      <div className="text-neutral-600 mb-4">
        Coming soon! This will be a simple brain teaser.
      </div>
      <div className="bg-neutral-100 rounded-lg p-4">
        <div className="text-sm text-neutral-500">
          Mini-games will be added here to help refresh your mind during breaks.
        </div>
      </div>
    </div>
  );

  const MeditationGame = () => (
    <div className="text-center">
      <div className="text-6xl mb-4 animate-pulse-slow">🧘</div>
      <div className="text-xl font-semibold text-neutral-800 mb-2">
        Guided Meditation
      </div>
      <div className="text-neutral-600 mb-4">
        Coming soon! This will be a short guided meditation.
      </div>
      <div className="bg-neutral-100 rounded-lg p-4">
        <div className="text-sm text-neutral-500">
          Take a moment to center yourself and find inner peace.
        </div>
      </div>
    </div>
  );

  const StretchingGame = () => (
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce-slow">🤸</div>
      <div className="text-xl font-semibold text-neutral-800 mb-2">
        Quick Stretches
      </div>
      <div className="text-neutral-600 mb-4">
        Coming soon! This will guide you through simple stretches.
      </div>
      <div className="bg-neutral-100 rounded-lg p-4">
        <div className="text-sm text-neutral-500">
          Perfect for desk workers to relieve tension and improve posture.
        </div>
      </div>
    </div>
  );

  const renderGame = () => {
    switch (currentGame) {
      case 'breathing':
        return <BreathingGame />;
      case 'puzzle':
        return <PuzzleGame />;
      case 'meditation':
        return <MeditationGame />;
      case 'stretching':
        return <StretchingGame />;
      default:
        return <BreathingGame />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Defocus Break</h2>
        <p className="text-neutral-600">Relax, refresh, and recharge your mind</p>
      </div>

      {/* Timer Display */}
      <div className="card text-center">
        <div className="flex justify-center mb-6">
          <ProgressRing 
            progress={progress} 
            size={200} 
            strokeWidth={12}
            color="defocus"
            showPercentage={false}
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-defocus-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg text-neutral-600">
                {isPaused ? 'Paused' : isRunning ? 'Relaxing...' : 'Ready to relax'}
              </div>
            </div>
          </ProgressRing>
        </div>

        {/* Break Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          {!isRunning ? (
            <button
              onClick={startBreak}
              className="btn-defocus text-lg px-8 py-4"
            >
              🌿 Start Break
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={resumeBreak}
                  className="btn-defocus text-lg px-8 py-4"
                >
                  ▶️ Resume
                </button>
              ) : (
                <button
                  onClick={pauseBreak}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  ⏸️ Pause
                </button>
              )}
              <button
                onClick={stopBreak}
                className="btn-secondary text-lg px-8 py-4"
              >
                ⏹️ End
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mini-Game Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-neutral-800">Break Activities</h3>
          <div className="flex space-x-2">
            {['breathing', 'puzzle', 'meditation', 'stretching'].map((game) => (
              <button
                key={game}
                onClick={() => setCurrentGame(game)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentGame === game
                    ? 'bg-defocus-100 text-defocus-700'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {game === 'breathing' && '🌬️'}
                {game === 'puzzle' && '🧩'}
                {game === 'meditation' && '🧘'}
                {game === 'stretching' && '🤸'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="min-h-[200px] flex items-center justify-center">
          {renderGame()}
        </div>
      </div>

      {/* Break Tips */}
      <div className="card bg-defocus-50 border-defocus-200">
        <h3 className="text-lg font-semibold mb-3 text-defocus-800">💡 Break Tips</h3>
        <ul className="space-y-2 text-sm text-defocus-700">
          <li>• Step away from your screen and stretch</li>
          <li>• Take deep breaths to reduce stress</li>
          <li>• Look at something far away to rest your eyes</li>
          <li>• Use this time to hydrate and move around</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('focus')}
          className="card-hover text-center py-6"
        >
          <div className="text-2xl mb-2">🎯</div>
          <div className="font-semibold text-neutral-800">Back to Focus</div>
          <div className="text-sm text-neutral-600">Ready to work again</div>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="card-hover text-center py-6"
        >
          <div className="text-2xl mb-2">🏠</div>
          <div className="font-semibold text-neutral-800">Dashboard</div>
          <div className="text-sm text-neutral-600">View your progress</div>
        </button>
      </div>
    </div>
  );
};

export default DefocusBreak;
