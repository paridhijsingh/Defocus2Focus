import React, { useEffect, useRef, useState } from 'react';

const randomPos = () => ({
  top: `${Math.floor(Math.random() * 70) + 10}%`,
  left: `${Math.floor(Math.random() * 70) + 10}%`,
});

const QuickClickGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(randomPos());
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  const clickTarget = () => {
    if (!running) return;
    setScore((s) => s + 1);
    setPos(randomPos());
  };

  const start = () => {
    setScore(0);
    setTimeLeft(30);
    setPos(randomPos());
    setRunning(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-indigo-200">Score: <span className="text-white font-semibold">{score}</span> • Time: <span className="text-white font-semibold">{timeLeft}s</span></div>
        <button onClick={start} className="px-4 py-2 rounded-full text-sm font-semibold text-white logo-gradient">{running ? 'Restart' : 'Start'}</button>
      </div>
      <div className="relative h-64 sm:h-72 rounded-xl border border-white/10 bg-[#0A1B3A] overflow-hidden">
        <button
          onClick={clickTarget}
          disabled={!running}
          className="absolute w-12 h-12 rounded-full shadow-md focus:outline-none"
          style={{
            top: pos.top,
            left: pos.left,
            background: 'linear-gradient(to right, #fb923c, #ec4899, #a855f7, #3b82f6)',
          }}
          aria-label="target"
        />
      </div>
    </div>
  );
};

export default QuickClickGame;


