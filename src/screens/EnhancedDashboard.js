import React from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { useFocus } from '../contexts/FocusContext';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';
import CycleCounter from '../components/CycleCounter';

/**
 * EnhancedDashboard - Dashboard with session cycle integration
 * Features: Cycle counter, session status, enhanced user experience
 */
const EnhancedDashboard = ({ onNavigate }) => {
  const { userData, getSessionStats } = useUserData();
  const { 
    isDefocusAvailable, 
    isFocusActive, 
    getDefocusLockMessage,
    getSessionStats: getFocusStats 
  } = useFocus();

  // Calculate weekly progress percentage
  const weeklyProgressPercentage = Math.min(
    (userData.totalFocusTime / (userData.weeklyGoal * 60)) * 100, 
    100
  );

  // Get today's sessions
  const today = new Date().toDateString();
  const todaysSessions = userData.sessions.filter(session => 
    new Date(session.date).toDateString() === today
  );
  const todaysFocusTime = todaysSessions.reduce((sum, session) => sum + session.duration, 0);

  // Get recent sessions for the activity feed
  const recentSessions = userData.sessions.slice(-5).reverse();

  // Get session status message
  const getSessionStatusMessage = () => {
    if (isFocusActive) {
      return {
        title: "🎯 Focus Session Active",
        message: "Keep up the great work!",
        color: "#3b82f6",
        action: "View Session"
      };
    }
    if (!isDefocusAvailable()) {
      return {
        title: "✨ Ready to Focus",
        message: "Complete a focus session to unlock defocus again!",
        color: "#f59e0b",
        action: "Start Focus"
      };
    }
    return {
      title: "🌿 Defocus Available",
      message: "Take a mindful break to recharge.",
      color: "#10b981",
      action: "Take Break"
    };
  };

  const sessionStatus = getSessionStatusMessage();
  const focusStats = getFocusStats();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back! 👋</h2>
            <p className="text-primary-100">Ready to focus and level up?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">Level {userData.level}</div>
            <div className="text-primary-100">🪙 {userData.coins} coins</div>
          </div>
        </div>
      </div>

      {/* Session Cycle Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Session Cycle</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isDefocusAvailable() 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {isDefocusAvailable() ? '🌿 Available' : '🔒 Locked'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cycle Counter */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Today's Cycles</span>
              <span className="text-2xl font-bold text-green-600">
                {focusStats.cyclesCompletedToday}
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((cycle) => (
                <div
                  key={cycle}
                  className={`w-3 h-3 rounded-full ${
                    cycle <= focusStats.cyclesCompletedToday 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Session Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: sessionStatus.color }}
              />
            </div>
            <p className="text-sm text-gray-700">{sessionStatus.message}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('defocus')}
            className={`p-4 rounded-lg text-center transition-all ${
              isDefocusAvailable()
                ? 'bg-green-50 hover:bg-green-100 border-2 border-green-200'
                : 'bg-gray-50 border-2 border-gray-200 cursor-not-allowed opacity-60'
            }`}
            disabled={!isDefocusAvailable()}
          >
            <div className="text-2xl mb-2">
              {isDefocusAvailable() ? '🌿' : '🔒'}
            </div>
            <div className="font-medium">
              {isDefocusAvailable() ? 'Defocus Break' : 'Defocus Locked'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {isDefocusAvailable() ? 'Take a mindful break' : 'Complete focus first'}
            </div>
          </button>

          <button
            onClick={() => onNavigate('focus')}
            className="p-4 rounded-lg text-center bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 transition-all"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium">Focus Session</div>
            <div className="text-sm text-gray-600 mt-1">
              {isFocusActive ? 'Session in progress' : 'Start deep work'}
            </div>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Today's Focus"
          value={`${Math.round(todaysFocusTime)}m`}
          icon="🎯"
          color="blue"
          progress={Math.min((todaysFocusTime / 120) * 100, 100)} // 2 hours goal
        />
        
        <StatCard
          title="Weekly Progress"
          value={`${Math.round(weeklyProgressPercentage)}%`}
          icon="📊"
          color="green"
          progress={weeklyProgressPercentage}
        />
        
        <StatCard
          title="Streak"
          value={`${userData.streak} days`}
          icon="🔥"
          color="orange"
          progress={Math.min((userData.streak / 30) * 100, 100)} // 30 days goal
        />
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-lg">
                    {session.type === 'focus' ? '🎯' : '🌿'}
                  </div>
                  <div>
                    <div className="font-medium">
                      {session.type === 'focus' ? 'Focus Session' : 'Defocus Break'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{session.duration}m</div>
                  <div className="text-sm text-gray-600">
                    {session.completed ? '✅' : '⏸️'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No recent activity</p>
            <p className="text-sm">Start your first session!</p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="text-lg font-semibold mb-4">💡 Today's Tip</h3>
        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-700">
            {isDefocusAvailable() 
              ? "Take a mindful defocus break before starting your focus session. This helps you recharge and approach your work with fresh energy."
              : "Great job using your defocus time! Now complete a focus session to unlock defocus again and maintain your productivity rhythm."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
