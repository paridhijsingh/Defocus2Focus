import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

/**
 * ProgressRing Component
 * Displays a circular progress indicator with customizable colors and content
 */
const ProgressRing = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = 'primary',
  showPercentage = true,
  children 
}) => {
  // Calculate circle dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Color mapping for different themes
  const colorMap = {
    primary: '#0ea5e9',
    focus: '#f3771e',
    defocus: '#22c55e',
    accent: '#d946ef',
    neutral: '#737373'
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e5e5"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={selectedColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      
      {/* Content inside the ring */}
      <View style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
      }}>
        {children || (
          showPercentage && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: selectedColor,
              }}>
                {Math.round(progress)}%
              </Text>
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default ProgressRing;
