
import React, { useState, useRef, useEffect } from 'react';
import { 
    MoreHorizontal, Layout, Plus, Trash2, 
    ChevronLeft, ChevronRight, Grid, MousePointer2, 
    PenTool, Users, Share2, Save, RotateCcw,
    Shield, Zap, Target, Info, Brain, Activity, 
    TrendingUp, Send, SaveAll, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MATCH_HISTORY } from '../constants';

interface Player {
    id: string;
    name: string;
    x: number;
    y: number;
    role: string;
    instruction?: string;
    isOpponent?: boolean;
}

interface DrawingLine {
    id: string;
    points: { x: number, y: number }[];
    color: string;
    type: 'arrow' | 'line';
}

interface TacticBoard {
    id: string;
    name: string;
    players: Player[];
    drawings: DrawingLine[];
    activeAdvice: string[];
}

const AI_ADVICE = {
    '2-3-1': {
        defensive: ['Bekler merkeze yakın durmalı', 'Alan savunması öncelikli', 'Kaleci libero gibi oynamalı'],
        offensive: ['Kanatlar çizgiye inmeli', 'Forvet arkası serbest rol', 'Hızlı kontra atak odağı'],
        general: ['Dengeli oyun yapısı', 'Orta saha hakimiyeti', 'Kısa pas trafiği']
    },
    '3-2-1': {
        defensive: ['Üçlü stoper hattı kurulmalı', 'Gömülü savunma', 'Rakibi dışarı it'],
        offensive: ['Tek forvet hedef adam', 'Orta sahadan sürpriz koşular', 'Uzun toplarla çıkış'],
        general: ['Kontrollü oyun', 'Fiziksel üstünlük', 'Sabırlı hücum']
    },
    '2-2-2': {
        defensive: ['İkili bloklar arası mesafe', 'Agresif pres', 'Ofsayt taktiği'],
        offensive: ['Çift forvet uyumu', 'Yaratıcı orta saha', 'Dinamik kanat bindirmeleri'],
        general: ['Yüksek tempo', 'Akışkan diziliş', 'Total futbol']
    }
};

const HEATMAP_DATA: Record<string, { x: number, y: number, r: number }[]> = {
    'FW': [{ x: 50, y: 15, r: 20 }, { x: 30, y: 20, r: 15 }, { x: 70, y: 20, r: 15 }],
    'CM': [{ x: 50, y: 50, r: 25 }, { x: 40, y: 45, r: 20 }, { x: 60, y: 45, r: 20 }],
    'LM': [{ x: 15, y: 45, r: 20 }, { x: 10, y: 30, r: 15 }, { x: 10, y: 60, r: 15 }],
    'RM': [{ x: 85, y: 45, r: 20 }, { x: 90, y: 30, r: 15 }, { x: 90, y: 60, r: 15 }],
    'LB': [{ x: 25, y: 75, r: 20 }, { x: 15, y: 65, r: 15 }, { x: 15, y: 85, r: 15 }],
    'RB': [{ x: 75, y: 75, r: 20 }, { x: 85, y: 65, r: 15 }, { x: 85, y: 85, r: 15 }],
    'GK': [{ x: 50, y: 92, r: 15 }, { x: 50, y: 85, r: 10 }]
};

// Default initial positions for a 2-3-1
const DEFAULT_POSITIONS: Player[] = [
    { id: '1', name: 'Burak', x: 50, y: 15, role: 'FW' },
    { id: '2', name: 'Can', x: 20, y: 45, role: 'LM' },
    { id: '3', name: 'Mert', x: 50, y: 45, role: 'CM' },
    { id: '4', name: 'Ali', x: 80, y: 45, role: 'RM' },
    { id: '5', name: 'Kaya', x: 30, y: 75, role: 'LB' },
    { id: '6', name: 'Veli', x: 70, y: 75, role: 'RB' },
    { id: '7', name: 'GK', x: 50, y: 92, role: 'GK' },
];

const FORMATIONS = {
    '2-3-1': [
        { x: 50, y: 15 }, { x: 20, y: 45 }, { x: 50, y: 45 }, { x: 80, y: 45 }, { x: 30, y: 75 }, { x: 70, y: 75 }, { x: 50, y: 92 }
    ],
    '3-2-1': [
        { x: 50, y: 15 }, { x: 35, y: 45 }, { x: 65, y: 45 }, { x: 20, y: 75 }, { x: 50, y: 80 }, { x: 80, y: 75 }, { x: 50, y: 92 }
    ],
    '2-2-2': [
        { x: 35, y: 20 }, { x: 65, y: 20 }, { x: 35, y: 50 }, { x: 65, y: 50 }, { x: 35, y: 80 }, { x: 65, y: 80 }, { x: 50, y: 92 }
    ]
};

interface StudioProps {
    onBack: () => void;
    onNavigate: (view: any) => void;
}

const Studio: React.FC<StudioProps> = ({ onBack, onNavigate }) => {
  // Multi-Tactic State
  const [tactics, setTactics] = useState<TacticBoard[]>([
      { id: 't1', name: 'HÜCUM PLANI', players: JSON.parse(JSON.stringify(DEFAULT_POSITIONS)), drawings: [], activeAdvice: [] },
      { id: 't2', name: 'SAVUNMA (B)', players: JSON.parse(JSON.stringify(DEFAULT_POSITIONS)), drawings: [], activeAdvice: [] }
  ]);
  const [activeTacticIndex, setActiveTacticIndex] = useState(0);
  const [currentFormation, setCurrentFormation] = useState<keyof typeof FORMATIONS>('2-3-1');
  
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [tool, setTool] = useState<'move' | 'draw' | 'opponent'>('move');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<DrawingLine | null>(null);
  const [showFormationMenu, setShowFormationMenu] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentTactic = tactics[activeTacticIndex];

  const toggleAdvice = (advice: string) => {
      const updatedTactics = [...tactics];
      const currentAdvice = updatedTactics[activeTacticIndex].activeAdvice;
      if (currentAdvice.includes(advice)) {
          updatedTactics[activeTacticIndex].activeAdvice = currentAdvice.filter(a => a !== advice);
      } else {
          updatedTactics[activeTacticIndex].activeAdvice = [...currentAdvice, advice];
      }
      setTactics(updatedTactics);
  };

  // --- Interaction Logic ---

  const handlePointerDown = (e: React.PointerEvent) => {
    if (tool === 'draw' && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        setIsDrawing(true);
        setCurrentLine({
            id: `l${Date.now()}`,
            points: [{ x, y }],
            color: '#39FF14',
            type: 'arrow'
        });
    } else if (tool === 'opponent' && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const newOpponent: Player = {
            id: `opp${Date.now()}`,
            name: 'RAKİP',
            x,
            y,
            role: 'OPP',
            isOpponent: true
        };
        
        const updatedTactics = [...tactics];
        updatedTactics[activeTacticIndex].players.push(newOpponent);
        setTactics(updatedTactics);
        if (navigator.vibrate) navigator.vibrate(5);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedPlayer && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      const updatedTactics = [...tactics];
      updatedTactics[activeTacticIndex].players = updatedTactics[activeTacticIndex].players.map(p => 
        p.id === draggedPlayer ? { ...p, x: clampedX, y: clampedY } : p
      );
      setTactics(updatedTactics);
    } else if (isDrawing && currentLine && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        setCurrentLine({
            ...currentLine,
            points: [...currentLine.points, { x, y }]
        });
    }
  };

  const handlePointerUp = () => {
    if (isDrawing && currentLine) {
        const updatedTactics = [...tactics];
        updatedTactics[activeTacticIndex].drawings.push(currentLine);
        setTactics(updatedTactics);
        setIsDrawing(false);
        setCurrentLine(null);
    }
    setDraggedPlayer(null);
  };

  const handleDragStart = (id: string, e: React.PointerEvent) => {
      if (tool !== 'move') return;
      e.stopPropagation();
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggedPlayer(id);
      setSelectedPlayerId(id);
      if (navigator.vibrate) navigator.vibrate(10);
  };

  const applyFormation = (formationKey: keyof typeof FORMATIONS) => {
      setCurrentFormation(formationKey);
      const coords = FORMATIONS[formationKey];
      const updatedTactics = [...tactics];
      // Only apply to non-opponent players
      let coordIdx = 0;
      updatedTactics[activeTacticIndex].players = updatedTactics[activeTacticIndex].players.map(p => {
          if (!p.isOpponent && coordIdx < coords.length) {
              return { ...p, x: coords[coordIdx].x, y: coords[coordIdx++].y };
          }
          return p;
      });
      setTactics(updatedTactics);
      setShowFormationMenu(false);
      if (navigator.vibrate) navigator.vibrate(30);
  };

  const clearDrawings = () => {
      const updatedTactics = [...tactics];
      updatedTactics[activeTacticIndex].drawings = [];
      setTactics(updatedTactics);
  };

  const clearOpponents = () => {
      const updatedTactics = [...tactics];
      updatedTactics[activeTacticIndex].players = updatedTactics[activeTacticIndex].players.filter(p => !p.isOpponent);
      setTactics(updatedTactics);
  };

  const addNewTactic = () => {
      const newTactic: TacticBoard = {
          id: `t${Date.now()}`,
          name: `PLAN ${String.fromCharCode(65 + tactics.length)}`,
          players: JSON.parse(JSON.stringify(DEFAULT_POSITIONS)),
          drawings: [],
          activeAdvice: []
      };
      setTactics([...tactics, newTactic]);
      setActiveTacticIndex(tactics.length);
      if (navigator.vibrate) navigator.vibrate(50);
  };

  const removeCurrentTactic = () => {
      if (tactics.length > 1) {
          const newTactics = tactics.filter((_, i) => i !== activeTacticIndex);
          setTactics(newTactics);
          setActiveTacticIndex(Math.max(0, activeTacticIndex - 1));
          if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
      }
  };

  const updatePlayerInstruction = (id: string, instruction: string) => {
      const updatedTactics = [...tactics];
      updatedTactics[activeTacticIndex].players = updatedTactics[activeTacticIndex].players.map(p => 
          p.id === id ? { ...p, instruction } : p
      );
      setTactics(updatedTactics);
  };

  const selectedPlayer = currentTactic.players.find(p => p.id === selectedPlayerId);

  return (
    <div className="min-h-screen bg-[#050812] flex flex-col font-sans selection:bg-[#39FF14] selection:text-black">
      
      {/* 1. TOP BAR */}
      <header className="px-6 py-4 flex justify-between items-center sticky top-0 bg-[#050812]/90 backdrop-blur-xl z-30 border-b border-white/5">
          <div>
              <h1 className="text-xl font-black text-white tracking-[0.2em] uppercase">TAKTIK STUDIO</h1>
              <p className="text-[10px] text-[#39FF14] font-mono uppercase">Live Coaching Mode</p>
          </div>
          <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-[#161B22] border border-white/10 flex items-center justify-center text-[#39FF14] hover:bg-[#39FF14]/10 transition-all">
                  <Share2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#161B22] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <MoreHorizontal size={20} />
              </button>
          </div>
      </header>

      {/* 2. TOOLBAR */}
      <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-[#0A0E14]/50 border-b border-white/5">
          <button 
            onClick={() => setTool('move')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${tool === 'move' ? 'bg-[#39FF14] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
              <MousePointer2 size={14} /> TAŞI
          </button>
          <button 
            onClick={() => setTool('draw')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${tool === 'draw' ? 'bg-[#39FF14] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
              <PenTool size={14} /> ÇİZ
          </button>
          <button 
            onClick={() => setTool('opponent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${tool === 'opponent' ? 'bg-[#39FF14] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
              <Users size={14} /> RAKİP EKLE
          </button>
          <div className="w-px h-8 bg-white/10 mx-1"></div>
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${isSimulating ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
              <Activity size={14} className={isSimulating ? 'animate-pulse' : ''} /> SİMÜLASYON
          </button>
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${showHeatmap ? 'bg-orange-500 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
              {showHeatmap ? <Eye size={14} /> : <EyeOff size={14} />} ISI HARİTASI
          </button>
          <button 
            onClick={() => setShowFormationMenu(!showFormationMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/5 text-white hover:bg-white/10 transition-all whitespace-nowrap"
          >
              <Layout size={14} /> DİZİLİŞ
          </button>
      </div>

      {/* 3. THE TACTICAL HUB (Pitch Area) */}
      <div className="relative w-full z-20 px-0 pt-4 pb-6">
          
          {/* Formation Menu Overlay */}
          <AnimatePresence>
              {showFormationMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#161B22] border border-white/10 rounded-2xl p-2 shadow-2xl flex gap-2"
                  >
                      {Object.keys(FORMATIONS).map(f => (
                          <button 
                            key={f}
                            onClick={() => applyFormation(f as any)}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-[#39FF14] hover:text-black text-white text-xs font-black transition-all"
                          >
                              {f}
                          </button>
                      ))}
                  </motion.div>
              )}
          </AnimatePresence>

          {/* Controls Header */}
          <div className="flex justify-between items-center px-6 mb-3">
              <button 
                onClick={removeCurrentTactic}
                disabled={tactics.length <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 disabled:opacity-30 disabled:border-transparent transition-all"
              >
                  <Trash2 size={18} />
              </button>
              
              <div className="flex flex-col items-center">
                  <h2 className="text-white font-mono font-bold text-lg tracking-widest">{currentTactic.name}</h2>
                  <div className="flex gap-1 mt-1">
                      {tactics.map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeTacticIndex ? 'bg-[#39FF14] w-3' : 'bg-gray-700'}`}
                          />
                      ))}
                  </div>
              </div>

              <button 
                onClick={addNewTactic}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#161B22] text-[#39FF14] border border-[#39FF14]/30 hover:bg-[#39FF14]/10 transition-all"
              >
                  <Plus size={20} />
              </button>
          </div>

          {/* Carousel View */}
          <div className="relative w-full aspect-[4/3] px-4">
              
              {/* Navigation Arrows (Absolute) */}
              <button 
                onClick={() => setActiveTacticIndex(Math.max(0, activeTacticIndex - 1))}
                disabled={activeTacticIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white disabled:opacity-0 transition-opacity"
              >
                  <ChevronLeft size={32} />
              </button>
              <button 
                onClick={() => setActiveTacticIndex(Math.min(tactics.length - 1, activeTacticIndex + 1))}
                disabled={activeTacticIndex === tactics.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white disabled:opacity-0 transition-opacity"
              >
                  <ChevronRight size={32} />
              </button>

              {/* The Realistic Pitch */}
              <div 
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className={`relative w-full h-full bg-[#0B2815] rounded-[24px] border-4 border-[#161B22] shadow-2xl overflow-hidden touch-none ${tool === 'draw' ? 'cursor-crosshair' : tool === 'opponent' ? 'cursor-copy' : 'cursor-default'}`}
                style={{
                    boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)'
                }}
              >
                  {/* Floodlight Effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.3)_100%)] pointer-events-none"></div>
                  
                  {/* Grass Texture */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>
                  
                  {/* Heatmap Layer */}
                  {showHeatmap && selectedPlayer && HEATMAP_DATA[selectedPlayer.role] && (
                      <div className="absolute inset-0 pointer-events-none opacity-40">
                          {HEATMAP_DATA[selectedPlayer.role].map((point, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute bg-orange-500 rounded-full blur-[30px]"
                                style={{
                                    left: `${point.x}%`,
                                    top: `${point.y}%`,
                                    width: `${point.r * 2}%`,
                                    height: `${point.r * 2}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                              />
                          ))}
                      </div>
                  )}

                  {/* Simulation Layer (Control Zones) */}
                  {isSimulating && (
                      <div className="absolute inset-0 pointer-events-none">
                          {currentTactic.players.map(p => (
                              <motion.div 
                                key={`sim-${p.id}`}
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.1, 0.2, 0.1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`absolute rounded-full blur-2xl ${p.isOpponent ? 'bg-red-500' : 'bg-[#39FF14]'}`}
                                style={{
                                    left: `${p.x}%`,
                                    top: `${p.y}%`,
                                    width: '100px',
                                    height: '100px',
                                    transform: 'translate(-50%, -50%)'
                                }}
                              />
                          ))}
                      </div>
                  )}

                  {/* Pitch Markings */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-1/5 border-b-2 border-l-2 border-r-2 border-white/20 rounded-b-xl"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-1/5 border-t-2 border-l-2 border-r-2 border-white/20 rounded-t-xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/20"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/20"></div>

                  {/* Drawings Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                      <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#39FF14" />
                          </marker>
                      </defs>
                      {currentTactic.drawings.map(line => (
                          <polyline 
                            key={line.id}
                            points={line.points.map(p => `${(p.x * canvasRef.current!.clientWidth) / 100},${(p.y * canvasRef.current!.clientHeight) / 100}`).join(' ')}
                            fill="none"
                            stroke={line.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            markerEnd="url(#arrowhead)"
                            opacity="0.8"
                          />
                      ))}
                      {currentLine && (
                          <polyline 
                            points={currentLine.points.map(p => `${(p.x * canvasRef.current!.clientWidth) / 100},${(p.y * canvasRef.current!.clientHeight) / 100}`).join(' ')}
                            fill="none"
                            stroke={currentLine.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            markerEnd="url(#arrowhead)"
                            opacity="0.6"
                          />
                      )}
                  </svg>

                  {/* Players */}
                  {currentTactic.players.map((p) => (
                      <motion.div
                        key={p.id}
                        layoutId={p.id}
                        onPointerDown={(e) => handleDragStart(p.id, e)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-20 ${tool === 'move' ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-auto'}`}
                        style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: draggedPlayer === p.id ? 50 : 20 }}
                      >
                          <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all ${p.isOpponent ? 'bg-red-900/80 border-red-500 text-white' : 'bg-[#0A0E14] border-white text-white'} ${draggedPlayer === p.id ? 'scale-125 border-[#39FF14] text-[#39FF14]' : ''} ${selectedPlayerId === p.id ? 'ring-4 ring-[#39FF14]/30' : ''}`}>
                              <span className="text-[10px] font-black">{p.name.charAt(0)}</span>
                          </div>
                          {/* Name Tag */}
                          <span className={`mt-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-sm pointer-events-none ${p.isOpponent ? 'bg-red-950/60 text-red-200' : 'bg-black/60 text-white'}`}>
                              {p.name}
                          </span>
                          {/* Role Badge */}
                          {p.role && !p.isOpponent && (
                              <div className="absolute -top-2 -right-2 bg-[#39FF14] text-black text-[7px] font-black px-1 rounded border border-black">
                                  {p.role}
                              </div>
                          )}
                      </motion.div>
                  ))}
              </div>
          </div>
      </div>

      {/* 4. TACTICAL INTELLIGENCE PANEL */}
      <div className="px-6 mb-6">
          <div className="bg-[#161B22] rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Brain size={80} className="text-[#39FF14]" />
              </div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14]">
                      <Brain size={20} />
                  </div>
                  <div>
                      <h3 className="text-sm font-black text-white tracking-widest uppercase">Taktik Zeka Analizi</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">{currentFormation} Dizilişi İçin Öneriler</p>
                  </div>
              </div>

              <div className="space-y-6 relative z-10">
                  {/* Defensive Advice */}
                  <div>
                      <div className="flex items-center gap-2 mb-3">
                          <Shield size={12} className="text-blue-400" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Savunma Stratejisi</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {AI_ADVICE[currentFormation].defensive.map(advice => (
                              <button 
                                key={advice}
                                onClick={() => toggleAdvice(advice)}
                                className={`px-3 py-2 rounded-xl text-[9px] font-bold transition-all border ${currentTactic.activeAdvice.includes(advice) ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                              >
                                  {advice}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Offensive Advice */}
                  <div>
                      <div className="flex items-center gap-2 mb-3">
                          <Target size={12} className="text-red-400" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hücum Varyasyonları</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {AI_ADVICE[currentFormation].offensive.map(advice => (
                              <button 
                                key={advice}
                                onClick={() => toggleAdvice(advice)}
                                className={`px-3 py-2 rounded-xl text-[9px] font-bold transition-all border ${currentTactic.activeAdvice.includes(advice) ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                              >
                                  {advice}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* General Game Plan */}
                  <div>
                      <div className="flex items-center gap-2 mb-3">
                          <TrendingUp size={12} className="text-[#39FF14]" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Oyun Düzeni</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {AI_ADVICE[currentFormation].general.map(advice => (
                              <button 
                                key={advice}
                                onClick={() => toggleAdvice(advice)}
                                className={`px-3 py-2 rounded-xl text-[9px] font-bold transition-all border ${currentTactic.activeAdvice.includes(advice) ? 'bg-[#39FF14]/20 border-[#39FF14]/50 text-[#39FF14]' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                              >
                                  {advice}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 5. PLAYER DETAILS / INSTRUCTIONS */}
      <AnimatePresence>
          {selectedPlayer && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="px-6 mb-6"
              >
                  <div className="bg-[#161B22] rounded-2xl p-4 border border-white/10 shadow-xl">
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${selectedPlayer.isOpponent ? 'bg-red-500 text-white' : 'bg-[#39FF14] text-black'}`}>
                                  {selectedPlayer.name.charAt(0)}
                              </div>
                              <div>
                                  <h3 className="text-white font-bold text-sm">{selectedPlayer.name}</h3>
                                  <p className="text-[10px] text-gray-500 uppercase font-bold">{selectedPlayer.isOpponent ? 'RAKİP OYUNCU' : `${selectedPlayer.role} • TAKIM ARKADAŞI`}</p>
                              </div>
                          </div>
                          {selectedPlayer.isOpponent && (
                              <button 
                                onClick={() => {
                                    const updatedTactics = [...tactics];
                                    updatedTactics[activeTacticIndex].players = updatedTactics[activeTacticIndex].players.filter(p => p.id !== selectedPlayerId);
                                    setTactics(updatedTactics);
                                    setSelectedPlayerId(null);
                                }}
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg"
                              >
                                  <Trash2 size={16} />
                              </button>
                          )}
                      </div>
                      
                      {!selectedPlayer.isOpponent && (
                          <div className="space-y-3">
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                                  <Zap size={12} className="text-[#39FF14]" /> ÖZEL TALİMAT
                              </div>
                              <div className="flex gap-2">
                                  {['HÜCUMA ÇIK', 'GERİDE KAL', 'SERBEST', 'MARKAJ'].map(inst => (
                                      <button 
                                        key={inst}
                                        onClick={() => updatePlayerInstruction(selectedPlayer.id, inst)}
                                        className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${selectedPlayer.instruction === inst ? 'bg-[#39FF14] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                      >
                                          {inst}
                                      </button>
                                  ))}
                              </div>
                              {selectedPlayer.instruction && (
                                  <div className="bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg p-2 flex items-start gap-2">
                                      <Info size={12} className="text-[#39FF14] mt-0.5" />
                                      <p className="text-[10px] text-[#39FF14] font-medium italic">"{selectedPlayer.instruction}" talimatı verildi. Oyuncu bu plana göre hareket edecek.</p>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* 6. ACTION BUTTONS */}
      <div className="px-6 pb-12 flex gap-4">
          <button 
            onClick={() => onBack()}
            className="flex-1 h-16 bg-[#161B22] border border-white/10 rounded-[24px] flex items-center justify-center gap-3 text-white font-black text-xs tracking-widest hover:bg-white/5 transition-all"
          >
              <Send size={18} className="text-blue-400" />
              PLANINI GÖNDER
          </button>
          <button 
            onClick={() => {
                if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
                onBack();
            }}
            className="flex-1 h-16 bg-[#39FF14] rounded-[24px] flex items-center justify-center gap-3 text-black font-black text-xs tracking-widest shadow-[0_10px_30px_rgba(57,255,20,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
              <SaveAll size={18} />
              TAKTIĞI KAYDET
          </button>
      </div>
    </div>
  );
};

export default Studio;
