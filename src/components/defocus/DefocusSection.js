import React, { useState } from 'react';
import DropdownTimer from './DropdownTimer';
import ScribbleCanvas from './ScribbleCanvas';
import PuzzleGame from './games/PuzzleGame';
import MemoryGame from './games/MemoryGame';
import QuickClickGame from './games/QuickClickGame';

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
      active
        ? 'text-white logo-gradient shadow-md'
        : 'text-white/90 bg-[#0A1B3A] hover:bg-[#0A1B3A]/90 border border-white/10'
    }`}
    aria-pressed={active}
  >
    {label}
  </button>
);

const DefocusSection = () => {
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <div className="min-h-screen w-full bg-[#0A1B3A] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Defocus</h2>
          <p className="text-indigo-100/90 mt-1">Mindful breaks: timer, scribble, and mini‑games</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton label="Timer" active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} />
          <TabButton label="Scribble" active={activeTab === 'scribble'} onClick={() => setActiveTab('scribble')} />
          <TabButton label="Puzzle" active={activeTab === 'puzzle'} onClick={() => setActiveTab('puzzle')} />
          <TabButton label="Memory" active={activeTab === 'memory'} onClick={() => setActiveTab('memory')} />
          <TabButton label="Quick Click" active={activeTab === 'quick'} onClick={() => setActiveTab('quick')} />
        </div>

        <div className="bg-[#0B1E42] rounded-2xl border border-white/10 shadow-xl p-4 sm:p-6">
          {activeTab === 'timer' && <DropdownTimer />}
          {activeTab === 'scribble' && <ScribbleCanvas />}
          {activeTab === 'puzzle' && <PuzzleGame />}
          {activeTab === 'memory' && <MemoryGame />}
          {activeTab === 'quick' && <QuickClickGame />}
        </div>
      </div>
    </div>
  );
};

export default DefocusSection;


