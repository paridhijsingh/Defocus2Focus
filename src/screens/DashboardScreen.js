import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import {
  BookOpen,
  Gamepad2,
  Bot,
  Trophy,
  BarChart3,
  Target,
  Users,
  Flame,
  Star,
  Coins,
  Clock,
  BookMarked,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Reusable components
const StatCard = ({ icon: Icon, title, value, color, delay = 0 }) => {
  const { isDark } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { delay });
    opacity.value = withTiming(1, { delay });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#f3f4f6',
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View
          style={{
            backgroundColor: color + '20',
            borderRadius: 8,
            padding: 6,
            marginRight: 8,
          }}
        >
          <Icon size={20} color={color} />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: isDark ? '#9ca3af' : '#6b7280',
            fontWeight: '500',
          }}
        >
          {title}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: isDark ? '#ffffff' : '#111827',
        }}
      >
        {value}
      </Text>
    </Animated.View>
  );
};

const ActionButton = ({ 
  title, 
  icon: Icon, 
  color, 
  onPress, 
  isLarge = false,
  delay = 0 
}) => {
  const { isDark } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { delay });
    opacity.value = withTiming(1, { delay });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle, { flex: isLarge ? 2 : 1 }]}>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderRadius: 20,
          padding: isLarge ? 24 : 20,
          margin: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#f3f4f6',
        }}
      >
        <LinearGradient
          colors={[color + '20', color + '10']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 20,
          }}
        />
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: color,
              borderRadius: 16,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Icon size={isLarge ? 32 : 24} color="#ffffff" />
          </View>
          <Text
            style={{
              fontSize: isLarge ? 16 : 14,
              fontWeight: '600',
              color: isDark ? '#ffffff' : '#111827',
              textAlign: 'center',
            }}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CircularProgress = ({ progress, size = 120, strokeWidth = 8, color = '#3b82f6' }) => {
  const { isDark } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ position: 'relative', width: size, height: size }}>
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: isDark ? '#374151' : '#e5e7eb',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{ rotate: '-90deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: isDark ? '#ffffff' : '#111827',
            }}
          >
            {progress}%
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            Complete
          </Text>
        </View>
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  const { isDark, theme } = useTheme();
  const { user, stats, dailyProgress } = useUser();
  
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (dailyProgress.focusSessionsCompleted / dailyProgress.focusSessionsGoal) * 100
  );

  const motivationalQuotes = [
    "Every expert was once a beginner! 🌟",
    "Progress, not perfection! 🚀",
    "You're doing better than you think! 💪",
    "Small steps lead to big changes! 🎯",
    "Focus is a superpower! ⚡",
  ];

  const [currentQuote, setCurrentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(
        motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
      );
    }, 30000); // Change quote every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleActionPress = (action) => {
    console.log(`Pressed: ${action}`);
    // Add navigation logic here
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#f9fafb' }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section - Profile Greeting */}
        <View style={{ padding: 20, paddingTop: 10 }}>
          <LinearGradient
            colors={isDark ? ['#1f2937', '#111827'] : ['#ffffff', '#f9fafb']}
            style={{
              borderRadius: 24,
              padding: 24,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: isDark ? '#ffffff' : '#111827',
                    marginBottom: 4,
                  }}
                >
                  Hi {user.name} 👋
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: isDark ? '#9ca3af' : '#6b7280',
                    marginBottom: 12,
                  }}
                >
                  {currentQuote}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Flame size={20} color="#f59e0b" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#f59e0b',
                      marginLeft: 6,
                    }}
                  >
                    {stats.currentStreak}-day streak
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress progress={progressPercentage} color="#3b82f6" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Middle Section - Stats */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star size={20} color="#f59e0b" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: isDark ? '#ffffff' : '#111827',
                  marginLeft: 8,
                }}
              >
                {stats.xp} XP
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Coins size={20} color="#eab308" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: isDark ? '#ffffff' : '#111827',
                  marginLeft: 8,
                }}
              >
                {stats.coins} Coins
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            <StatCard
              icon={Target}
              title="Defocus Sessions"
              value={stats.totalDefocusSessions.toString()}
              color="#ef4444"
              delay={100}
            />
            <StatCard
              icon={Clock}
              title="Hours Focused"
              value={stats.totalHoursFocused.toString()}
              color="#3b82f6"
              delay={200}
            />
            <StatCard
              icon={BookMarked}
              title="Journal Entries"
              value={stats.journalEntries.toString()}
              color="#10b981"
              delay={300}
            />
          </ScrollView>
        </View>

        {/* Main Actions Grid */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#ffffff' : '#111827',
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <ActionButton
              title="Start Defocus"
              icon={Target}
              color="#ef4444"
              onPress={() => handleActionPress('Start Defocus')}
              isLarge={true}
              delay={400}
            />
            <ActionButton
              title="Journal"
              icon={BookOpen}
              color="#8b5cf6"
              onPress={() => handleActionPress('Journal')}
              delay={500}
            />
            <ActionButton
              title="Mini Games"
              icon={Gamepad2}
              color="#f59e0b"
              onPress={() => handleActionPress('Mini Games')}
              delay={600}
            />
            <ActionButton
              title="AI Therapist"
              icon={Bot}
              color="#06b6d4"
              onPress={() => handleActionPress('AI Therapist')}
              delay={700}
            />
            <ActionButton
              title="Leaderboard"
              icon={Trophy}
              color="#eab308"
              onPress={() => handleActionPress('Leaderboard')}
              delay={800}
            />
            <ActionButton
              title="History"
              icon={BarChart3}
              color="#10b981"
              onPress={() => handleActionPress('History')}
              delay={900}
            />
          </View>
        </View>

        {/* Bottom Section */}
        <View style={{ paddingHorizontal: 20 }}>
          <LinearGradient
            colors={isDark ? ['#1f2937', '#111827'] : ['#ffffff', '#f9fafb']}
            style={{
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#ffffff' : '#111827',
                marginBottom: 12,
              }}
            >
              Today's Focus Goal
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View
                style={{
                  flex: 1,
                  height: 8,
                  backgroundColor: isDark ? '#374151' : '#e5e7eb',
                  borderRadius: 4,
                  marginRight: 12,
                }}
              >
                <View
                  style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#3b82f6',
                }}
              >
                {dailyProgress.focusSessionsCompleted}/{dailyProgress.focusSessionsGoal}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: isDark ? '#9ca3af' : '#6b7280',
              }}
            >
              {dailyProgress.focusSessionsGoal - dailyProgress.focusSessionsCompleted} more sessions to complete today's goal
            </Text>
          </LinearGradient>

          <TouchableOpacity
            onPress={() => handleActionPress('Challenge Friend')}
            style={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              borderWidth: 1,
              borderColor: isDark ? '#374151' : '#f3f4f6',
            }}
          >
            <Users size={20} color="#8b5cf6" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#ffffff' : '#111827',
                marginLeft: 8,
              }}
            >
              Challenge a Friend
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;