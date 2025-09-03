import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import ActionButton from '../components/ActionButton';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Defocus2Focus! 🎯',
    subtitle: 'Where Productivity Meets Play',
    description: 'Transform your productivity journey with our gamified approach to focus and mindful breaks.',
    icon: '🎯',
    gradient: ['#3b82f6', '#1d4ed8'],
  },
  {
    id: 2,
    title: 'Balance Focus & Play ⚖️',
    subtitle: 'Smart Work-Life Integration',
    description: 'Master the art of focused work sessions followed by purposeful breaks to maintain peak performance.',
    icon: '⚖️',
    gradient: ['#10b981', '#059669'],
  },
  {
    id: 3,
    title: 'Gamified Productivity 🏆',
    subtitle: 'Earn Rewards & Level Up',
    description: 'Complete sessions, earn XP, unlock achievements, and track your progress with our engaging reward system.',
    icon: '🏆',
    gradient: ['#f59e0b', '#d97706'],
  },
  {
    id: 4,
    title: 'Track Your Progress 📊',
    subtitle: 'Data-Driven Improvement',
    description: 'Monitor your focus patterns, journal your thoughts, and build lasting habits with detailed analytics.',
    icon: '📊',
    gradient: ['#8b5cf6', '#7c3aed'],
  },
];

export default function OnboardingScreen() {
  const { actions } = useApp();
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const translateX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      actions.completeOnboarding();
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    actions.completeOnboarding();
    navigation.navigate('Login');
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    translateX.value = contentOffsetX;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderSlide = (item, index) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];
      
      const opacity = interpolate(
        translateX.value,
        inputRange,
        [0, 1, 0],
        Extrapolate.CLAMP
      );
      
      const scale = interpolate(
        translateX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ scale }],
      };
    });

    return (
      <View key={item.id} style={{ width }} className="flex-1 justify-center items-center px-8">
        <Animated.View style={animatedStyle} className="items-center">
          <LinearGradient
            colors={item.gradient}
            className="w-32 h-32 rounded-full items-center justify-center mb-8"
          >
            <Text className="text-6xl">{item.icon}</Text>
          </LinearGradient>
          
          <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            {item.title}
          </Text>
          
          <Text className="text-xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-6">
            {item.subtitle}
          </Text>
          
          <Text className="text-lg text-center text-gray-600 dark:text-gray-300 leading-7">
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View className="flex-row justify-center items-center mb-8">
        {onboardingData.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const scale = interpolate(
              translateX.value,
              inputRange,
              [0.8, 1.2, 0.8],
              Extrapolate.CLAMP
            );
            
            const opacity = interpolate(
              translateX.value,
              inputRange,
              [0.5, 1, 0.5],
              Extrapolate.CLAMP
            );

            return {
              transform: [{ scale }],
              opacity,
            };
          });

          return (
            <Animated.View
              key={index}
              style={animatedStyle}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentIndex 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {onboardingData.map((item, index) => renderSlide(item, index))}
      </ScrollView>

      <View className="px-8 pb-8">
        {renderDots()}
        
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-gray-500 dark:text-gray-400 text-lg">
              Skip
            </Text>
          </TouchableOpacity>
          
          <ActionButton
            title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            gradient
            gradientColors={onboardingData[currentIndex].gradient}
            size="lg"
          />
        </View>
      </View>
    </View>
  );
}
