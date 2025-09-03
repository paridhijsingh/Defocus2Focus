import React, { useState, useEffect } from 'react';

// Reusable Card Component
const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'journal', icon: '📓', label: 'Journal' },
    { id: 'games', icon: '🎮', label: 'Games' },
    { id: 'ai', icon: '🤖', label: 'AI Therapist' },
    { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎯 Defocus2Focus
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Level {user.level}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Top Bar Component
const TopBar = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hi {user.name} 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Here's your focus report</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        )}
        
        {/* Search Bar */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* New Goal Button */}
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New Goal</span>
        </button>
      </div>
    </div>
  );
};

// Focus Progress Card
const FocusProgressCard = () => {
  const progress = 75; // 3/4 sessions completed

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Focus Progress</h3>
        <span className="text-2xl">🎯</span>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <div 
              className="absolute inset-0 rounded-full border-8 border-blue-600 border-t-transparent transform -rotate-90"
              style={{
                background: `conic-gradient(from 0deg, #3b82f6 0deg, #3b82f6 ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`
              }}
            ></div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{progress}%</span>
          </div>
        </div>
        
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">3/4</p>
          <p className="text-gray-600 dark:text-gray-400">Sessions Today</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+1 from yesterday</p>
        </div>
      </div>
    </Card>
  );
};

// Journals Written Card
const JournalsWrittenCard = () => {
  const journalData = [
    { type: 'Reflection', count: 5, color: 'bg-blue-500' },
    { type: 'Gratitude', count: 3, color: 'bg-green-500' },
    { type: 'Goals', count: 2, color: 'bg-purple-500' },
  ];

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Journals Written</h3>
        <span className="text-2xl">📝</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <div 
              className="absolute inset-0 rounded-full border-8 border-green-600 border-t-transparent transform -rotate-90"
              style={{
                background: `conic-gradient(from 0deg, #10b981 0deg, #10b981 270deg, transparent 270deg)`
              }}
            ></div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">10</span>
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">This Week</p>
          <div className="space-y-1">
            {journalData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-gray-600 dark:text-gray-400">{item.type}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Leaderboard Card
const LeaderboardCard = () => {
  const topUsers = [
    { name: 'Alex Chen', score: 1250, avatar: 'AC', rank: 1 },
    { name: 'Sarah Kim', score: 1180, avatar: 'SK', rank: 2 },
    { name: 'Mike Johnson', score: 1100, avatar: 'MJ', rank: 3 },
  ];

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leaderboard</h3>
        <span className="text-2xl">🏆</span>
      </div>
      
      <div className="space-y-3">
        {topUsers.map((user, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white text-sm font-bold">
              {user.rank}
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{user.avatar}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.score} XP</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Weekly Stats Card
const WeeklyStatsCard = () => {
  const weeklyData = [
    { day: 'Mon', sessions: 3 },
    { day: 'Tue', sessions: 4 },
    { day: 'Wed', sessions: 2 },
    { day: 'Thu', sessions: 5 },
    { day: 'Fri', sessions: 3 },
    { day: 'Sat', sessions: 1 },
    { day: 'Sun', sessions: 2 },
  ];

  const maxSessions = Math.max(...weeklyData.map(d => d.sessions));

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Stats</h3>
        <span className="text-2xl">📊</span>
      </div>
      
      <div className="flex items-end justify-between h-32">
        {weeklyData.map((day, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div
              className="bg-purple-600 rounded-t-lg transition-all duration-500 ease-out"
              style={{
                width: '24px',
                height: `${(day.sessions / maxSessions) * 80}px`,
                minHeight: '8px',
              }}
            ></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">{day.day}</span>
            <span className="text-xs font-medium text-gray-900 dark:text-white">{day.sessions}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Quick Actions Card
const QuickActionsCard = () => {
  const actions = [
    { icon: '⚡', label: 'Start Defocus', color: 'bg-red-500 hover:bg-red-600' },
    { icon: '📝', label: 'Write Journal', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: '🎮', label: 'Play Game', color: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        <span className="text-2xl">⚡</span>
      </div>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`w-full flex items-center space-x-3 p-3 ${action.color} text-white rounded-xl transition-all duration-200 hover:scale-105`}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

// History Summary Card
const HistorySummaryCard = () => {
  const activities = [
    {
      type: 'focus',
      title: 'Deep Work Session',
      time: '2 hours ago',
      avatar: '🎯',
      stats: '25 min',
      tag: 'Productivity',
    },
    {
      type: 'journal',
      title: 'Daily Reflection',
      time: '4 hours ago',
      avatar: '📝',
      stats: '5 min',
      tag: 'Mindfulness',
    },
    {
      type: 'game',
      title: 'Puzzle Challenge',
      time: '6 hours ago',
      avatar: '🧩',
      stats: 'Level 3',
      tag: 'Relaxation',
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <span className="text-2xl">🕐</span>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl">{activity.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{activity.stats}</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  {activity.tag}
                </span>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Main Dashboard Component
const WebAnalyticsDashboard = ({ user = { name: 'Paridhi', level: 12 }, onBack }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('defocus2focus_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('defocus2focus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('defocus2focus_theme', 'light');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <TopBar user={user} />
          
          {/* Dashboard Content */}
          <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <FocusProgressCard />
                <JournalsWrittenCard />
                <LeaderboardCard />
                <WeeklyStatsCard />
              </div>
              
              {/* Bottom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickActionsCard />
                <HistorySummaryCard />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-105 transition-transform"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default WebAnalyticsDashboard;
