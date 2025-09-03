import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Card({ 
  children, 
  onPress, 
  gradient = false, 
  gradientColors = ['#3b82f6', '#1d4ed8'],
  className = '',
  style = {},
  disabled = false 
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 100 });
  };

  const CardContent = () => (
    <View 
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${className}`}
      style={style}
    >
      {children}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <AnimatedTouchableOpacity
        style={animatedStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {gradient ? (
          <LinearGradient
            colors={gradientColors}
            className="rounded-2xl shadow-lg"
            style={style}
          >
            {children}
          </LinearGradient>
        ) : (
          <CardContent />
        )}
      </AnimatedTouchableOpacity>
    );
  }

  return gradient ? (
    <LinearGradient
      colors={gradientColors}
      className={`rounded-2xl shadow-lg ${className}`}
      style={style}
    >
      {children}
    </LinearGradient>
  ) : (
    <CardContent />
  );
}
