import React from 'react';

const Navigation = ({ currentScreen, onNavigate }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      color: 'primary'
    },
    {
      id: 'todos',
      label: 'Tasks',
      icon: '📝',
      color: 'secondary'
    },
    {
      id: 'focus',
      label: 'Focus',
      icon: '🎯',
      color: 'focus'
    },
    {
      id: 'defocus',
      label: 'Break',
      icon: '🌿',
      color: 'defocus'
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: '📊',
      color: 'accent'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            const colorClass = isActive ? `${item.color}-600` : 'neutral-400';
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? `bg-${item.color}-50 text-${item.color}-600` 
                    : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className={`text-xs font-medium ${isActive ? `text-${item.color}-600` : 'text-neutral-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
