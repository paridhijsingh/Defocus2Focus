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
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  ChevronDown,
  MoreHorizontal,
  ArrowUp,
  ArrowDown
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
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
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
              className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 relative ${
                activeTab === item.id
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {activeTab === item.id && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-center relative">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold relative">
            {user.name.charAt(0).toUpperCase()}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              6
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="absolute right-0 p-1 text-gray-400 hover:text-white"
          >
            <ChevronDown size={16} />
          </motion.button>
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">defocus2focus.com/companyname</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
        </div>
        
        {/* Fullscreen */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <Activity size={20} />
        </motion.button>
        
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors relative"
        >
          <Bell size={20} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            6
          </div>
        </motion.button>
        
        {/* New Company Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus size={20} />
          <span>New Company</span>
        </motion.button>
      </div>
    </div>
  );
};

// Total Likes Card
const TotalLikesCard = () => {
  return (
    <Card className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Total Likes</h3>
        <Heart className="text-white/80" size={24} />
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold mb-2">23.0000K</p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            <span>Female %20</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <span>Male %50</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
            <span>Other %30</span>
          </div>
        </div>
      </div>
      
      {/* Mini Chart */}
      <div className="h-12 flex items-end space-x-1">
        {[20, 35, 25, 40, 30, 45, 35].map((height, index) => (
          <div
            key={index}
            className="bg-white/30 rounded-t-sm"
            style={{ height: `${height}px`, width: '8px' }}
          />
        ))}
      </div>
    </Card>
  );
};

// Pending Messages Card
const PendingMessagesCard = () => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Messages</h3>
        <MessageCircle className="text-gray-500" size={24} />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">20.k</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">Female %80</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">Male %20</span>
            </div>
          </div>
        </div>
        
        {/* Donut Chart */}
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
              strokeDasharray="80, 100"
              className="text-orange-500"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
};

// Comments Card
const CommentsCard = () => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
        <MessageCircle className="text-gray-500" size={24} />
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">3.k</p>
        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full" style={{ width: '60%' }} />
        </div>
      </div>
    </Card>
  );
};

// Post Activity Card
const PostActivityCard = () => {
  const activities = [
    {
      avatar: "AC",
      title: "What is the value for your company",
      subtitle: "Post number 2",
      category: "Company",
      views: "7.k",
      change: "-4%",
      isPositive: false
    },
    {
      avatar: "JD",
      title: "Blog post about productivity",
      subtitle: "Post number 1",
      category: "Blog",
      views: "12.k",
      change: "+5%",
      isPositive: true
    },
    {
      avatar: "SM",
      title: "New product launch announcement",
      subtitle: "Post number 3",
      category: "Product",
      views: "15.k",
      change: "+8%",
      isPositive: true
    }
  ];

  return (
    <Card className="col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium">
            Post Activity
          </button>
          <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            User
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
              {activity.avatar}
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{activity.subtitle}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                {activity.category}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{activity.views}</span>
            </div>
            
            <div className={`flex items-center space-x-1 ${activity.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {activity.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-medium">{activity.change}</span>
            </div>
            
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreHorizontal size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

// Post Stats Card
const PostStatsCard = () => {
  const weeklyData = [
    { day: "M", sessions: 2 },
    { day: "T", sessions: 4 },
    { day: "W", sessions: 3 },
    { day: "T", sessions: 5 },
    { day: "F", sessions: 2 },
    { day: "S", sessions: 1 },
    { day: "S", sessions: 3 }
  ];

  const maxSessions = Math.max(...weeklyData.map(d => d.sessions));

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Post Stats</h3>
        <BarChart3 className="text-gray-500" size={24} />
      </div>
      
      <div className="flex items-end justify-between space-x-2 h-20">
        {weeklyData.map((day, index) => (
          <div key={day.day} className="flex flex-col items-center space-y-2">
            <div
              className={`rounded-t-lg w-6 transition-all duration-300 hover:scale-105 ${
                index === 3 ? 'bg-gradient-to-t from-pink-500 to-orange-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              style={{ height: `${(day.sessions / maxSessions) * 60}px` }}
            />
            {index === 3 && (
              <Star className="text-pink-500" size={12} />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-300">{day.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Completed Posts Card
const CompletedPostsCard = () => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed Posts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Current Week</p>
        </div>
        <Calendar className="text-gray-500" size={24} />
      </div>
      
      <div className="flex items-center space-x-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">874</p>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Activity className="text-gray-600 dark:text-gray-300" size={16} />
        </div>
      </div>
    </Card>
  );
};

// Links Shared Card
const LinksSharedCard = () => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Links Shared</h3>
        <Share2 className="text-gray-500" size={24} />
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">10.k</p>
        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full" style={{ width: '75%' }} />
        </div>
      </div>
    </Card>
  );
};

// Main Dashboard Component
const EnhancedAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const user = {
    name: "Paridhi",
    level: 12,
    avatar: "P"
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
              {/* Dynamic Greeting */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Hi {user.name} 👋, here's your focus report
                </h2>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <TotalLikesCard />
                <PendingMessagesCard />
                <CommentsCard />
                <CompletedPostsCard />
              </div>
              
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <PostActivityCard />
                <PostStatsCard />
              </div>
              
              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LinksSharedCard />
                <div className="flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                      🎯
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Focus Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Ready to start your next session?</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Start Focus Session
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
