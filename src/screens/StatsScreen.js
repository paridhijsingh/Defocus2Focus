import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useUserData } from '../contexts/UserDataContext';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';

const { width } = Dimensions.get('window');

/**
 * Stats Screen
 * Displays comprehensive statistics and analytics with charts
 */
const StatsScreen = () => {
  const { user, stats, sessions } = useUserData();
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'year'

  // Calculate completion rate
  const completedSessions = sessions.filter(s => s.completed).length;
  const completionRate = sessions.length > 0 ? (completedSessions / sessions.length) * 100 : 0;

  // Calculate average session length
  const averageSessionLength = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length 
    : 0;

  // Generate weekly data for charts
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (today.getDay() - index));
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === date.toDateString();
      });
      const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration, 0);
      return totalMinutes / 60; // Convert to hours
    });
    return weekData;
  };

  // Generate session type data for pie chart
  const generateSessionTypeData = () => {
    const completed = sessions.filter(s => s.completed).length;
    const interrupted = sessions.filter(s => !s.completed).length;
    
    return [
      {
        name: 'Completed',
        population: completed,
        color: '#22c55e',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Interrupted',
        population: interrupted,
        color: '#f3771e',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];
  };

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#0ea5e9',
    },
  };

  const weeklyData = generateWeeklyData();
  const sessionTypeData = generateSessionTypeData();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && styles.activePeriodButton,
            ]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'week' && styles.activePeriodButtonText,
            ]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.activePeriodButton,
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'month' && styles.activePeriodButtonText,
            ]}>
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'year' && styles.activePeriodButton,
            ]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'year' && styles.activePeriodButtonText,
            ]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Focus Time"
              value={`${Math.round(stats.totalFocusTime / 60 * 10) / 10}h`}
              subtitle="lifetime"
              icon="⏱️"
              color="primary"
              style={styles.statCard}
            />
            <StatCard
              title="Completion Rate"
              value={`${Math.round(completionRate)}%`}
              subtitle="sessions"
              icon="✅"
              color="defocus"
              style={styles.statCard}
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatCard
              title="Average Session"
              value={`${Math.round(averageSessionLength / 60 * 10) / 10}m`}
              subtitle="duration"
              icon="📊"
              color="focus"
              style={styles.statCard}
            />
            <StatCard
              title="Current Streak"
              value={user.currentStreak}
              subtitle="days"
              icon="🔥"
              color="accent"
              style={styles.statCard}
            />
          </View>
        </View>

        {/* Weekly Focus Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Daily Focus Hours</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    data: weeklyData,
                  },
                ],
              }}
              width={width - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix="h"
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Goals Progress */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Weekly Goals</Text>
          <View style={styles.goalsGrid}>
            <View style={styles.goalCard}>
              <ProgressRing
                progress={Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100)}
                size={80}
                color="primary"
                showPercentage={false}
              >
                <Text style={styles.goalPercentage}>
                  {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%
                </Text>
              </ProgressRing>
              <Text style={styles.goalTitle}>Focus Time</Text>
              <Text style={styles.goalSubtitle}>
                {Math.round(stats.weeklyProgress / 60 * 10) / 10}h / 20h
              </Text>
            </View>
            
            <View style={styles.goalCard}>
              <ProgressRing
                progress={Math.min((user.currentStreak / 7) * 100, 100)}
                size={80}
                color="defocus"
                showPercentage={false}
              >
                <Text style={styles.goalPercentage}>
                  {Math.round((user.currentStreak / 7) * 100)}%
                </Text>
              </ProgressRing>
              <Text style={styles.goalTitle}>Daily Streak</Text>
              <Text style={styles.goalSubtitle}>
                {user.currentStreak} / 7 days
              </Text>
            </View>
          </View>
        </View>

        {/* Session Completion Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Session Completion</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={sessionTypeData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {sessions.slice(-5).reverse().map((session, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>
                  {session.completed ? '✅' : '⏸️'}
                </Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {session.completed ? 'Completed Session' : 'Interrupted Session'}
                </Text>
                <Text style={styles.activitySubtitle}>
                  {Math.round(session.duration / 60 * 10) / 10}h • {new Date(session.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.activityPoints}>
                +{Math.floor(session.duration / 5) + (session.completed ? 10 : 0)}
              </Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <View style={[
              styles.achievementCard,
              user.currentStreak >= 7 && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDesc}>7-day focus streak</Text>
            </View>
            
            <View style={[
              styles.achievementCard,
              stats.totalSessions >= 10 && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>🎯</Text>
              <Text style={styles.achievementTitle}>Focus Master</Text>
              <Text style={styles.achievementDesc}>10 sessions completed</Text>
            </View>
            
            <View style={[
              styles.achievementCard,
              stats.totalFocusTime >= 1200 && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>⏰</Text>
              <Text style={styles.achievementTitle}>Time Keeper</Text>
              <Text style={styles.achievementDesc}>20 hours total focus</Text>
            </View>
            
            <View style={[
              styles.achievementCard,
              completionRate >= 80 && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>💎</Text>
              <Text style={styles.achievementTitle}>Consistency King</Text>
              <Text style={styles.achievementDesc}>80% completion rate</Text>
            </View>
          </View>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#0ea5e9',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activePeriodButtonText: {
    color: 'white',
  },
  quickStats: {
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
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  goalsSection: {
    marginBottom: 24,
  },
  goalsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  goalCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
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
  goalPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
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
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 52) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default StatsScreen;
