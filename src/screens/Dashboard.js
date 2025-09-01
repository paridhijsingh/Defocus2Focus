import React from 'react';
import { useUserData } from '../contexts/UserDataContext';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';

const Dashboard = ({ onNavigate }) => {
  const { user, stats, sessions } = useUserData();

  // Calculate weekly progress percentage
  const weeklyProgressPercentage = Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100);

  // Get today's sessions
  const today = new Date().toDateString();
  const todaysSessions = sessions.filter(session => 
    new Date(session.date).toDateString() === today
  );
  const todaysFocusTime = todaysSessions.reduce((sum, session) => sum + session.duration, 0);

  // Get recent sessions for the activity feed
  const recentSessions = sessions.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name}! 👋</h2>
            <p className="text-primary-100">Ready to focus and level up?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">Level {user.level}</div>
            <div className="text-primary-100 text-sm">
              {user.experience % 100}/100 XP
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Streak"
          value={`${user.currentStreak} days`}
          subtitle="Keep it going!"
          icon="🔥"
          color="focus"
        />
        
        <StatCard
          title="Total Points"
          value={user.totalPoints.toLocaleString()}
          subtitle="Lifetime earned"
          icon="⭐"
          color="accent"
        />
        
        <StatCard
          title="Today's Focus"
          value={`${Math.round(todaysFocusTime)} min`}
          subtitle="Focus time today"
          icon="⏰"
          color="primary"
        />
        
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions}
          subtitle="Sessions completed"
          icon="📈"
          color="defocus"
        />
      </div>

      {/* Weekly Progress */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-neutral-800">Weekly Progress</h3>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Weekly Goal: {Math.round(stats.weeklyGoal / 60)} hours</span>
              <span className="text-sm font-semibold text-neutral-800">
                {Math.round(stats.weeklyProgress / 60)}h / {Math.round(stats.weeklyGoal / 60)}h
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgressPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-neutral-600">
              {Math.round(weeklyProgressPercentage)}% complete
            </div>
          </div>
          <div className="ml-6">
            <ProgressRing 
              progress={weeklyProgressPercentage} 
              size={80} 
              strokeWidth={6}
              color="primary"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('focus')}
          className="card-hover bg-gradient-focus text-white text-center py-8"
        >
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-xl font-bold mb-2">Start Focus Session</h3>
          <p className="text-focus-100">Begin a {stats.settings?.focusDuration || 25}-minute focus session</p>
        </button>

        <button
          onClick={() => onNavigate('defocus')}
          className="card-hover bg-gradient-defocus text-white text-center py-8"
        >
          <div className="text-4xl mb-2">🌿</div>
          <h3 className="text-xl font-bold mb-2">Take a Break</h3>
          <p className="text-defocus-100">Relax with a {stats.settings?.breakDuration || 5}-minute break</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-neutral-800">Recent Activity</h3>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    session.completed ? 'bg-defocus-500' : 'bg-focus-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-neutral-800">
                      {session.completed ? 'Completed' : 'Interrupted'} Focus Session
                    </div>
                    <div className="text-sm text-neutral-600">
                      {new Date(session.date).toLocaleDateString()} • {session.duration} minutes
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neutral-800">
                    +{Math.floor(session.duration / 5) + (session.completed ? 10 : 0)} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <div className="text-4xl mb-2">🎯</div>
            <p>No sessions yet. Start your first focus session!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
