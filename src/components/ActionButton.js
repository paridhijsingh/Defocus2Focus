import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ActionButton({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary', 'secondary', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  icon,
  disabled = false,
  className = '',
  gradient = false,
  gradientColors = ['#3b82f6', '#1d4ed8']
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

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2';
      case 'lg':
        return 'px-8 py-4';
      default:
        return 'px-6 py-3';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getVariantClasses = () => {
    if (disabled) {
      return 'bg-gray-300 dark:bg-gray-600';
    }
    
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 dark:bg-gray-700';
      case 'outline':
        return 'border-2 border-blue-500 bg-transparent';
      default:
        return 'bg-blue-500';
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return 'text-gray-500 dark:text-gray-400';
    }
    
    switch (variant) {
      case 'secondary':
        return 'text-gray-900 dark:text-white';
      case 'outline':
        return 'text-blue-500';
      default:
        return 'text-white';
    }
  };

  const ButtonContent = () => (
    <TouchableOpacity
      className={`${getSizeClasses()} ${getVariantClasses()} rounded-xl items-center justify-center flex-row ${className}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
    >
      {icon && <Text className="mr-2">{icon}</Text>}
      <Text className={`${getTextSizeClasses()} font-semibold ${getTextColor()}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (gradient && !disabled) {
    return (
      <AnimatedTouchableOpacity
        style={animatedStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={gradientColors}
          className={`${getSizeClasses()} rounded-xl items-center justify-center flex-row ${className}`}
        >
          {icon && <Text className="mr-2 text-white">{icon}</Text>}
          <Text className={`${getTextSizeClasses()} font-semibold text-white`}>
            {title}
          </Text>
        </LinearGradient>
      </AnimatedTouchableOpacity>
    );
  }

  return <ButtonContent />;
}
