import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Simple web-compatible app without complex dependencies
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({
    streak: 0,
    totalSessions: 0,
    totalHours: 0,
    xp: 0,
    coins: 0,
    todaySessions: 0,
    todayGoal: 5,
    level: 1,
    badges: [],
  });

  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleStartDefocus = () => {
    setCurrentScreen('defocus');
  };

  const completeSession = () => {
    const newStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
      todaySessions: stats.todaySessions + 1,
      xp: stats.xp + 50,
      coins: stats.coins + 25,
      streak: stats.streak + 1,
    };
    setStats(newStats);
    setCurrentScreen('dashboard');
    Alert.alert('Success!', 'Defocus session completed! +50 XP, +25 coins');
  };

  const renderWelcome = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#3b82f6' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
        🎯 Defocus2Focus
      </Text>
      <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', marginBottom: 40 }}>
        Where Productivity Meets Play
      </Text>
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '100%', maxWidth: 400 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Welcome Back!
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 20, fontSize: 16 }}
        />
        <TouchableOpacity
          onPress={handleLogin}
          style={{ backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDashboard = () => (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ backgroundColor: '#3b82f6', padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>
          Hi {username} 👋
        </Text>
        <Text style={{ color: 'white', opacity: 0.8 }}>Level {stats.level} • Ready to focus?</Text>
      </View>
      
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, flex: 1, marginRight: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3b82f6' }}>{stats.streak}</Text>
            <Text style={{ color: '#666' }}>Day Streak</Text>
          </View>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>{stats.xp}</Text>
            <Text style={{ color: '#666' }}>XP</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, flex: 1, marginRight: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#f59e0b' }}>{stats.coins}</Text>
            <Text style={{ color: '#666' }}>Coins</Text>
          </View>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#8b5cf6' }}>{stats.totalSessions}</Text>
            <Text style={{ color: '#666' }}>Sessions</Text>
          </View>
        </View>

        {/* Main Action */}
        <TouchableOpacity
          onPress={handleStartDefocus}
          style={{ backgroundColor: '#3b82f6', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 20 }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>🎯 Start Defocus Session</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <TouchableOpacity style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '48%', marginBottom: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 5 }}>📝</Text>
            <Text style={{ fontWeight: 'bold' }}>Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '48%', marginBottom: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 5 }}>🎮</Text>
            <Text style={{ fontWeight: 'bold' }}>Games</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '48%', marginBottom: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 5 }}>🎵</Text>
            <Text style={{ fontWeight: 'bold' }}>Music</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '48%', marginBottom: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 5 }}>🏆</Text>
            <Text style={{ fontWeight: 'bold' }}>Rewards</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderDefocus = () => (
    <View style={{ flex: 1, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
        🎯 Defocus Session
      </Text>
      <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', marginBottom: 40 }}>
        Take a break and reset your mind
      </Text>
      
      <View style={{ backgroundColor: 'white', padding: 30, borderRadius: 15, width: '100%', maxWidth: 400, alignItems: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 20 }}>⏰</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Focus on your breathing
        </Text>
        <Text style={{ color: '#666', textAlign: 'center', marginBottom: 30 }}>
          Take deep breaths and let your mind rest. This break will help you return with renewed focus.
        </Text>
        
        <TouchableOpacity
          onPress={completeSession}
          style={{ backgroundColor: '#10b981', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Complete Session</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setCurrentScreen('dashboard')}
          style={{ marginTop: 10, padding: 10 }}
        >
          <Text style={{ color: '#666' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      {currentScreen === 'welcome' && renderWelcome()}
      {currentScreen === 'dashboard' && renderDashboard()}
      {currentScreen === 'defocus' && renderDefocus()}
    </View>
  );
}