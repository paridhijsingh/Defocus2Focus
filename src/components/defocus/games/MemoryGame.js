import React, { useEffect, useMemo, useState } from 'react';

const icons = ['🎯','🌿','🎵','🧠','⭐','🔥'];

const createDeck = () => {
  const deck = icons.concat(icons).map((icon, idx) => ({ id: idx, icon, matched: false }));
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const Card = ({ card, flipped, onClick }) => (
  <button
    onClick={onClick}
    disabled={card.matched || flipped}
    className={`h-20 sm:h-24 rounded-xl border border-white/10 flex items-center justify-center text-2xl transition-transform duration-200 ${
      flipped || card.matched ? 'bg-[#0A1B3A]' : 'logo-gradient'
    } ${card.matched ? 'opacity-70' : 'hover:scale-[1.03]'}`}
  >
    {(flipped || card.matched) ? card.icon : ''}
  </button>
);

const MemoryGame = () => {
  const [deck, setDeck] = useState(createDeck());
  const [selected, setSelected] = useState([]); // indices
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => {
    setDeck(createDeck());
    setSelected([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
  };

  const allMatched = deck.every((c) => c.matched);

  useEffect(() => {
    if (selected.length === 2) {
      setMoves((m) => m + 1);
      const [i, j] = selected;
      if (deck[i].icon === deck[j].icon) {
        setDeck((prev) => prev.map((c, idx) => (idx === i || idx === j ? { ...c, matched: true } : c)));
        setSelected([]);
      } else {
        const timeout = setTimeout(() => setSelected([]), 700);
        return () => clearTimeout(timeout);
      }
    }
    return undefined;
  }, [selected, deck]);

  const onCardClick = (idx) => {
    if (!running) setRunning(true);
    if (selected.length < 2 && !selected.includes(idx)) setSelected((s) => [...s, idx]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-indigo-200">Moves: <span className="text-white font-semibold">{moves}</span> • Time: <span className="text-white font-semibold">{seconds}s</span></div>
        <button onClick={reset} className="px-4 py-2 rounded-full text-sm font-semibold text-white logo-gradient">{allMatched ? 'Replay' : 'Reset'}</button>
      </div>
      {allMatched && <div className="mb-4 p-3 rounded-lg bg-emerald-600/20 text-emerald-200 border border-emerald-400/30">🎉 All matched!</div>}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card, idx) => (
          <Card key={card.id} card={card} flipped={selected.includes(idx)} onClick={() => onCardClick(idx)} />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;


