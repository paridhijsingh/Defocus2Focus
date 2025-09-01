import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * StatCard Component
 * Displays statistics in a card format with customizable colors and themes
 */
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  trend = null,
  onPress = null 
}) => {
  // Color mapping for different themes
  const colorMap = {
    primary: {
      bg: '#f0f9ff',
      text: '#0ea5e9',
      border: '#bae6fd'
    },
    focus: {
      bg: '#fef7ee',
      text: '#f3771e',
      border: '#fbd7a9'
    },
    defocus: {
      bg: '#f0fdf4',
      text: '#22c55e',
      border: '#bbf7d0'
    },
    accent: {
      bg: '#fdf4ff',
      text: '#d946ef',
      border: '#f5d0fe'
    },
    neutral: {
      bg: '#fafafa',
      text: '#737373',
      border: '#e5e5e5'
    }
  };

  const colors = colorMap[color] || colorMap.primary;

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer 
      style={[
        styles.card,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        onPress && styles.cardPressable
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        
        <Text style={styles.value}>{value}</Text>
        
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
        
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={styles.trendIcon}>
              {trend > 0 ? '↗' : '↘'}
            </Text>
            <Text style={[
              styles.trendText,
              { color: trend > 0 ? '#22c55e' : '#f3771e' }
            ]}>
              {Math.abs(trend)}% from last week
            </Text>
          </View>
        )}
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardPressable: {
    // Additional styles for pressable cards
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#737373',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendIcon: {
    marginRight: 4,
    fontSize: 12,
  },
  trendText: {
    fontSize: 12,
  },
});

export default StatCard;
