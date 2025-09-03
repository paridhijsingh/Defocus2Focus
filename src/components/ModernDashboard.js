import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  BookOpen as Journal,
  Gamepad2 as Games,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Reusable Card Component
const Card = ({ children, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "journal", icon: BookOpen, label: "Journal" },
    { id: "games", icon: Gamepad2, label: "Games" },
    { id: "ai", icon: Bot, label: "AI Therapist" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Defocus2Focus
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
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
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Hi {user.name} 👋, here's your focus report
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <Bell size={20} />
        </motion.button>
        
        {/* New Goal Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus size={20} />
          <span>New Goal</span>
        </motion.button>
      </div>
    </div>
  );
};

// Focus Progress Card
const FocusProgressCard = () => {
  const completed = 3;
  const target = 5;
  const percentage = (completed / target) * 100;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Focus Progress</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Today's sessions</p>
        </div>
        <Target className="text-blue-500" size={24} />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${percentage}, 100`}
              className="text-blue-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completed}/{target}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">sessions completed</p>
        </div>
      </div>
    </Card>
  );
};

// Journals Written Card
const JournalsCard = () => {
  const total = 12;
  const thisWeek = 3;
  const percentage = (thisWeek / total) * 100;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Journals Written</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">This week</p>
        </div>
        <Journal className="text-green-500" size={24} />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${percentage}, 100`}
              className="text-green-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{thisWeek}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">entries this week</p>
        </div>
      </div>
    </Card>
  );
};

// Leaderboard Card
const LeaderboardCard = () => {
  const topUser = { name: "Alex Chen", score: 2450, avatar: "AC" };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leaderboard</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Top performer</p>
        </div>
        <Trophy className="text-yellow-500" size={24} />
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
          {topUser.avatar}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{topUser.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{topUser.score} points</p>
        </div>
      </div>
    </Card>
  );
};

// Weekly Stats Card
const WeeklyStatsCard = () => {
  const weeklyData = [
    { day: "Mon", sessions: 2 },
    { day: "Tue", sessions: 4 },
    { day: "Wed", sessions: 3 },
    { day: "Thu", sessions: 5 },
    { day: "Fri", sessions: 2 },
    { day: "Sat", sessions: 1 },
    { day: "Sun", sessions: 3 }
  ];

  const maxSessions = Math.max(...weeklyData.map(d => d.sessions));

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Stats</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Focus sessions</p>
        </div>
        <BarChart3 className="text-purple-500" size={24} />
      </div>
      
      <div className="flex items-end justify-between space-x-2 h-20">
        {weeklyData.map((day, index) => (
          <div key={day.day} className="flex flex-col items-center space-y-2">
            <div
              className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg w-6 transition-all duration-300 hover:scale-105"
              style={{ height: `${(day.sessions / maxSessions) * 60}px` }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300">{day.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Quick Actions Card
const QuickActionsCard = () => {
  const actions = [
    { icon: Target, label: "Start Defocus", color: "from-red-500 to-pink-500" },
    { icon: Journal, label: "Write Journal", color: "from-blue-500 to-cyan-500" },
    { icon: Games, label: "Play Game", color: "from-green-500 to-emerald-500" }
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Get started</p>
        </div>
        <Activity className="text-gray-500" size={24} />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-r ${action.color} text-white p-3 rounded-xl flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              <Icon size={20} />
              <span className="font-medium">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
};

// History Summary Card
const HistorySummaryCard = () => {
  const activities = [
    {
      type: "focus",
      title: "Deep Work Session",
      time: "2 hours ago",
      duration: "25 min",
      icon: Target,
      color: "text-blue-500"
    },
    {
      type: "journal",
      title: "Reflection Entry",
      time: "4 hours ago",
      duration: "5 min",
      icon: Journal,
      color: "text-green-500"
    },
    {
      type: "game",
      title: "Memory Challenge",
      time: "6 hours ago",
      duration: "10 min",
      icon: Games,
      color: "text-purple-500"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Your progress</p>
        </div>
        <Clock className="text-indigo-500" size={24} />
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                <Icon className={activity.color} size={16} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.duration}</p>
                <CheckCircle className="text-green-500 ml-auto" size={16} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

// Main Dashboard Component
const ModernDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const user = {
    name: "Paridhi",
    level: 12,
    avatar: "P"
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
          <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <FocusProgressCard />
                <JournalsCard />
                <LeaderboardCard />
                <WeeklyStatsCard />
              </div>
              
              {/* Action and History Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickActionsCard />
                <HistorySummaryCard />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
