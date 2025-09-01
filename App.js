import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Defocus2Focus</Text>
      <Text style={styles.subtitle}>Where Procrastination Meets Play</Text>
      <Text style={styles.status}>✅ App is Working!</Text>
      <Text style={styles.feature}>🎯 Ready for gamified productivity features</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  status: {
    fontSize: 20,
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  feature: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
});
