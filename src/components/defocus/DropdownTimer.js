import React, { useEffect, useMemo, useRef, useState } from 'react';

const secondsFromMinutes = (minutes) => minutes * 60;

const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

const DropdownTimer = () => {
  const options = useMemo(() => [5, 10, 15, 20, 25, 30], []);
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [remainingSeconds, setRemainingSeconds] = useState(secondsFromMinutes(15));
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const onSelect = (e) => {
    const mins = parseInt(e.target.value, 10);
    setSelectedMinutes(mins);
    setRemainingSeconds(secondsFromMinutes(mins));
  };

  const onStart = () => {
    if (remainingSeconds <= 0) {
      setRemainingSeconds(secondsFromMinutes(selectedMinutes));
    }
    setIsRunning(true);
  };

  const onReset = () => {
    setIsRunning(false);
    setRemainingSeconds(secondsFromMinutes(selectedMinutes));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="defocus-duration" className="text-sm text-indigo-100/90">
            Duration
          </label>
          <select
            id="defocus-duration"
            value={selectedMinutes}
            onChange={onSelect}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-[#0A1B3A] border border-white/10 text-white/90"
          >
            {options.map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStart}
            disabled={isRunning}
            className="px-6 py-2 rounded-full text-sm font-semibold text-white shadow-md transition-transform duration-200 logo-gradient hover:scale-[1.03] disabled:opacity-50"
          >
            Start
          </button>
          <button
            onClick={onReset}
            className="px-6 py-2 rounded-full text-sm font-semibold text-white/90 bg-[#0A1B3A] hover:bg-[#0A1B3A]/90 border border-white/10"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div className="text-5xl font-extrabold tracking-tight tabular-nums">{formatTime(remainingSeconds)}</div>
        <div className="text-sm text-indigo-200">
          Session: {selectedMinutes} minutes
        </div>
      </div>
    </div>
  );
};

export default DropdownTimer;


