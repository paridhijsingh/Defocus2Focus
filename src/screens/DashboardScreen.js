import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { useUserData } from '../contexts/UserDataContext';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';

/**
 * Dashboard Screen
 * Main home screen showing user stats, progress, and quick actions
 */
const DashboardScreen = ({ navigation }) => {
  const { user, stats, sessions } = useUserData();

  // Calculate weekly progress percentage
  const weeklyProgressPercentage = Math.min(
    (stats.weeklyProgress / stats.weeklyGoal) * 100, 
    100
  );

  // Get recent sessions for activity feed
  const recentSessions = sessions
    .slice(-5)
    .reverse()
    .map(session => ({
      ...session,
      date: new Date(session.date).toLocaleDateString(),
      duration: Math.round(session.duration / 60 * 10) / 10, // Convert to hours
    }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user.name}!</Text>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level {user.level}</Text>
            <Text style={styles.experienceText}>
              {user.experience % 100}/100 XP
            </Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Current Streak"
              value={user.currentStreak}
              subtitle="days"
              icon="🔥"
              color="focus"
              style={styles.statCard}
            />
            <StatCard
              title="Total Points"
              value={user.totalPoints}
              subtitle="earned"
              icon="⭐"
              color="primary"
              style={styles.statCard}
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatCard
              title="Today's Focus"
              value={`${Math.round(stats.weeklyProgress / 60 * 10) / 10}h`}
              subtitle="of 20h goal"
              icon="⏱️"
              color="defocus"
              style={styles.statCard}
            />
            <StatCard
              title="Total Sessions"
              value={stats.totalSessions}
              subtitle="completed"
              icon="📊"
              color="accent"
              style={styles.statCard}
            />
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={weeklyProgressPercentage}
              size={120}
              color="primary"
              showPercentage={false}
            >
              <View style={styles.progressContent}>
                <Text style={styles.progressValue}>
                  {Math.round(weeklyProgressPercentage)}%
                </Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </ProgressRing>
            <View style={styles.progressDetails}>
              <Text style={styles.progressText}>
                {Math.round(stats.weeklyProgress / 60 * 10) / 10}h / 20h
              </Text>
              <Text style={styles.progressSubtext}>
                Weekly focus goal
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.focusButton]}
              onPress={() => navigation.navigate('Focus')}
            >
              <Text style={styles.actionButtonIcon}>🎯</Text>
              <Text style={styles.actionButtonText}>Start Focus</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.breakButton]}
              onPress={() => navigation.navigate('Break')}
            >
              <Text style={styles.actionButtonIcon}>🌿</Text>
              <Text style={styles.actionButtonText}>Take Break</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentSessions.length > 0 ? (
            recentSessions.map((session, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>
                    {session.completed ? '✅' : '⏸️'}
                  </Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    {session.completed ? 'Focus Session' : 'Interrupted Session'}
                  </Text>
                  <Text style={styles.activitySubtitle}>
                    {session.duration}h • {session.date}
                  </Text>
                </View>
                <Text style={styles.activityPoints}>
                  +{Math.floor(session.duration * 60 / 5) + (session.completed ? 10 : 0)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyActivity}>
              <Text style={styles.emptyActivityText}>
                No sessions yet. Start your first focus session!
              </Text>
            </View>
          )}
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
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0ea5e9',
    marginRight: 12,
  },
  experienceText: {
    fontSize: 14,
    color: '#64748b',
  },
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  progressDetails: {
    flex: 1,
    marginLeft: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  progressSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  focusButton: {
    backgroundColor: '#f3771e',
  },
  breakButton: {
    backgroundColor: '#22c55e',
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  emptyActivity: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyActivityText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default DashboardScreen;
