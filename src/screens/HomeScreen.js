import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../contexts/UserDataContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { userData, updateStreak } = useUserData();

  useEffect(() => {
    // Update streak on app launch
    updateStreak();
  }, []);

  const menuItems = [
    {
      id: 'defocus',
      title: 'Defocus Time',
      subtitle: 'Take a mindful break',
      icon: 'leaf',
      color: '#10b981',
      route: 'Defocus',
    },
    {
      id: 'todo',
      title: 'My Tasks',
      subtitle: 'Manage your to-dos',
      icon: 'checkmark-circle',
      color: '#3b82f6',
      route: 'Todo',
    },
    {
      id: 'pomodoro',
      title: 'Focus Session',
      subtitle: 'Pomodoro timer',
      icon: 'timer',
      color: '#f59e0b',
      route: 'Pomodoro',
    },
    {
      id: 'music',
      title: 'Music & Relaxation',
      subtitle: 'Background sounds',
      icon: 'musical-notes',
      color: '#8b5cf6',
      route: 'Music',
    },
    {
      id: 'break',
      title: 'Break Activities',
      subtitle: 'Suggested activities',
      icon: 'heart',
      color: '#ef4444',
      route: 'Break',
    },
    {
      id: 'rewards',
      title: 'Rewards & Progress',
      subtitle: 'Track your achievements',
      icon: 'trophy',
      color: '#f97316',
      route: 'Rewards',
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => navigation.navigate(item.route)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[item.color, `${item.color}dd`]}
        style={styles.menuItemGradient}
      >
        <View style={styles.menuItemContent}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={24} color="#ffffff" />
          </View>
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemTitle}>{item.title}</Text>
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userLevel}>Level {userData.level} • {userData.points} XP</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.coins}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done" size={24} color="#10b981" />
            <Text style={styles.statCardValue}>{userData.completedTasks}</Text>
            <Text style={styles.statCardLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#3b82f6" />
            <Text style={styles.statCardValue}>{Math.floor(userData.totalFocusTime / 60)}h</Text>
            <Text style={styles.statCardLabel}>Focus Time</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#f59e0b" />
            <Text style={styles.statCardValue}>{userData.achievements.length}</Text>
            <Text style={styles.statCardLabel}>Achievements</Text>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>
          <View style={styles.menuGrid}>
            {menuItems.map(renderMenuItem)}
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>
            "The only way to do great work is to love what you do."
          </Text>
          <Text style={styles.quoteAuthor}>- Steve Jobs</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
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
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  menuGrid: {
    gap: 12,
  },
  menuItem: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemGradient: {
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  quoteContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default HomeScreen;
