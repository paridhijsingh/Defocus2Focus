import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Lightweight Mini-Game Component
 * Simple brain teaser to help users relax during defocus breaks
 * Only unlocked after completing focus sessions to prevent abuse
 */
const MiniGame = ({ onComplete, onClose }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second game
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Simple math questions for brain exercise
  const questions = [
    { question: '7 + 8 = ?', answer: 15, options: [12, 15, 17, 20] },
    { question: '12 × 4 = ?', answer: 48, options: [44, 48, 52, 56] },
    { question: '25 ÷ 5 = ?', answer: 5, options: [3, 5, 7, 10] },
    { question: '9² = ?', answer: 81, options: [72, 81, 90, 99] },
    { question: '16 + 24 = ?', answer: 40, options: [36, 40, 44, 48] },
  ];

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
    setScore(0);
    setCurrentQuestion(0);
    setGameCompleted(false);
  };

  const answerQuestion = (selectedAnswer) => {
    const currentQ = questions[currentQuestion];
    if (selectedAnswer === currentQ.answer) {
      setScore(prev => prev + 10);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
    
    // Calculate final score with time bonus
    const timeBonus = Math.floor(timeLeft * 2);
    const finalScore = score + timeBonus;
    
    // Call onComplete with results
    if (onComplete) {
      onComplete({
        score: finalScore,
        questionsAnswered: questions.length,
        timeBonus,
        accuracy: Math.round((score / (questions.length * 10)) * 100)
      });
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setTimeLeft(30);
    setCurrentQuestion(0);
  };

  if (!gameStarted && !gameCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Brain Teaser</Text>
          <Text style={styles.subtitle}>Quick math exercises to refresh your mind</Text>
        </View>
        
        <View style={styles.instructions}>
          <Ionicons name="bulb" size={24} color="#f59e0b" />
          <Text style={styles.instructionText}>
            Answer 5 simple math questions as quickly as possible. 
            You'll get points for correct answers and time bonuses!
          </Text>
        </View>
        
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameStarted && !gameCompleted) {
    const currentQ = questions[currentQuestion];
    
    return (
      <View style={styles.container}>
        <View style={styles.gameHeader}>
          <Text style={styles.gameTitle}>Question {currentQuestion + 1}/5</Text>
          <View style={styles.gameStats}>
            <Text style={styles.statText}>Score: {score}</Text>
            <Text style={styles.statText}>Time: {timeLeft}s</Text>
          </View>
        </View>
        
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => answerQuestion(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>
    );
  }

  if (gameCompleted) {
    const timeBonus = Math.floor(timeLeft * 2);
    const finalScore = score + timeBonus;
    
    return (
      <View style={styles.container}>
        <View style={styles.completionHeader}>
          <Ionicons name="trophy" size={48} color="#f59e0b" />
          <Text style={styles.completionTitle}>Game Complete!</Text>
        </View>
        
        <View style={styles.resultsContainer}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Correct Answers:</Text>
            <Text style={styles.resultValue}>{Math.floor(score / 10)}/5</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Accuracy:</Text>
            <Text style={styles.resultValue}>{Math.round((score / (questions.length * 10)) * 100)}%</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Time Bonus:</Text>
            <Text style={styles.resultValue}>+{timeBonus}</Text>
          </View>
          <View style={[styles.resultRow, styles.finalScoreRow]}>
            <Text style={styles.resultLabel}>Final Score:</Text>
            <Text style={styles.finalScoreValue}>{finalScore}</Text>
          </View>
        </View>
        
        <View style={styles.completionButtons}>
          <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    gap: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  gameStats: {
    alignItems: 'flex-end',
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  completionHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
  },
  resultsContainer: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  finalScoreRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
    paddingTop: 16,
  },
  finalScoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  completionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  playAgainButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  playAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default MiniGame;
