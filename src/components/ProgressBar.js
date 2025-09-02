import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Card, ProgressBar as PaperProgressBar } from 'react-native-paper';

/**
 * ProgressBar Component - Shows daily task completion progress
 * Features: Animated progress, percentage display, goal tracking
 */
const ProgressBar = ({
  completedTasks = 0,
  totalTasks = 0,
  dailyGoal = 5,
  showGoal = true,
  animated = true,
}) => {
  const [animatedValue] = React.useState(new Animated.Value(0));

  // Calculate progress percentage
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const goalProgress = dailyGoal > 0 ? (completedTasks / dailyGoal) * 100 : 0;

  // Animate progress bar
  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress / 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress / 100);
    }
  }, [progress, animated, animatedValue]);

  // Get progress color based on completion
  const getProgressColor = () => {
    if (progress >= 100) return '#10b981'; // Green for complete
    if (progress >= 75) return '#3b82f6'; // Blue for good progress
    if (progress >= 50) return '#f59e0b'; // Orange for moderate progress
    return '#ef4444'; // Red for low progress
  };

  // Get motivational message
  const getMotivationalMessage = () => {
    if (totalTasks === 0) {
      return "Add some tasks to get started!";
    }
    
    if (progress >= 100) {
      return "🎉 Amazing! All tasks completed!";
    }
    
    if (progress >= 75) {
      return "🔥 You're on fire! Almost there!";
    }
    
    if (progress >= 50) {
      return "💪 Great progress! Keep it up!";
    }
    
    if (progress >= 25) {
      return "🚀 Good start! You've got this!";
    }
    
    return "🌟 Every step counts! Keep going!";
  };

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Progress</Text>
          <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
        </View>

        {/* Task Count */}
        <View style={styles.taskCountContainer}>
          <Text style={styles.taskCount}>
            {completedTasks} of {totalTasks} tasks completed
          </Text>
        </View>

        {/* Daily Goal Progress */}
        {showGoal && dailyGoal > 0 && (
          <View style={styles.goalContainer}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Daily Goal</Text>
              <Text style={styles.goalProgress}>
                {completedTasks}/{dailyGoal} tasks
              </Text>
            </View>
            
            <View style={styles.goalProgressBar}>
              <PaperProgressBar
                progress={Math.min(goalProgress / 100, 1)}
                color={goalProgress >= 100 ? '#10b981' : '#3b82f6'}
                style={styles.goalProgressBarFill}
              />
            </View>
            
            {goalProgress >= 100 && (
              <Text style={styles.goalAchieved}>
                🎯 Daily goal achieved!
              </Text>
            )}
          </View>
        )}

        {/* Motivational Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.motivationalMessage}>
            {getMotivationalMessage()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  taskCountContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  taskCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  goalContainer: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  goalProgress: {
    fontSize: 14,
    color: '#6b7280',
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressBarFill: {
    height: '100%',
  },
  goalAchieved: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  messageContainer: {
    alignItems: 'center',
  },
  motivationalMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ProgressBar;
