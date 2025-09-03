import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';

// Import screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import DefocusLockScreen from '../screens/DefocusLockScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { state } = useApp();

  // Determine initial screen based on app state
  const getInitialRouteName = () => {
    if (!state.user.hasCompletedOnboarding) {
      return 'Onboarding';
    }
    if (!state.user.isLoggedIn) {
      return 'Login';
    }
    if (state.isDefocusLocked) {
      return 'DefocusLock';
    }
    return 'MainTabs';
  };

  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent back gesture during defocus lock
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="DefocusLock" 
        component={DefocusLockScreen}
        options={{
          gestureEnabled: false, // Prevent back gesture
        }}
      />
    </Stack.Navigator>
  );
}
