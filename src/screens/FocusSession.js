import React, { useState, useEffect, useRef } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import ProgressRing from '../components/ProgressRing';

const FocusSession = ({ onNavigate }) => {
  const { settings, addSession } = useUserData();
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [interruptions, setInterruptions] = useState(0);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Calculate progress percentage
  const totalTime = settings.focusDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      setSessionStartTime(new Date());
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Pause timer
  const pauseTimer = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      clearInterval(intervalRef.current);
    }
  };

  // Resume timer
  const resumeTimer = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Stop timer
  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    setTimeLeft(settings.focusDuration * 60);
    setSessionStartTime(null);
    setInterruptions(0);
  };

  // Complete session
  const completeSession = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    
    const sessionDuration = settings.focusDuration - Math.ceil(timeLeft / 60);
    const sessionData = {
      date: new Date().toISOString(),
      duration: sessionDuration,
      completed: timeLeft === 0,
      interruptions: interruptions,
      points: Math.floor(sessionDuration / 5) + (timeLeft === 0 ? 10 : 0)
    };
    
    addSession(sessionData);
    
    // Show completion message with requirements info
    if (timeLeft === 0) {
      if (sessionDuration >= 25) {
        alert('🎉 Focus session completed! Great job! You can now access defocus activities.');
      } else {
        alert('🎯 Focus session completed! However, you need at least 25 minutes to unlock defocus activities.');
      }
    } else {
      alert('Session ended early. Keep trying! You need to complete a full session to unlock defocus activities.');
    }
    
    // Reset timer
    setTimeLeft(settings.focusDuration * 60);
    setSessionStartTime(null);
    setInterruptions(0);
  };

  // Add interruption
  const addInterruption = () => {
    if (isRunning) {
      setInterruptions(prev => prev + 1);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Focus Session</h2>
        <p className="text-neutral-600">Stay focused and earn points!</p>
      </div>

      {/* Timer Display */}
      <div className="card text-center">
        <div className="flex justify-center mb-6">
          <ProgressRing 
            progress={progress} 
            size={200} 
            strokeWidth={12}
            color="focus"
            showPercentage={false}
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-focus-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg text-neutral-600">
                {isPaused ? 'Paused' : isRunning ? 'Focusing...' : 'Ready to start'}
              </div>
            </div>
          </ProgressRing>
        </div>

        {/* Progress Info */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-800">{settings.focusDuration}</div>
            <div className="text-sm text-neutral-600">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-800">{interruptions}</div>
            <div className="text-sm text-neutral-600">Interruptions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-800">
              {Math.floor((settings.focusDuration - Math.ceil(timeLeft / 60)) / 5) + (timeLeft === 0 ? 10 : 0)}
            </div>
            <div className="text-sm text-neutral-600">Points</div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="btn-focus text-lg px-8 py-4"
            >
              🎯 Start Focus
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="btn-focus text-lg px-8 py-4"
                >
                  ▶️ Resume
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  ⏸️ Pause
                </button>
              )}
              <button
                onClick={stopTimer}
                className="btn-secondary text-lg px-8 py-4"
              >
                ⏹️ Stop
              </button>
            </>
          )}
        </div>
      </div>

      {/* Session Info */}
      {sessionStartTime && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3 text-neutral-800">Session Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">Started:</span>
              <div className="font-medium">
                {sessionStartTime.toLocaleTimeString()}
              </div>
            </div>
            <div>
              <span className="text-neutral-600">Elapsed:</span>
              <div className="font-medium">
                {Math.floor((Date.now() - sessionStartTime.getTime()) / 1000 / 60)} minutes
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={addInterruption}
          disabled={!isRunning}
          className={`card text-center py-6 transition-all duration-200 ${
            isRunning 
              ? 'hover:bg-neutral-100 cursor-pointer' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="text-2xl mb-2">⚠️</div>
          <div className="font-semibold text-neutral-800">Add Interruption</div>
          <div className="text-sm text-neutral-600">Track when you get distracted</div>
        </button>

        <button
          onClick={() => onNavigate('defocus')}
          className="card-hover text-center py-6"
        >
          <div className="text-2xl mb-2">🌿</div>
          <div className="font-semibold text-neutral-800">Take a Break</div>
          <div className="text-sm text-neutral-600">Switch to break mode</div>
        </button>
      </div>

      {/* Tips */}
      <div className="card bg-focus-50 border-focus-200">
        <h3 className="text-lg font-semibold mb-3 text-focus-800">💡 Focus Tips</h3>
        <ul className="space-y-2 text-sm text-focus-700">
          <li>• Find a quiet space and eliminate distractions</li>
          <li>• Set a clear goal for what you want to accomplish</li>
          <li>• Use the interruption button to track distractions</li>
          <li>• Take regular breaks to maintain mental energy</li>
        </ul>
      </div>
    </div>
  );
};

export default FocusSession;
