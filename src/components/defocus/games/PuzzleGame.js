import React, { useEffect, useMemo, useState } from 'react';

const size = 3; // 3x3 grid

const shuffle = (array) => {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Piece = ({ id, correctIndex, currentIndex, onSwap }) => {
  const handleDrop = (e) => {
    const draggedId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    onSwap(draggedId, id);
  };
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', id.toString())}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex items-center justify-center bg-[#0A1B3A] border border-white/10 text-white/90 rounded-lg select-none cursor-move"
      style={{ aspectRatio: '1 / 1' }}
    >
      {id + 1}
    </div>
  );
};

const PuzzleGame = () => {
  const initial = useMemo(() => shuffle([...Array(size * size).keys()]), []);
  const [order, setOrder] = useState(initial);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const onSwap = (aId, bId) => {
    if (!running) setRunning(true);
    setOrder((prev) => {
      const next = prev.slice();
      const aIdx = next.indexOf(aId);
      const bIdx = next.indexOf(bId);
      [next[aIdx], next[bIdx]] = [next[bIdx], next[aIdx]];
      return next;
    });
    setMoves((m) => m + 1);
  };

  const isSolved = order.every((val, idx) => val === idx);

  const reset = () => {
    setOrder(shuffle([...Array(size * size).keys()]));
    setMoves(0);
    setSeconds(0);
    setRunning(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-indigo-200">
          Moves: <span className="font-semibold text-white">{moves}</span> • Time: <span className="font-semibold text-white">{seconds}s</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={reset} className="px-4 py-2 rounded-full text-sm font-semibold text-white logo-gradient">{isSolved ? 'Replay' : 'Reset'}</button>
        </div>
      </div>

      {isSolved && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-600/20 text-emerald-200 border border-emerald-400/30">🎉 Solved!</div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {order.map((id, idx) => (
          <Piece key={id} id={id} currentIndex={idx} correctIndex={id} onSwap={onSwap} />
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;


