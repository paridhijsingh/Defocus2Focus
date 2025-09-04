import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';

const { width } = Dimensions.get('window');

// Memory Match Game
const MemoryMatchGame = ({ onGameComplete }) => {
  const { actions } = useApp();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const symbols = ['🎯', '🎮', '📝', '🏆', '⭐', '💎', '🌟', '🎨'];

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleCardPress = (cardId) => {
    if (flippedCards.length >= 2 || matchedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlippedCards.map(id => 
        cards.find(card => card.id === id)
      );

      if (firstCard.symbol === secondCard.symbol) {
        setMatchedCards([...matchedCards, ...newFlippedCards]);
        setFlippedCards([]);
        
        if (matchedCards.length + 2 === cards.length) {
          setGameCompleted(true);
          const score = Math.max(0, 1000 - (moves * 10));
          actions.completeGame('memoryMatch', score);
          onGameComplete(score);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Memory Match
        </Text>
        <Text className="text-gray-600 dark:text-gray-400">
          Moves: {moves}
        </Text>
      </View>

      {!gameStarted ? (
        <View className="items-center py-8">
          <Text className="text-6xl mb-4">🧠</Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Test Your Memory
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Match pairs of symbols to win! Fewer moves = higher score.
          </Text>
          <ActionButton
            title="Start Game"
            onPress={initializeGame}
            gradient
            gradientColors={['#3b82f6', '#1d4ed8']}
          />
        </View>
      ) : gameCompleted ? (
        <View className="items-center py-8">
          <Text className="text-6xl mb-4">🎉</Text>
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Congratulations!
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            You completed the game in {moves} moves!
          </Text>
          <ActionButton
            title="Play Again"
            onPress={initializeGame}
            gradient
            gradientColors={['#10b981', '#059669']}
          />
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between">
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPress(card.id)}
              className={`w-[22%] aspect-square mb-2 rounded-xl items-center justify-center ${
                flippedCards.includes(card.id) || matchedCards.includes(card.id)
                  ? 'bg-blue-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Text className="text-2xl">
                {flippedCards.includes(card.id) || matchedCards.includes(card.id)
                  ? card.symbol
                  : '?'
                }
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Tap Game
const TapGame = ({ onGameComplete }) => {
  const { actions } = useApp();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let interval;
    if (gameStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        // Move target randomly
        setTargetPosition({
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
        });
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      setGameCompleted(true);
      actions.completeGame('tapGame', score);
      onGameComplete(score);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft]);

  const handleTargetPress = () => {
    if (gameStarted && !gameCompleted) {
      setScore(score + 1);
      setTargetPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
      });
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameStarted(true);
    setGameCompleted(false);
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Speed Tap
        </Text>
        <View className="flex-row items-center">
          <Text className="text-gray-600 dark:text-gray-400 mr-4">
            Score: {score}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            Time: {timeLeft}s
          </Text>
        </View>
      </View>

      {!gameStarted ? (
        <View className="items-center py-8">
          <Text className="text-6xl mb-4">👆</Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Tap as Fast as You Can!
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Tap the target as many times as possible in 30 seconds.
          </Text>
          <ActionButton
            title="Start Game"
            onPress={startGame}
            gradient
            gradientColors={['#f59e0b', '#d97706']}
          />
        </View>
      ) : gameCompleted ? (
        <View className="items-center py-8">
          <Text className="text-6xl mb-4">🏆</Text>
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Great Job!
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            Final Score: {score} taps
          </Text>
          <ActionButton
            title="Play Again"
            onPress={startGame}
            gradient
            gradientColors={['#10b981', '#059669']}
          />
        </View>
      ) : (
        <View className="flex-1 relative">
          <TouchableOpacity
            onPress={handleTargetPress}
            style={{
              position: 'absolute',
              left: `${targetPosition.x}%`,
              top: `${targetPosition.y}%`,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#ef4444',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text className="text-white text-xl font-bold">TAP</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function GamesScreen() {
  const { state } = useApp();
  const [activeGame, setActiveGame] = useState('memory');
  const [gameScore, setGameScore] = useState(0);

  const handleGameComplete = (score) => {
    setGameScore(score);
    Alert.alert(
      'Game Complete!',
      `You scored ${score} points!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <LinearGradient
        colors={['#f59e0b', '#d97706']}
        className="px-6 pt-12 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              🎮 Games
            </Text>
            <Text className="text-orange-100 text-sm">
              Fun & mindful activities
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-2">
            <Ionicons name="trophy-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-4">
        {/* Game Stats */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏆 Your Game Stats
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {state.games.memoryMatch.gamesPlayed}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Memory Games
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {state.games.tapGame.gamesPlayed}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Tap Games
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.max(state.games.memoryMatch.highScore, state.games.tapGame.highScore)}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Best Score
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Game Selection */}
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setActiveGame('memory')}
            className={`flex-1 py-3 px-4 rounded-l-xl ${
              activeGame === 'memory'
                ? 'bg-orange-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text className={`text-center font-semibold ${
              activeGame === 'memory'
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              🧠 Memory
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveGame('tap')}
            className={`flex-1 py-3 px-4 rounded-r-xl ${
              activeGame === 'tap'
                ? 'bg-orange-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text className={`text-center font-semibold ${
              activeGame === 'tap'
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              👆 Speed Tap
            </Text>
          </TouchableOpacity>
        </View>

        {/* Game Area */}
        <Card className="mb-6">
          <View className="p-6">
            {activeGame === 'memory' ? (
              <MemoryMatchGame onGameComplete={handleGameComplete} />
            ) : (
              <TapGame onGameComplete={handleGameComplete} />
            )}
          </View>
        </Card>

        {/* Game Benefits */}
        <Card className="mb-6">
          <View className="p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎯 Why Play Games?
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Text className="text-orange-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Memory Games:</Text> Improve focus and cognitive function
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-orange-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Speed Games:</Text> Enhance reaction time and coordination
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-orange-500 mr-3">•</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  <Text className="font-semibold">Mindful Play:</Text> Reduce stress and improve mood
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
