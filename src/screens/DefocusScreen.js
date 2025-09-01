import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useUserData } from '../contexts/UserDataContext';

const { width, height } = Dimensions.get('window');

const DefocusScreen = ({ navigation }) => {
  const { userData, updateDefocusTime, addCoins } = useUserData();
  const [selectedActivity, setSelectedActivity] = useState('games');
  const [timeRemaining, setTimeRemaining] = useState(userData.defocusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [botMessage, setBotMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [gameScore, setGameScore] = useState(0);
  const [scribbleLines, setScribbleLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const timerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeRemaining]);

  const handleTimeUp = () => {
    Alert.alert(
      'Defocus Time Complete!',
      'Great job taking a mindful break! Ready to focus?',
      [
        {
          text: 'Continue to Tasks',
          onPress: () => navigation.navigate('Todo'),
        },
        {
          text: 'Stay Here',
          style: 'cancel',
        },
      ]
    );
    addCoins(10); // Reward for completing defocus time
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(userData.defocusTime * 60);
  };

  const handleTimeChange = (value) => {
    const minutes = parseInt(value);
    updateDefocusTime(minutes);
    setTimeRemaining(minutes * 60);
    setIsActive(false);
  };

  const botResponses = [
    "That's interesting! Tell me more about how you're feeling.",
    "I understand. It's completely normal to feel that way sometimes.",
    "What do you think might help you feel better?",
    "Have you tried taking a few deep breaths?",
    "Remember, it's okay to take breaks and be kind to yourself.",
    "What's one small thing you could do right now to feel better?",
  ];

  const sendMessage = () => {
    if (userMessage.trim()) {
      const response = botResponses[Math.floor(Math.random() * botResponses.length)];
      setBotMessage(response);
      setUserMessage('');
    }
  };

  const playMiniGame = () => {
    const newScore = gameScore + Math.floor(Math.random() * 10) + 1;
    setGameScore(newScore);
    if (newScore % 50 === 0) {
      addCoins(5);
    }
  };

  const clearScribble = () => {
    setScribbleLines([]);
    setCurrentLine([]);
  };

  const renderActivityContent = () => {
    switch (selectedActivity) {
      case 'games':
        return (
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Mini Games</Text>
            <View style={styles.gameContainer}>
              <Text style={styles.gameScore}>Score: {gameScore}</Text>
              <TouchableOpacity style={styles.gameButton} onPress={playMiniGame}>
                <Text style={styles.gameButtonText}>Tap to Score!</Text>
              </TouchableOpacity>
              <Text style={styles.gameInstructions}>
                Tap the button to earn points! Every 50 points = 5 coins!
              </Text>
            </View>
          </View>
        );

      case 'journal':
        return (
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Journal Your Thoughts</Text>
            <TextInput
              style={styles.journalInput}
              placeholder="Write whatever comes to mind..."
              value={journalText}
              onChangeText={setJournalText}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        );

      case 'scribble':
        return (
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Scribble & Doodle</Text>
            <View style={styles.scribbleContainer}>
              <View style={styles.scribbleCanvas}>
                {/* Simple scribble area - in a real app, you'd use a proper drawing library */}
                <Text style={styles.scribblePlaceholder}>
                  🎨 Drawing area would go here
                </Text>
                <Text style={styles.scribblePlaceholder}>
                  Use your finger to draw freely!
                </Text>
              </View>
              <TouchableOpacity style={styles.clearButton} onPress={clearScribble}>
                <Text style={styles.clearButtonText}>Clear Canvas</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'therapist':
        return (
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Chat with Bot Therapist</Text>
            <View style={styles.chatContainer}>
              {botMessage ? (
                <View style={styles.botMessage}>
                  <Text style={styles.botMessageText}>{botMessage}</Text>
                </View>
              ) : (
                <View style={styles.welcomeMessage}>
                  <Text style={styles.welcomeText}>
                    Hi! I'm here to listen. How are you feeling today?
                  </Text>
                </View>
              )}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Type your message..."
                  value={userMessage}
                  onChangeText={setUserMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                  <Ionicons name="send" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Timer Section */}
        <View style={styles.timerSection}>
          <Text style={styles.timerTitle}>Defocus Timer</Text>
          <Text style={styles.timerDisplay}>{formatTime(timeRemaining)}</Text>
          
          <View style={styles.timerControls}>
            {!isActive ? (
              <TouchableOpacity style={styles.startButton} onPress={startTimer}>
                <Ionicons name="play" size={24} color="#ffffff" />
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                <Ionicons name="pause" size={24} color="#ffffff" />
                <Text style={styles.pauseButtonText}>Pause</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
              <Ionicons name="refresh" size={20} color="#6366f1" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeSelector}>
            <Text style={styles.timeSelectorLabel}>Duration:</Text>
            <Picker
              selectedValue={userData.defocusTime.toString()}
              style={styles.picker}
              onValueChange={handleTimeChange}
            >
              <Picker.Item label="5 minutes" value="5" />
              <Picker.Item label="10 minutes" value="10" />
              <Picker.Item label="15 minutes" value="15" />
              <Picker.Item label="20 minutes" value="20" />
            </Picker>
          </View>
        </View>

        {/* Activity Selector */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Choose Your Activity</Text>
          <View style={styles.activityTabs}>
            {[
              { id: 'games', icon: 'game-controller', label: 'Games' },
              { id: 'journal', icon: 'book', label: 'Journal' },
              { id: 'scribble', icon: 'brush', label: 'Scribble' },
              { id: 'therapist', icon: 'chatbubble', label: 'Chat' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.activityTab,
                  selectedActivity === tab.id && styles.activityTabActive,
                ]}
                onPress={() => setSelectedActivity(tab.id)}
              >
                <Ionicons
                  name={tab.icon}
                  size={20}
                  color={selectedActivity === tab.id ? '#ffffff' : '#6366f1'}
                />
                <Text
                  style={[
                    styles.activityTabText,
                    selectedActivity === tab.id && styles.activityTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity Content */}
        {renderActivityContent()}

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Todo')}
          >
            <Text style={styles.navButtonText}>Continue to Tasks</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  timerSection: {
    backgroundColor: '#ffffff',
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
  timerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  startButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pauseButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  pauseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6366f1',
    gap: 5,
  },
  resetButtonText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSelectorLabel: {
    fontSize: 16,
    color: '#374151',
    marginRight: 10,
  },
  picker: {
    width: 150,
    height: 50,
  },
  activitySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  activityTabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  activityTabActive: {
    backgroundColor: '#6366f1',
  },
  activityTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  activityTabTextActive: {
    color: '#ffffff',
  },
  activityContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  gameContainer: {
    alignItems: 'center',
  },
  gameScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 20,
  },
  gameButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  gameButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameInstructions: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  journalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scribbleContainer: {
    alignItems: 'center',
  },
  scribbleCanvas: {
    width: '100%',
    height: 150,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  scribblePlaceholder: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  welcomeMessage: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: '#374151',
  },
  botMessage: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  botMessageText: {
    fontSize: 16,
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DefocusScreen;
