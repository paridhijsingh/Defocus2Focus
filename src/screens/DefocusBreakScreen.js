import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useUserData } from '../contexts/UserDataContext';
import ProgressRing from '../components/ProgressRing';

const { width } = Dimensions.get('window');

/**
 * Defocus Break Screen
 * Break timer with breathing exercise and mini-game placeholders
 */
const DefocusBreakScreen = () => {
  const { settings } = useUserData();
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(settings.breakDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentGame, setCurrentGame] = useState('breathing');
  
  // Breathing animation state
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // 'inhale' or 'exhale'
  const [breathCount, setBreathCount] = useState(0);
  const breathScale = useRef(new Animated.Value(1)).current;
  const breathOpacity = useRef(new Animated.Value(0.3)).current;
  
  // Timer interval reference
  const intervalRef = useRef(null);
  const breathIntervalRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((settings.breakDuration * 60 - timeLeft) / (settings.breakDuration * 60)) * 100;

  // Breathing animation
  const startBreathingAnimation = () => {
    const breatheIn = Animated.parallel([
      Animated.timing(breathScale, {
        toValue: 1.5,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(breathOpacity, {
        toValue: 0.8,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]);

    const breatheOut = Animated.parallel([
      Animated.timing(breathScale, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(breathOpacity, {
        toValue: 0.3,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]);

    const breathCycle = Animated.sequence([
      breatheIn,
      breatheOut,
    ]);

    Animated.loop(breathCycle).start();
  };

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Breathing effect
  useEffect(() => {
    if (isRunning && currentGame === 'breathing') {
      startBreathingAnimation();
      
      breathIntervalRef.current = setInterval(() => {
        setBreathingPhase(prev => {
          const newPhase = prev === 'inhale' ? 'exhale' : 'inhale';
          if (newPhase === 'inhale') {
            setBreathCount(prev => prev + 1);
          }
          return newPhase;
        });
      }, 4000);
    } else {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
      breathScale.setValue(1);
      breathOpacity.setValue(0.3);
    }

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [isRunning, currentGame]);

  // Start break timer
  const startBreak = () => {
    setIsRunning(true);
  };

  // Stop break timer
  const stopBreak = () => {
    setIsRunning(false);
    setTimeLeft(settings.breakDuration * 60);
    setBreathCount(0);
  };

  // Reset break timer
  const resetBreak = () => {
    setIsRunning(false);
    setTimeLeft(settings.breakDuration * 60);
    setBreathCount(0);
    setBreathingPhase('inhale');
  };

  // Render breathing exercise
  const renderBreathingExercise = () => (
    <View style={styles.breathingContainer}>
      <Text style={styles.breathingTitle}>Breathing Exercise</Text>
      <Text style={styles.breathingSubtitle}>
        Follow the circle to breathe mindfully
      </Text>
      
      <View style={styles.breathingCircleContainer}>
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              transform: [{ scale: breathScale }],
              opacity: breathOpacity,
            },
          ]}
        >
          <Text style={styles.breathingText}>
            {breathingPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
          </Text>
        </Animated.View>
      </View>
      
      <View style={styles.breathingStats}>
        <Text style={styles.breathCount}>Breaths: {breathCount}</Text>
        <Text style={styles.breathingPhase}>
          {breathingPhase === 'inhale' ? 'Inhaling...' : 'Exhaling...'}
        </Text>
      </View>
    </View>
  );

  // Render puzzle game placeholder
  const renderPuzzleGame = () => (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>🧩 Puzzle Game</Text>
      <Text style={styles.gameSubtitle}>Coming Soon!</Text>
      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>
          Interactive puzzles to keep your mind active during breaks
        </Text>
      </View>
    </View>
  );

  // Render meditation game placeholder
  const renderMeditationGame = () => (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>🧘 Meditation</Text>
      <Text style={styles.gameSubtitle}>Coming Soon!</Text>
      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>
          Guided meditation sessions for relaxation
        </Text>
      </View>
    </View>
  );

  // Render stretching game placeholder
  const renderStretchingGame = () => (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>🤸 Stretching</Text>
      <Text style={styles.gameSubtitle}>Coming Soon!</Text>
      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>
          Quick stretching exercises to refresh your body
        </Text>
      </View>
    </View>
  );

  // Render current game
  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'breathing':
        return renderBreathingExercise();
      case 'puzzle':
        return renderPuzzleGame();
      case 'meditation':
        return renderMeditationGame();
      case 'stretching':
        return renderStretchingGame();
      default:
        return renderBreathingExercise();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Timer Section */}
        <View style={styles.timerSection}>
          <ProgressRing
            progress={progress}
            size={200}
            strokeWidth={10}
            color="defocus"
            showPercentage={false}
          >
            <View style={styles.timerContent}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>
                {isRunning ? 'Break Time' : 'Ready for Break'}
              </Text>
            </View>
          </ProgressRing>
        </View>

        {/* Break Controls */}
        <View style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startBreak}>
              <Text style={styles.startButtonText}>Start Break</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.runningControls}>
              <TouchableOpacity style={styles.stopButton} onPress={stopBreak}>
                <Text style={styles.stopButtonText}>End Break</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity style={styles.resetButton} onPress={resetBreak}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Game Selection */}
        <View style={styles.gameSelection}>
          <Text style={styles.sectionTitle}>Break Activities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.gameTab,
                currentGame === 'breathing' && styles.activeGameTab,
              ]}
              onPress={() => setCurrentGame('breathing')}
            >
              <Text style={[
                styles.gameTabText,
                currentGame === 'breathing' && styles.activeGameTabText,
              ]}>
                🌬️ Breathing
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.gameTab,
                currentGame === 'puzzle' && styles.activeGameTab,
              ]}
              onPress={() => setCurrentGame('puzzle')}
            >
              <Text style={[
                styles.gameTabText,
                currentGame === 'puzzle' && styles.activeGameTabText,
              ]}>
                🧩 Puzzle
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.gameTab,
                currentGame === 'meditation' && styles.activeGameTab,
              ]}
              onPress={() => setCurrentGame('meditation')}
            >
              <Text style={[
                styles.gameTabText,
                currentGame === 'meditation' && styles.activeGameTabText,
              ]}>
                🧘 Meditation
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.gameTab,
                currentGame === 'stretching' && styles.activeGameTab,
              ]}
              onPress={() => setCurrentGame('stretching')}
            >
              <Text style={[
                styles.gameTabText,
                currentGame === 'stretching' && styles.activeGameTabText,
              ]}>
                🤸 Stretching
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Current Game */}
        <View style={styles.gameSection}>
          {renderCurrentGame()}
        </View>

        {/* Break Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Break Tips</Text>
          <Text style={styles.tipsText}>
            • Step away from your screen{'\n'}
            • Do some light stretching{'\n'}
            • Take a short walk{'\n'}
            • Stay hydrated{'\n'}
            • Practice deep breathing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  controls: {
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  runningControls: {
    marginBottom: 16,
  },
  stopButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  gameSelection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  gameTab: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  activeGameTab: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  gameTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeGameTabText: {
    color: 'white',
  },
  gameSection: {
    marginBottom: 30,
  },
  breathingContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  breathingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  breathingSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  breathingCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#bbf7d0',
  },
  breathingText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  breathingStats: {
    alignItems: 'center',
  },
  breathCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  breathingPhase: {
    fontSize: 14,
    color: '#64748b',
  },
  gameContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  gameSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  placeholderBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default DefocusBreakScreen;
