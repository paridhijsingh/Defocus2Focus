// Modern Interactive Dashboard Component
const ModernDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerDuration * 60);
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Mock data for charts and stats
  const productivityData = [
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 92 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 88 },
    { day: 'Fri', score: 95 },
    { day: 'Sat', score: 70 },
    { day: 'Sun', score: 82 }
  ];

  const journalEntries = [
    { id: 1, mood: '😊', note: 'Great focus session today!', time: '2 hours ago' },
    { id: 2, mood: '😌', note: 'Feeling calm after meditation', time: '5 hours ago' },
    { id: 3, mood: '🎯', note: 'Completed all tasks ahead of schedule', time: '1 day ago' }
  ];

  const handleTimerStart = () => {
    setTimerRunning(!timerRunning);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackExpanded(false);
      setFeedbackSubmitted(false);
      setFeedbackForm({ name: '', email: '', message: '' });
    }, 2000);
  };

  const handleFeedbackChange = (field, value) => {
    setFeedbackForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">☰</span>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎯 Defocus2Focus
              </h1>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                🔄 Reset
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white/90 backdrop-blur-md shadow-lg lg:shadow-none transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <nav className="space-y-2">
              {[
                { icon: '🏠', label: 'Dashboard', active: true },
                { icon: '⏰', label: 'Focus Timer', dropdown: true },
                { icon: '🎮', label: 'Mini Games', submenu: ['Puzzle', 'Memory', 'Quick Game'] },
                { icon: '📝', label: 'Scribble Pad' },
                { icon: '📊', label: 'Journal & Insights' },
                { icon: '💬', label: 'Contact & Feedback' }
              ].map((item, index) => (
                <div key={index}>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left hover:bg-blue-50 transition-colors group">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600">{item.label}</span>
                    {item.dropdown && <span className="ml-auto text-gray-400">▼</span>}
                  </button>
                  {item.submenu && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((sub, subIndex) => (
                        <button key={subIndex} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8 animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
              <p className="text-gray-600">Ready to focus and achieve your goals today?</p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Focus Timer Widget */}
              <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Focus Timer</h3>
                  
                  {/* Circular Progress */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - (timeLeft / (timerDuration * 60)))}`}
                        className="text-blue-500 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="space-y-4">
                    <select
                      value={timerDuration}
                      onChange={(e) => setTimerDuration(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[5, 10, 15, 20, 25, 30].map(duration => (
                        <option key={duration} value={duration}>{duration} minutes</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={handleTimerStart}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        timerRunning
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                    >
                      {timerRunning ? '⏸️ Pause' : '▶️ Start Focus'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Productivity Chart */}
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Daily Productivity Score</h3>
                
                {/* Simple Bar Chart */}
                <div className="flex items-end justify-between h-48 space-x-2">
                  {productivityData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-1000 hover:scale-105"
                        style={{ height: `${(data.score / 100) * 180}px` }}
                      />
                      <span className="text-xs text-gray-600 mt-2">{data.day}</span>
                      <span className="text-xs font-semibold text-blue-600">{data.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Journal Highlights */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Journal Highlights</h3>
                <div className="space-y-4">
                  {journalEntries.map(entry => (
                    <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="text-2xl">{entry.mood}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{entry.note}</p>
                        <p className="text-xs text-gray-500 mt-1">{entry.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Games Quick Access */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Mini Games</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: '🧩', name: 'Puzzle', color: 'from-purple-500 to-pink-500' },
                    { icon: '🧠', name: 'Memory', color: 'from-green-500 to-teal-500' },
                    { icon: '⚡', name: 'Quick', color: 'from-orange-500 to-red-500' }
                  ].map((game, index) => (
                    <button
                      key={index}
                      className={`p-4 rounded-xl bg-gradient-to-br ${game.color} text-white hover:scale-105 transition-all duration-300 transform`}
                    >
                      <div className="text-2xl mb-2">{game.icon}</div>
                      <div className="text-xs font-medium">{game.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scribble Pad Shortcut */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Scribble Pad</h3>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl animate-draw-scribble">
                    ✏️
                  </div>
                  <p className="text-gray-600 mb-4">Quick notes and doodles</p>
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                    Open Scribble Pad
                  </button>
                </div>
              </div>
            </div>

            {/* Contact & Feedback Section */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Contact & Feedback</h3>
                <button
                  onClick={() => setFeedbackExpanded(!feedbackExpanded)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  {feedbackExpanded ? 'Close' : 'Send Feedback'}
                </button>
              </div>

              {feedbackExpanded && (
                <div className="animate-fade-in-up">
                  {feedbackSubmitted ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">✅</div>
                      <h4 className="text-xl font-semibold text-green-600 mb-2">Thank you!</h4>
                      <p className="text-gray-600">Your feedback has been submitted successfully.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={feedbackForm.name}
                          onChange={(e) => handleFeedbackChange('name', e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          value={feedbackForm.email}
                          onChange={(e) => handleFeedbackChange('email', e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <textarea
                        placeholder="Your message..."
                        value={feedbackForm.message}
                        onChange={(e) => handleFeedbackChange('message', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Send Feedback
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
