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

const BreakScreen = ({ navigation }) => {
  const { userData, addCoins } = useUserData();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const motivationalMessages = [
    "You're doing great! Every break makes you stronger.",
    "Rest is not a waste of time, it's an investment in your productivity.",
    "Small breaks lead to big breakthroughs.",
    "You've earned this moment to recharge.",
    "Your mind is like a muscle - it needs rest to grow stronger.",
    "Taking breaks is a sign of wisdom, not weakness.",
    "Every focused session brings you closer to your goals.",
    "You're building healthy habits that will last a lifetime.",
  ];

  const breakActivities = [
    {
      id: 'walk',
      title: 'Take a Walk',
      subtitle: '5-10 minute stroll',
      description: 'Get some fresh air and gentle movement',
      icon: 'walk',
      color: '#10b981',
      duration: '5-10 min',
      benefits: ['Improves circulation', 'Reduces stress', 'Boosts creativity'],
    },
    {
      id: 'stretch',
      title: 'Quick Stretch',
      subtitle: 'Simple exercises',
      description: 'Loosen up those muscles',
      icon: 'body',
      color: '#3b82f6',
      duration: '3-5 min',
      benefits: ['Relieves tension', 'Improves posture', 'Increases energy'],
    },
    {
      id: 'meditation',
      title: 'Mindful Moment',
      subtitle: 'Quick meditation',
      description: 'Center yourself and breathe',
      icon: 'leaf',
      color: '#8b5cf6',
      duration: '2-5 min',
      benefits: ['Reduces anxiety', 'Improves focus', 'Calms mind'],
    },
    {
      id: 'water',
      title: 'Hydrate',
      subtitle: 'Drink water',
      description: 'Stay hydrated and refreshed',
      icon: 'water',
      color: '#06b6d4',
      duration: '1 min',
      benefits: ['Boosts energy', 'Improves concentration', 'Supports health'],
    },
    {
      id: 'eye_rest',
      title: 'Eye Rest',
      subtitle: '20-20-20 rule',
      description: 'Look 20 feet away for 20 seconds',
      icon: 'eye',
      color: '#f59e0b',
      duration: '20 sec',
      benefits: ['Reduces eye strain', 'Prevents headaches', 'Maintains vision'],
    },
    {
      id: 'music',
      title: 'Listen to Music',
      subtitle: 'Your favorite tunes',
      description: 'Enjoy some relaxing music',
      icon: 'musical-notes',
      color: '#ef4444',
      duration: '3-5 min',
      benefits: ['Lifts mood', 'Reduces stress', 'Increases motivation'],
    },
  ];

  const handleActivityComplete = (activity) => {
    setCompletedActivities(prev => [...prev, activity.id]);
    addCoins(5); // Reward for completing break activity
    
    // Show completion message
    setTimeout(() => {
      setSelectedActivity(null);
    }, 2000);
  };

  const getRandomMessage = () => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  const renderActivity = (activity) => {
    const isCompleted = completedActivities.includes(activity.id);
    const isSelected = selectedActivity?.id === activity.id;

    return (
      <TouchableOpacity
        key={activity.id}
        style={[
          styles.activityCard,
          isSelected && styles.selectedActivityCard,
          isCompleted && styles.completedActivityCard,
        ]}
        onPress={() => setSelectedActivity(activity)}
        disabled={isCompleted}
      >
        <LinearGradient
          colors={[activity.color, `${activity.color}dd`]}
          style={styles.activityGradient}
        >
          <View style={styles.activityHeader}>
            <View style={styles.activityIconContainer}>
              <Ionicons name={activity.icon} size={24} color="#ffffff" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              </View>
            )}
          </View>
          
          <Text style={styles.activityDescription}>{activity.description}</Text>
          
          <View style={styles.activityMeta}>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{activity.duration}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderActivityDetail = () => {
    if (!selectedActivity) return null;

    return (
      <View style={styles.detailSection}>
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons 
              name={selectedActivity.icon} 
              size={32} 
              color={selectedActivity.color} 
            />
            <Text style={styles.detailTitle}>{selectedActivity.title}</Text>
          </View>
          
          <Text style={styles.detailDescription}>
            {selectedActivity.description}
          </Text>
          
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Benefits:</Text>
            {selectedActivity.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: selectedActivity.color }]}
            onPress={() => handleActivityComplete(selectedActivity)}
          >
            <Text style={styles.completeButtonText}>Complete Activity</Text>
            <Ionicons name="checkmark" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Break Activities</Text>
          <Text style={styles.subtitle}>
            Take a mindful break and recharge
          </Text>
        </View>

        {/* Motivational Message */}
        <View style={styles.messageSection}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.messageCard}
          >
            <Ionicons name="heart" size={24} color="#ffffff" />
            <Text style={styles.messageText}>{getRandomMessage()}</Text>
          </LinearGradient>
        </View>

        {/* Break Activities */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Suggested Activities</Text>
          <View style={styles.activitiesGrid}>
            {breakActivities.map(renderActivity)}
          </View>
        </View>

        {/* Activity Detail */}
        {renderActivityDetail()}

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Break Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {completedActivities.length} of {breakActivities.length} activities completed
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(completedActivities.length / breakActivities.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>
            <View style={styles.progressReward}>
              <Text style={styles.rewardText}>
                +{completedActivities.length * 5} coins earned
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Pomodoro')}
          >
            <Text style={styles.navButtonText}>Back to Focus</Text>
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
  messageSection: {
    marginBottom: 30,
  },
  messageCard: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontStyle: 'italic',
  },
  activitiesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  activitiesGrid: {
    gap: 12,
  },
  activityCard: {
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
  selectedActivityCard: {
    transform: [{ scale: 1.02 }],
  },
  completedActivityCard: {
    opacity: 0.7,
  },
  activityGradient: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  completedBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 12,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 30,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
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
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  detailDescription: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    lineHeight: 24,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
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
  progressInfo: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressReward: {
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
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

export default BreakScreen;
