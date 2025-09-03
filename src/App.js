import React from 'react';
import { StatusBar } from 'expo-status-bar';
import '../global.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import DashboardScreen from './screens/DashboardScreen';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <StatusBar style="auto" />
        <DashboardScreen />
      </UserProvider>
    </ThemeProvider>
  );
}
