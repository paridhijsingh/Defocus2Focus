import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from '../contexts/UserDataContext';

const { width, height } = Dimensions.get('window');

const RewardsScreen = ({ navigation }) => {
  const { userData, addAchievement } = useUserData();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const achievements = [
    {
      id: 'first_task',
      title: 'First Task',
      description: 'Complete your first task',
      icon: 'checkmark-circle',
      color: '#10b981',
      unlocked: userData.completedTasks >= 1,
    },
    {
      id: 'focus_master',
      title: 'Focus Master',
      description: 'Complete 10 focus sessions',
      icon: 'timer',
      color: '#6366f1',
      unlocked: userData.completedTasks >= 10,
    },
    {
      id: 'streak_warrior',
      title: 'Streak Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      color: '#f59e0b',
      unlocked: userData.streak >= 7,
    },
    {
      id: 'coin_collector',
      title: 'Coin Collector',
      description: 'Earn 100 coins',
      icon: 'coin',
      color: '#f59e0b',
      unlocked: userData.coins >= 100,
    },
    {
      id: 'level_up',
      title: 'Level Up',
      description: 'Reach level 5',
      icon: 'trending-up',
      color: '#8b5cf6',
      unlocked: userData.level >= 5,
    },
    {
      id: 'break_taker',
      title: 'Break Taker',
      description: 'Complete 5 break activities',
      icon: 'leaf',
      color: '#10b981',
      unlocked: false, // This would be tracked separately
    },
  ];

  const weeklyRewards = [
    {
      id: 'weekly_1',
      title: 'Weekly Goal',
      description: 'Complete 5 tasks this week',
      reward: '50 coins',
      progress: Math.min(userData.completedTasks, 5),
      max: 5,
      color: '#6366f1',
    },
    {
      id: 'weekly_2',
      title: 'Focus Time',
      description: 'Spend 2 hours in focus mode',
      reward: '75 coins',
      progress: Math.min(Math.floor(userData.totalFocusTime / 60), 120),
      max: 120,
      color: '#10b981',
    },
    {
      id: 'weekly_3',
      title: 'Streak Keeper',
      description: 'Maintain a 5-day streak',
      reward: '100 coins',
      progress: Math.min(userData.streak, 5),
      max: 5,
      color: '#f59e0b',
    },
  ];

  const stats = [
    {
      id: 'total_tasks',
      label: 'Total Tasks',
      value: userData.completedTasks,
      icon: 'checkmark-done',
      color: '#10b981',
    },
    {
      id: 'focus_time',
      label: 'Focus Time',
      value: `${Math.floor(userData.totalFocusTime / 60)}h`,
      icon: 'time',
      color: '#6366f1',
    },
    {
      id: 'current_streak',
      label: 'Current Streak',
      value: userData.streak,
      icon: 'flame',
      color: '#f59e0b',
    },
    {
      id: 'total_coins',
      label: 'Total Coins',
      value: userData.coins,
      icon: 'coin',
      color: '#f59e0b',
    },
  ];

  const renderStatCard = (stat) => (
    <View key={stat.id} style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
        <Ionicons name={stat.icon} size={24} color="#ffffff" />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );

  const renderAchievement = (achievement) => (
    <TouchableOpacity
      key={achievement.id}
      style={[
        styles.achievementCard,
        achievement.unlocked && styles.unlockedAchievement,
      ]}
    >
      <View style={styles.achievementHeader}>
        <View style={[
          styles.achievementIcon,
          { backgroundColor: achievement.unlocked ? achievement.color : '#9ca3af' }
        ]}>
          <Ionicons 
            name={achievement.icon} 
            size={24} 
            color="#ffffff" 
          />
        </View>
        <View style={styles.achievementInfo}>
          <Text style={[
            styles.achievementTitle,
            achievement.unlocked && styles.unlockedText
          ]}>
            {achievement.title}
          </Text>
          <Text style={[
            styles.achievementDescription,
            achievement.unlocked && styles.unlockedText
          ]}>
            {achievement.description}
          </Text>
        </View>
        {achievement.unlocked && (
          <View style={styles.unlockedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderWeeklyReward = (reward) => {
    const progressPercentage = (reward.progress / reward.max) * 100;
    
    return (
      <View key={reward.id} style={styles.weeklyRewardCard}>
        <View style={styles.rewardHeader}>
          <View style={[styles.rewardIcon, { backgroundColor: reward.color }]}>
            <Ionicons name="trophy" size={20} color="#ffffff" />
          </View>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
          </View>
          <View style={styles.rewardValue}>
            <Text style={styles.rewardText}>{reward.reward}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: reward.color 
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {reward.progress}/{reward.max}
          </Text>
        </View>
      </View>
    );
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {stats.map(renderStatCard)}
        </View>
      </View>

      {/* Level Progress */}
      <View style={styles.levelSection}>
        <Text style={styles.sectionTitle}>Level Progress</Text>
        <View style={styles.levelCard}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.levelGradient}
          >
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {userData.level}</Text>
              <Text style={styles.xpText}>{userData.points} XP</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(userData.points % 100) / 100 * 100}%`,
                      backgroundColor: '#ffffff'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {userData.points % 100}/100 XP to next level
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Weekly Rewards */}
      <View style={styles.weeklySection}>
        <Text style={styles.sectionTitle}>Weekly Rewards</Text>
        <View style={styles.weeklyRewardsList}>
          {weeklyRewards.map(renderWeeklyReward)}
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsList}>
          {achievements.map(renderAchievement)}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rewards & Progress</Text>
          <Text style={styles.subtitle}>
            Track your achievements and earn rewards
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'overview' && styles.activeTabButton,
            ]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[
              styles.tabButtonText,
              selectedTab === 'overview' && styles.activeTabButtonText,
            ]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'achievements' && styles.activeTabButton,
            ]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Text style={[
              styles.tabButtonText,
              selectedTab === 'achievements' && styles.activeTabButtonText,
            ]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' ? renderOverview() : renderAchievements()}

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.navButtonText}>Back to Home</Text>
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
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
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
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#6366f1',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
  tabContent: {
    marginBottom: 30,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  levelSection: {
    marginBottom: 30,
  },
  levelCard: {
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
  levelGradient: {
    padding: 20,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  xpText: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  weeklySection: {
    marginBottom: 30,
  },
  weeklyRewardsList: {
    gap: 12,
  },
  weeklyRewardCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  rewardValue: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  achievementsSection: {
    marginBottom: 30,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unlockedAchievement: {
    borderWidth: 2,
    borderColor: '#10b981',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#9ca3af',
  },
  unlockedText: {
    color: '#1f2937',
  },
  unlockedBadge: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 4,
  },
  navigationSection: {
    alignItems: 'center',
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

export default RewardsScreen;
