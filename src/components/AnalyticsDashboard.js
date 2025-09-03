import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  Gamepad2,
  Bot,
  Trophy,
  Settings,
  Search,
  Bell,
  Plus,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  Activity,
  BarChart3,
  PieChart,
  Zap,
} from 'lucide-react';

// Reusable Card Component
const Card = ({ children, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
    { id: 'games', icon: Gamepad2, label: 'Games' },
    { id: 'ai', icon: Bot, label: 'AI Therapist' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen"
    >
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
            <motion.li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            </motion.li>
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
    </motion.div>
  );
};

// Top Bar Component
const TopBar = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hi {user.name} 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Here's your focus report</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </motion.button>

        {/* New Goal Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={20} />
          <span>New Goal</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Focus Progress Card
const FocusProgressCard = () => {
  const progress = 75; // 3/4 sessions completed
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Focus Progress</h3>
        <Target className="text-blue-600" size={24} />
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-blue-600 transition-all duration-1000 ease-in-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
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
        <BookOpen className="text-green-600" size={24} />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray="220"
              strokeDashoffset="55"
              className="text-green-600"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
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
        <Trophy className="text-yellow-600" size={24} />
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
        <BarChart3 className="text-purple-600" size={24} />
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
    { icon: Zap, label: 'Start Defocus', color: 'bg-red-500 hover:bg-red-600' },
    { icon: BookOpen, label: 'Write Journal', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Gamepad2, label: 'Play Game', color: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        <Activity className="text-gray-600" size={24} />
      </div>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center space-x-3 p-3 ${action.color} text-white rounded-xl transition-colors`}
          >
            <action.icon size={20} />
            <span className="font-medium">{action.label}</span>
          </motion.button>
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
        <Clock className="text-indigo-600" size={24} />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
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
            <ChevronRight size={16} className="text-gray-400" />
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

// Main Dashboard Component
const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const user = {
    name: 'Paridhi',
    level: 12,
    xp: 1250,
    streak: 7,
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
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
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full flex items-center justify-center shadow-lg z-50"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </motion.button>
    </div>
  );
};

export default AnalyticsDashboard;
