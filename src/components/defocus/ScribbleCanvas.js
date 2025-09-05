import React, { useEffect, useRef, useState } from 'react';

const COLORS = ['#ffffff', '#fb923c', '#ec4899', '#a855f7', '#3b82f6', '#22d3ee'];

const ScribbleCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [strokeColor, setStrokeColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctxRef.current = ctx;
    const resize = () => {
      const { width } = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = (width * 0.6) * ratio;
      canvas.style.height = `${(width * 0.6)}px`;
      ctx.scale(ratio, ratio);
      ctx.fillStyle = '#0B1E42';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = tool === 'eraser' ? '#0B1E42' : strokeColor;
    ctxRef.current.lineWidth = tool === 'eraser' ? 18 : strokeWidth;
  }, [tool, strokeColor, strokeWidth]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const move = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const end = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    ctxRef.current.fillStyle = '#0B1E42';
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${tool === 'pen' ? 'logo-gradient text-white' : 'bg-[#0A1B3A] text-white/90 border border-white/10'}`}
          >Pen</button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${tool === 'eraser' ? 'logo-gradient text-white' : 'bg-[#0A1B3A] text-white/90 border border-white/10'}`}
          >Eraser</button>
        </div>
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              aria-label={`color ${c}`}
              onClick={() => { setTool('pen'); setStrokeColor(c); }}
              className="w-6 h-6 rounded-full border border-white/20"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="12"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
          />
        </div>
        <button onClick={clearCanvas} className="ml-auto px-4 py-2 rounded-full text-sm font-semibold text-white logo-gradient">Clear</button>
      </div>
      <div
        className="rounded-xl overflow-hidden border border-white/10 bg-[#0B1E42] touch-none"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      >
        <canvas ref={canvasRef} className="w-full block" />
      </div>
    </div>
  );
};

export default ScribbleCanvas;


