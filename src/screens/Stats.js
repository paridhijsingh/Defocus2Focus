import React, { useState, useMemo } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';

const Stats = ({ onNavigate }) => {
  const { user, stats, sessions } = useUserData();
  const [timeRange, setTimeRange] = useState('week'); // week, month, all

  // Calculate daily stats for the selected time range
  const dailyStats = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const filteredSessions = sessions.filter(session => 
      new Date(session.date) >= startDate
    );

    // Group sessions by date
    const groupedByDate = filteredSessions.reduce((acc, session) => {
      const date = new Date(session.date).toDateString();
      if (!acc[date]) {
        acc[date] = {
          date: date,
          focusTime: 0,
          sessions: 0,
          points: 0,
          interruptions: 0
        };
      }
      acc[date].focusTime += session.duration;
      acc[date].sessions += 1;
      acc[date].points += session.points || 0;
      acc[date].interruptions += session.interruptions || 0;
      return acc;
    }, {});

    return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [sessions, timeRange]);

  // Calculate completion rate
  const completionRate = useMemo(() => {
    if (sessions.length === 0) return 0;
    const completed = sessions.filter(s => s.completed).length;
    return (completed / sessions.length) * 100;
  }, [sessions]);

  // Calculate average session length
  const averageSessionLength = useMemo(() => {
    if (sessions.length === 0) return 0;
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    return Math.round(totalTime / sessions.length);
  }, [sessions]);

  // Calculate productivity score
  const productivityScore = useMemo(() => {
    if (sessions.length === 0) return 0;
    const totalInterruptions = sessions.reduce((sum, s) => sum + (s.interruptions || 0), 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    const completionBonus = completionRate / 100;
    const interruptionPenalty = Math.min(totalInterruptions / sessions.length * 0.1, 0.3);
    return Math.max(0, Math.min(100, (completionBonus * 60) + (totalTime / 60) - interruptionPenalty * 100));
  }, [sessions, completionRate]);

  // Prepare data for pie chart (session completion)
  const completionData = [
    { name: 'Completed', value: sessions.filter(s => s.completed).length, color: '#22c55e' },
    { name: 'Interrupted', value: sessions.filter(s => !s.completed).length, color: '#f59e0b' }
  ];

  // Get top performing days
  const topDays = useMemo(() => {
    return dailyStats
      .sort((a, b) => b.focusTime - a.focusTime)
      .slice(0, 3)
      .map(day => ({
        ...day,
        date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
      }));
  }, [dailyStats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Your Statistics</h2>
        <p className="text-neutral-600">Track your progress and productivity</p>
      </div>

      {/* Time Range Selector */}
      <div className="card">
        <div className="flex justify-center space-x-2">
          {['week', 'month', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Focus Time"
          value={`${Math.round(stats.totalFocusTime / 60)}h`}
          subtitle={`${Math.round(stats.totalFocusTime)} minutes`}
          icon="⏰"
          color="primary"
        />
        
        <StatCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          subtitle="Sessions completed"
          icon="✅"
          color="defocus"
        />
        
        <StatCard
          title="Avg Session"
          value={`${averageSessionLength}m`}
          subtitle="Average length"
          icon="📊"
          color="focus"
        />
        
        <StatCard
          title="Productivity Score"
          value={`${Math.round(productivityScore)}%`}
          subtitle="Overall performance"
          icon="⭐"
          color="accent"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Focus Time Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-neutral-800">Daily Focus Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} minutes`, 'Focus Time']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Bar dataKey="focusTime" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Session Completion Pie Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-neutral-800">Session Completion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {completionData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-neutral-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">Weekly Goal</h3>
          <div className="flex justify-center mb-4">
            <ProgressRing 
              progress={Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100)} 
              size={120} 
              strokeWidth={8}
              color="primary"
            />
          </div>
          <div className="text-sm text-neutral-600">
            {Math.round(stats.weeklyProgress / 60)}h / {Math.round(stats.weeklyGoal / 60)}h
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">Current Streak</h3>
          <div className="flex justify-center mb-4">
            <ProgressRing 
              progress={Math.min((user.currentStreak / 7) * 100, 100)} 
              size={120} 
              strokeWidth={8}
              color="focus"
            />
          </div>
          <div className="text-sm text-neutral-600">
            {user.currentStreak} days • Best: {user.longestStreak}
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">Level Progress</h3>
          <div className="flex justify-center mb-4">
            <ProgressRing 
              progress={(user.experience % 100)} 
              size={120} 
              strokeWidth={8}
              color="accent"
            />
          </div>
          <div className="text-sm text-neutral-600">
            Level {user.level} • {user.experience % 100}/100 XP
          </div>
        </div>
      </div>

      {/* Top Performing Days */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-neutral-800">Top Performing Days</h3>
        {topDays.length > 0 ? (
          <div className="space-y-3">
            {topDays.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800">{day.date}</div>
                    <div className="text-sm text-neutral-600">{day.sessions} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neutral-800">{day.focusTime} min</div>
                  <div className="text-sm text-neutral-600">+{day.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No data available for this time range.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('focus')}
          className="card-hover text-center py-6"
        >
          <div className="text-2xl mb-2">🎯</div>
          <div className="font-semibold text-neutral-800">Start New Session</div>
          <div className="text-sm text-neutral-600">Keep building your stats</div>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="card-hover text-center py-6"
        >
          <div className="text-2xl mb-2">🏠</div>
          <div className="font-semibold text-neutral-800">Back to Dashboard</div>
          <div className="text-sm text-neutral-600">View your overview</div>
        </button>
      </div>
    </div>
  );
};

export default Stats;
