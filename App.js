import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [stats, setStats] = useState({
    streak: 0,
    totalSessions: 0,
    totalHours: 0,
    journalEntries: 0,
    xp: 0,
    coins: 0,
    todaySessions: 0,
    todayGoal: 5,
  });
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');

  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    setIsLoggedIn(true);
    setHasCompletedOnboarding(true);
  };

  const handleStartDefocus = () => {
    setCurrentScreen('defocus');
  };

  const handleCompleteDefocus = (duration) => {
    const xpEarned = Math.floor(duration / 5) * 10;
    const coinsEarned = Math.floor(duration / 10) * 5;
    
    setStats(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      totalHours: prev.totalHours + (duration / 60),
      todaySessions: prev.todaySessions + 1,
      xp: prev.xp + xpEarned,
      coins: prev.coins + coinsEarned,
      streak: prev.streak + 1,
    }));
    
    setCurrentScreen('dashboard');
    Alert.alert('🎉 Session Complete!', `You earned ${xpEarned} XP and ${coinsEarned} coins!`);
  };

  const handleSaveJournal = () => {
    if (!currentEntry.trim()) {
      Alert.alert('Error', 'Please write something before saving');
      return;
    }
    
    const newEntry = {
      id: Date.now().toString(),
      content: currentEntry.trim(),
      timestamp: new Date().toISOString(),
      wordCount: currentEntry.trim().split(/\s+/).length,
    };
    
    setJournalEntries(prev => [newEntry, ...prev]);
    setStats(prev => ({
      ...prev,
      journalEntries: prev.journalEntries + 1,
    }));
    setCurrentEntry('');
    Alert.alert('Success', 'Journal entry saved!');
  };

  const renderWelcomeScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Defocus2Focus</Text>
      <Text style={styles.subtitle}>Where Productivity Meets Play</Text>
      <Text style={styles.description}>
        Transform your productivity journey with our gamified approach to focus and mindful breaks.
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCurrentScreen('onboarding')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOnboardingScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.onboardingContainer}>
        <Text style={styles.title}>Welcome to Defocus2Focus! 🎯</Text>
        <Text style={styles.subtitle}>Where Productivity Meets Play</Text>
        <Text style={styles.description}>
          Transform your productivity journey with our gamified approach to focus and mindful breaks.
        </Text>
        
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>🎯 Focus Sessions with Rewards</Text>
          <Text style={styles.featureItem}>📝 Journal Your Thoughts</Text>
          <Text style={styles.featureItem}>🎮 Mini Games for Breaks</Text>
          <Text style={styles.featureItem}>🏆 Level Up & Earn XP</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setCurrentScreen('login')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderLoginScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#9ca3af"
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDashboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hi {username} 👋</Text>
        <Text style={styles.subtitle}>Ready to focus?</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🔥 {stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.xp}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <Text style={styles.progressText}>
          {stats.todaySessions} / {stats.todayGoal} sessions
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(stats.todaySessions / stats.todayGoal) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, styles.primaryButton]}
        onPress={handleStartDefocus}
      >
        <Text style={styles.buttonText}>🎯 Start Defocus Session</Text>
      </TouchableOpacity>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentScreen('journal')}
        >
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionText}>Journal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentScreen('games')}
        >
          <Text style={styles.actionIcon}>🎮</Text>
          <Text style={styles.actionText}>Games</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentScreen('history')}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderDefocusScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Defocus Session</Text>
      <Text style={styles.subtitle}>Stay focused and breathe</Text>
      
      <View style={styles.defocusCircle}>
        <Text style={styles.defocusText}>🎯</Text>
        <Text style={styles.defocusTime}>10:00</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.successButton]}
        onPress={() => handleCompleteDefocus(10)}
      >
        <Text style={styles.buttonText}>Complete Session</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJournalScreen = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 Journal</Text>
      <Text style={styles.subtitle}>Write your thoughts</Text>
      
      <TextInput
        style={styles.journalInput}
        placeholder="What's on your mind today?"
        value={currentEntry}
        onChangeText={setCurrentEntry}
        multiline
        placeholderTextColor="#9ca3af"
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSaveJournal}
      >
        <Text style={styles.buttonText}>Save Entry</Text>
      </TouchableOpacity>
      
      <View style={styles.entriesContainer}>
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        {journalEntries.slice(0, 3).map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <Text style={styles.entryContent}>
              {entry.content.length > 100 
                ? `${entry.content.substring(0, 100)}...`
                : entry.content
              }
            </Text>
            <Text style={styles.entryDate}>
              {new Date(entry.timestamp).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderGamesScreen = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎮 Mini Games</Text>
      <Text style={styles.subtitle}>Take a break and play</Text>
      
      <View style={styles.gameCard}>
        <Text style={styles.gameIcon}>🧠</Text>
        <Text style={styles.gameTitle}>Memory Match</Text>
        <Text style={styles.gameDescription}>Find matching pairs</Text>
        <TouchableOpacity style={styles.gameButton}>
          <Text style={styles.gameButtonText}>Play</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.gameCard}>
        <Text style={styles.gameIcon}>🎯</Text>
        <Text style={styles.gameTitle}>Tap Game</Text>
        <Text style={styles.gameDescription}>Test your reflexes</Text>
        <TouchableOpacity style={styles.gameButton}>
          <Text style={styles.gameButtonText}>Play</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderHistoryScreen = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 History</Text>
      <Text style={styles.subtitle}>Your activity timeline</Text>
      
      <View style={styles.historyStats}>
        <View style={styles.historyStat}>
          <Text style={styles.historyStatValue}>{stats.totalSessions}</Text>
          <Text style={styles.historyStatLabel}>Focus Sessions</Text>
        </View>
        <View style={styles.historyStat}>
          <Text style={styles.historyStatValue}>{stats.journalEntries}</Text>
          <Text style={styles.historyStatLabel}>Journal Entries</Text>
        </View>
        <View style={styles.historyStat}>
          <Text style={styles.historyStatValue}>{stats.totalHours.toFixed(1)}h</Text>
          <Text style={styles.historyStatLabel}>Hours Focused</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderCurrentScreen = () => {
    if (!hasCompletedOnboarding) {
      if (currentScreen === 'welcome') return renderWelcomeScreen();
      if (currentScreen === 'onboarding') return renderOnboardingScreen();
      if (currentScreen === 'login') return renderLoginScreen();
    }
    
    if (!isLoggedIn) return renderLoginScreen();
    
    switch (currentScreen) {
      case 'dashboard': return renderDashboard();
      case 'defocus': return renderDefocusScreen();
      case 'journal': return renderJournalScreen();
      case 'games': return renderGamesScreen();
      case 'history': return renderHistoryScreen();
      default: return renderDashboard();
    }
  };

  return (
    <View style={styles.appContainer}>
      {renderCurrentScreen()}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  container: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 20,
  },
  onboardingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#dbeafe',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  featureList: {
    marginBottom: 30,
  },
  featureItem: {
    fontSize: 16,
    color: '#bfdbfe',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#10b981',
  },
  successButton: {
    backgroundColor: '#059669',
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 20,
    width: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#dbeafe',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  progressText: {
    color: '#dbeafe',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 80,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  defocusCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    alignSelf: 'center',
  },
  defocusText: {
    fontSize: 48,
    marginBottom: 10,
  },
  defocusTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  journalInput: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  entriesContainer: {
    marginTop: 20,
  },
  entryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  entryContent: {
    color: 'white',
    marginBottom: 5,
  },
  entryDate: {
    color: '#dbeafe',
    fontSize: 12,
  },
  gameCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  gameIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  gameDescription: {
    color: '#dbeafe',
    marginBottom: 15,
  },
  gameButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  gameButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  historyStat: {
    alignItems: 'center',
  },
  historyStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  historyStatLabel: {
    color: '#dbeafe',
    fontSize: 12,
  },
});