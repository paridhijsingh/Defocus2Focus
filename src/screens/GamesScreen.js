import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming 
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 4; // 4 cards per row with padding

// Memory Match Game
const MemoryMatchGame = ({ onComplete }) => {
  const { actions } = useApp();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);

  const emojis = ['🎯', '🎮', '📝', '🏆', '⚡', '🌟', '🎨', '🎵'];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
  }, [gameStarted, timeLeft]);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimeLeft(60);
    setGameStarted(false);
  };

  const handleCardPress = (card) => {
    if (flippedCards.length >= 2 || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    const updatedCards = cards.map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setTimeout(() => {
        checkMatch(newFlippedCards);
      }, 1000);
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const checkMatch = (flipped) => {
    const [card1, card2] = flipped;
    
    if (card1.emoji === card2.emoji) {
      // Match found
      setMatchedCards([...matchedCards, card1.id, card2.id]);
      const updatedCards = cards.map(c => 
        c.id === card1.id || c.id === card2.id 
          ? { ...c, isMatched: true, isFlipped: true }
          : c
      );
      setCards(updatedCards);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Check if game is complete
      if (matchedCards.length + 2 === cards.length) {
        handleGameComplete();
      }
    } else {
      // No match
      const updatedCards = cards.map(c => 
        c.id === card1.id || c.id === card2.id 
          ? { ...c, isFlipped: false }
          : c
      );
      setCards(updatedCards);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    setFlippedCards([]);
  };

  const handleGameComplete = () => {
    const score = Math.max(0, 1000 - (moves * 10) - ((60 - timeLeft) * 5));
    actions.completeGame('memoryMatch', score);
    
    Alert.alert(
      '🎉 Game Complete!',
      `Congratulations! You completed the game in ${moves} moves with ${timeLeft} seconds left.\n\nScore: ${score}`,
      [{ text: 'Play Again', onPress: initializeGame }]
    );
    
    onComplete(score);
  };

  const handleGameOver = () => {
    Alert.alert(
      '⏰ Time\'s Up!',
      'Better luck next time!',
      [{ text: 'Try Again', onPress: initializeGame }]
    );
  };

  const startGame = () => {
    setGameStarted(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <LinearGradient
        colors={['#10b981', '#059669']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-2xl font-bold">
            Memory Match 🧠
          </Text>
          <TouchableOpacity onPress={initializeGame}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="items-center">
            <Text className="text-white font-bold text-xl">{moves}</Text>
            <Text className="text-green-100 text-sm">Moves</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold text-xl">{timeLeft}</Text>
            <Text className="text-green-100 text-sm">Seconds</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold text-xl">
              {matchedCards.length / 2}
            </Text>
            <Text className="text-green-100 text-sm">Matches</Text>
          </View>
        </View>
      </LinearGradient>

      <View className="flex-1 px-6 py-6">
        {!gameStarted ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-6xl mb-6">🧠</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Memory Match
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
              Find matching pairs of emojis. Complete the game in as few moves as possible!
            </Text>
            <ActionButton
              title="Start Game"
              onPress={startGame}
              gradient
              gradientColors={['#10b981', '#059669']}
              size="lg"
            />
          </View>
        ) : (
          <View className="flex-1">
            <View className="flex-row flex-wrap justify-between">
              {cards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  onPress={() => handleCardPress(card)}
                  className="mb-3"
                  style={{ width: cardSize, height: cardSize }}
                >
                  <View className={`w-full h-full rounded-xl items-center justify-center ${
                    card.isFlipped || card.isMatched
                      ? 'bg-white shadow-lg'
                      : 'bg-green-500'
                  }`}>
                    {(card.isFlipped || card.isMatched) && (
                      <Text className="text-2xl">{card.emoji}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

// Tap Game
const TapGame = ({ onComplete }) => {
  const { actions } = useApp();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
  }, [gameStarted, timeLeft]);

  const handleTap = () => {
    setScore(score + 1);
    setTargetPosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleGameOver = () => {
    actions.completeGame('tapGame', score);
    Alert.alert(
      '🎯 Game Over!',
      `Final Score: ${score}\nTap as many targets as you can in 30 seconds!`,
      [{ text: 'Play Again', onPress: () => {
        setGameStarted(false);
        setScore(0);
        setTimeLeft(30);
      }}]
    );
    onComplete(score);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <LinearGradient
        colors={['#f59e0b', '#d97706']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-2xl font-bold">
            Tap Game 🎯
          </Text>
          <TouchableOpacity onPress={() => {
            setGameStarted(false);
            setScore(0);
            setTimeLeft(30);
          }}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="items-center">
            <Text className="text-white font-bold text-xl">{score}</Text>
            <Text className="text-orange-100 text-sm">Score</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold text-xl">{timeLeft}</Text>
            <Text className="text-orange-100 text-sm">Seconds</Text>
          </View>
        </View>
      </LinearGradient>

      <View className="flex-1 px-6 py-6">
        {!gameStarted ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-6xl mb-6">🎯</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Tap Game
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
              Tap the target as many times as you can in 30 seconds!
            </Text>
            <ActionButton
              title="Start Game"
              onPress={startGame}
              gradient
              gradientColors={['#f59e0b', '#d97706']}
              size="lg"
            />
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <TouchableOpacity
              onPress={handleTap}
              className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center shadow-lg"
              style={{
                position: 'absolute',
                left: `${targetPosition.x}%`,
                top: `${targetPosition.y}%`,
              }}
            >
              <Text className="text-2xl">🎯</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// Main Games Screen
export default function GamesScreen() {
  const { state } = useApp();
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'memoryMatch',
      title: 'Memory Match',
      description: 'Find matching pairs',
      icon: '🧠',
      color: ['#10b981', '#059669'],
      highScore: state.games.memoryMatch?.highScore || 0,
      gamesPlayed: state.games.memoryMatch?.gamesPlayed || 0,
    },
    {
      id: 'tapGame',
      title: 'Tap Game',
      description: 'Quick reflexes test',
      icon: '🎯',
      color: ['#f59e0b', '#d97706'],
      highScore: state.games.tapGame?.highScore || 0,
      gamesPlayed: state.games.tapGame?.gamesPlayed || 0,
    },
  ];

  const handleGameComplete = (score) => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    if (selectedGame === 'memoryMatch') {
      return <MemoryMatchGame onComplete={handleGameComplete} />;
    } else if (selectedGame === 'tapGame') {
      return <TapGame onComplete={handleGameComplete} />;
    }
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        className="px-6 pt-12 pb-8"
      >
        <Text className="text-white text-2xl font-bold mb-2">
          Mini Games 🎮
        </Text>
        <Text className="text-purple-100 text-sm">
          Take a break and play some games to relax your mind
        </Text>
      </LinearGradient>

      <View className="flex-1 px-6 py-6">
        <View className="flex-row flex-wrap justify-between">
          {games.map((game) => (
            <Card
              key={game.id}
              onPress={() => setSelectedGame(game.id)}
              gradient
              gradientColors={game.color}
              className="w-[48%] mb-4"
            >
              <View className="p-6 items-center">
                <Text className="text-4xl mb-3">{game.icon}</Text>
                <Text className="text-white font-bold text-lg mb-1">
                  {game.title}
                </Text>
                <Text className="text-white/80 text-sm text-center mb-3">
                  {game.description}
                </Text>
                <View className="items-center">
                  <Text className="text-white font-semibold">
                    High Score: {game.highScore}
                  </Text>
                  <Text className="text-white/60 text-xs">
                    {game.gamesPlayed} games played
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Card className="mt-4">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🎮 Game Stats
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">
                  {state.games.memoryMatch?.gamesPlayed + state.games.tapGame?.gamesPlayed || 0}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Games
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">
                  {Math.max(
                    state.games.memoryMatch?.highScore || 0,
                    state.games.tapGame?.highScore || 0
                  )}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Best Score
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}
