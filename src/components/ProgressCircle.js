import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming,
  Easing 
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressCircle({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showPercentage = true,
  children 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = useSharedValue(circumference);

  React.useEffect(() => {
    const newOffset = circumference - (progress / 100) * circumference;
    strokeDashoffset.value = withTiming(newOffset, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, circumference]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: strokeDashoffset.value,
    };
  });

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size} className="absolute">
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>
      
      <View className="absolute items-center justify-center">
        {children || (
          showPercentage && (
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(progress)}%
            </Text>
          )
        )}
      </View>
    </View>
  );
}
