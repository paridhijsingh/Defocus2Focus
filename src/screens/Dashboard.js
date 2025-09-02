import React from 'react';
import EnhancedDashboard from './EnhancedDashboard';

/**
 * Dashboard - Wrapper component that uses the enhanced dashboard
 * This maintains backward compatibility while providing session cycle integration
 */
const Dashboard = ({ onNavigate }) => {
  return <EnhancedDashboard onNavigate={onNavigate} />;
};

export default Dashboard;