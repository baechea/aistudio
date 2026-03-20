
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Layers, 
  PlayCircle, 
  BookX, 
  Menu,
  X,
  Trophy,
  AlertCircle,
  FileText,
  Trash2,
  Search,
  Users,
  Sparkles,
  Bot,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Upload,
  Crown,
  MessageSquare,
  PenSquare,
  Globe,
  WifiOff,
  Wifi,
  RefreshCw,
  Zap,
  Activity,
  Megaphone,
  BellRing,
  Check,
  Lock,
  ShieldCheck,
  LogOut,
  CalendarDays,
  Palette,
  Share2
} from 'lucide-react';
import { 
  Question, 
  Category, 
  ViewState, 
  ToastMessage,
  Difficulty,
  HallOfFameEntry,
  Post,
  Notice,
  CalendarEvent
} from './types';
import { storageService } from './services/storageService';
import TestRunner from './components/TestRunner';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Legend, 
  LabelList 
} from 'recharts';

// --- Styles for Animations ---
const GlobalStyles = () => (
  <style>{`
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee {
      display: inline-block;
      white-space: nowrap;
      animation: marquee 60s linear infinite;
    }
    .neon-text-blue {
      color: #fff;
      text-shadow:
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px #0073e6,
        0 0 40px #0073e6,
        0 0 80px #0073e6;
    }
    .neon-text-gold {
      color: #fff;
      text-shadow:
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px #FFD700,
        0 0 40px #FFD700,
        0 0 80px #FFD700;
    }
    .neon-text-pink {
      color: #fff;
      text-shadow:
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px #ff00de,
        0 0 40px #ff00de,
        0 0 80px #ff00de;
    }
    .neon-box {
      box-shadow: 
        0 0 5px #fff,
        0 0 10px #fff, 
        0 0 20px #0073e6, 
        0 0 40px #0073e6;
    }
    @keyframes slide-down {
      0% { transform: translateY(-150%); opacity: 0; }
      10% { transform: translateY(20px); opacity: 1; }
      90% { transform: translateY(20px); opacity: 1; }
      100% { transform: translateY(-150%); opacity: 0; }
    }
    .animate-slide-down {
      animation: slide-down 6s ease-in-out forwards;
    }
    .neon-border-flash {
      animation: neon-flash 1.5s infinite alternate;
    }
    @keyframes neon-flash {
      from { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073; }
      to { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00de, 0 0 20px #ff00de; }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }

    /* Fire Rotating Border Effect */
    .neon-border-card {
      position: relative;
      overflow: hidden;
      border-radius: 1rem; /* matches rounded-2xl */
      background: transparent; /* Ensure pseudo-elements are visible */
      z-index: 0;
      isolation: isolate; /* Create stacking context */
    }
    
    .neon-border-card::before {
      content: '';
      position: absolute;
      width: 250%; /* Large enough to cover corners during rotation */
      height: 250%;
      top: 50%;
      left: 50%;
      /* Fire Gradient: Dark Red -> Red -> Orange -> Yellow -> Transparent */
      background: conic-gradient(
        transparent 0deg, 
        #7f1d1d 40deg,  /* Dark Red (Ember) */
        #ff0000 100deg, /* Red (Fire Body) */
        #ff8c00 140deg, /* Dark Orange */
        #ffff00 170deg, /* Yellow (Hot Core) */
        transparent 220deg
      );
      /* Use transform in keyframe only to avoid double translation issues */
      animation: border-rotate 3s linear infinite;
      z-index: -2;
    }

    .neon-border-card::after {
      content: '';
      position: absolute;
      inset: 3px; /* Border width */
      background: white;
      border-radius: 0.9rem; /* Slightly less than container */
      z-index: -1;
    }

    @keyframes border-rotate {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `}</style>
);

// --- Global Celebration Notification (Neon Style) ---
const GlobalCelebrationPopup = ({ name }: { name: string }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-[9999] flex justify-center pointer-events-none">
      <div className="animate-slide-down mt-4 bg-black/90 backdrop-blur-md border-2 border-fuchsia-500 neon-border-flash rounded-full px-8 py-4 flex items-center gap-4 shadow-2xl transform">
        <div className="bg-yellow-400 rounded-full p-2 animate-bounce">
          <Crown size={32} className="text-white fill-yellow-600" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg drop-shadow-md">
            🎉 <span className="text-yellow-300 text-xl font-black">{name}</span>님이
          </p>
          <p className="text-fuchsia-300 font-bold text-sm tracking-wider">
            자동차정비산업기사 모의고사 만점 달성!
          </p>
        </div>
        <div className="animate-pulse">
          <Zap size={24} className="text-yellow-400 fill-yellow-400" />
        </div>
      </div>
    </div>
  );
};

// --- Startup Notice Modal ---
const StartupNoticeModal = ({ notice, onClose }: { notice: Notice, onClose: () => void }) => {
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  const handleClose = () => {
    if (doNotShowToday) {
       const today = new Date().toDateString();
       localStorage.setItem('hide_notice_date', today);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
       <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in relative border border-slate-200">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-lg text-white">
                <Megaphone size={24} className="animate-tada" />
             </div>
             <h2 className="text-white text-xl font-bold tracking-tight">공지사항</h2>
             <button onClick={handleClose} className="ml-auto text-white/70 hover:text-white transition-colors">
               <X size={24} />
             </button>
          </div>
          <div className="p-8">
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-2">
                <div className="text-slate-800 font-medium leading-relaxed whitespace-pre-wrap text-base">
                    {notice.content}
                </div>
             </div>
             <p className="text-slate-400 text-xs mt-3 text-right font-medium">
                등록일: {new Date(notice.createdAt).toLocaleDateString()}
             </p>
          </div>
          <div className="bg-slate-50 p-4 flex flex-col gap-3 border-t border-slate-100">
             <label className="flex items-center gap-2 text-slate-500 text-sm cursor-pointer justify-center hover:text-indigo-600 transition-colors py-2">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${doNotShowToday ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'}`}>
                    {doNotShowToday && <Check size={14} strokeWidth={3} />}
                </div>
                <input 
                  type="checkbox" 
                  checked={doNotShowToday} 
                  onChange={(e) => setDoNotShowToday(e.target.checked)}
                  className="hidden"
                />
                오늘 하루 보지 않기
             </label>
             <button 
                onClick={handleClose}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
             >
                확인했습니다
             </button>
          </div>
       </div>
    </div>
  );
};

// --- Color Configuration ---
const EVENT_COLORS: Record<string, { bg: string, text: string, border: string, label: string }> = {
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', label: '보라 (기본)' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    label: '빨강 (중요/시험)' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   label: '파랑 (일반)' },
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  label: '초록 (접수)' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', label: '노랑 (공지)' },
};

// --- Calendar Widget Component ---
const CalendarWidget = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(today.getDate());
  };

  // Fetch and Subscribe to Calendar Events
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('calendar_events').select('*');
      if (data && !error) {
        setEvents(data);
      }
    };

    fetchEvents();

    const channel = supabase
      .channel('public:calendar_events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, (payload) => {
        fetchEvents(); // Simple re-fetch for sync
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getEventForDate = (day: number) => {
    // Format current loop day to YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(e => e.date === dateStr);
  };

  const getEventStyle = (color?: string) => {
    const theme = EVENT_COLORS[color || 'purple'] || EVENT_COLORS['purple'];
    return `${theme.bg} ${theme.text} font-bold border ${theme.border}`;
  };

  const days = [];
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-7 w-7" />);
  }

  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = d === selectedDay && year === today.getFullYear() && month === today.getMonth();
    const isToday = d === today.getDate() && year === today.getFullYear() && month === today.getMonth();
    const event = getEventForDate(d);
    
    // Event Style (Dynamic based on event color)
    const hasEventStyle = event ? getEventStyle(event.color) : '';

    days.push(
      <button 
        key={d} 
        onClick={() => setSelectedDay(d)}
        className={`h-7 w-7 flex items-center justify-center text-xs rounded-full transition-all 
          ${isSelected 
            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-200 scale-110 z-10' 
            : isToday 
              ? 'bg-blue-50 text-blue-600 font-semibold' 
              : hasEventStyle ? hasEventStyle : 'text-slate-600 hover:bg-slate-100'}`}
        title={event?.title}
      >
        {d}
      </button>
    );
  }

  const prevDay = () => {
    const newDate = new Date(year, month, selectedDay - 1);
    setCurrentDate(newDate);
    setSelectedDay(newDate.getDate());
  };

  const nextDay = () => {
    const newDate = new Date(year, month, selectedDay + 1);
    setCurrentDate(newDate);
    setSelectedDay(newDate.getDate());
  };

  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm select-none">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={resetToToday}>
            <Calendar size={14} />
          </div>
          <span className="text-sm font-bold text-slate-800">
            {year}년 {month + 1}월
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={prevMonth}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d, i) => (
          <div key={d} className={`text-center text-[10px] font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 place-items-center">
        {days}
      </div>

      {/* Selected Day Events Display */}
      {selectedDay && (
        <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={prevDay}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {year}.{month + 1}.{selectedDay} 일정
              </span>
              <button 
                onClick={nextDay}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            {getEventForDate(selectedDay) && (
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${getEventStyle(getEventForDate(selectedDay)?.color)}`}>
                {getEventForDate(selectedDay)?.type === 'exam' ? '시험' : '일정'}
              </div>
            )}
          </div>
          {getEventForDate(selectedDay) ? (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-sm font-bold text-slate-800">{getEventForDate(selectedDay)?.title}</p>
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 italic">등록된 일정이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

// --- Calendar Legend Component ---
const CalendarLegend = () => {
  return (
    <div className="mt-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden text-[10px]">
      {/* 상단 레이아웃 (필답/실기) */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-50 font-medium text-slate-500">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><span>필답시험</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div><span>실기시험</span></div>
      </div>

      {/* 하단: 흐르면서 깜빡이는 일정 */}
      <div className="bg-red-50/30 py-1.5 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee animate-blink inline-block font-bold text-red-500">
          <span className="mx-4">외부평가일정: 26.06.22 ~ 06.26</span>
        </div>
      </div>

      {/* 스타일 정의 */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-blink {
          animation: blink 1s step-end infinite; /* 1초 간격으로 깜빡임 */
        }
      `}</style>
    </div>
  );
}

// --- Celebration Component ---
const CelebrationOverlay = ({ onClose, isMockExam = false, onRegisterHallOfFame }: { onClose: () => void, isMockExam: boolean, onRegisterHallOfFame?: (name: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Audio Effect (Fanfare + Voice)
  useEffect(() => {
    // 1. Web Audio API Fanfare (빠밤~ 효과음)
    const playFanfare = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const now = ctx.currentTime;
            
            // Function to play a single note
            const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'triangle') => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = type;
                osc.frequency.setValueAtTime(freq, now + startTime);
                
                // Envelope for brass-like sound (Attack-Sustain-Release)
                gain.gain.setValueAtTime(0, now + startTime);
                gain.gain.linearRampToValueAtTime(0.3, now + startTime + 0.05); 
                gain.gain.setValueAtTime(0.3, now + startTime + duration - 0.1);
                gain.gain.linearRampToValueAtTime(0, now + startTime + duration);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(now + startTime);
                osc.stop(now + startTime + duration);
            };

            // Fanfare Melody: G4 -> C5 -> E5 -> G5 (C Major Arpeggio)
            // "빠-바-바-밤~"
            playNote(392.00, 0, 0.15);    // G4
            playNote(523.25, 0.15, 0.15); // C5
            playNote(659.25, 0.30, 0.15); // E5
            playNote(783.99, 0.45, 0.8);  // G5 (High)
            
            // Harmony for the last note
            playNote(523.25, 0.45, 0.8);  // C5
            
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    // 2. Speech Synthesis (축하 음성)
    const playVoice = () => {
      if (!window.speechSynthesis) return;

      // Cancel any existing speech
      window.speechSynthesis.cancel();

      const messages = [
        "와우! 축하합니다! 완벽한 만점입니다!",
        "고생하셨습니다! 100점입니다. 정말 훌륭한 실력이네요!",
        "믿을 수 없군요! 모든 문제를 맞히셨습니다!"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      const utterance = new SpeechSynthesisUtterance(randomMessage);
      utterance.lang = 'ko-KR';
      utterance.pitch = 1.1; // Slightly higher pitch for excitement
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
    };

    // Execute Sequence
    playFanfare();
    const timer = setTimeout(playVoice, 1000); // Wait for fanfare to finish

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Visual Effect (Fireworks)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    
    // Fireworks configuration
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF69B4', '#00FFFF', '#FFFFFF'];

    const createFirework = (x: number, y: number) => {
        const particleCount = 150;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 6 + 2;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                alpha: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                drag: 0.96, // Air resistance
                gravity: 0.05,
                decay: Math.random() * 0.015 + 0.005,
                size: Math.random() * 3 + 1
            });
        }
    };

    // Auto-launch fireworks
    const launchInterval = setInterval(() => {
        const x = Math.random() * canvas.width;
        // Launch mainly in the upper half
        const y = Math.random() * (canvas.height * 0.6); 
        createFirework(x, y);
    }, 600);

    // Initial bursts
    createFirework(canvas.width / 2, canvas.height / 3);
    setTimeout(() => createFirework(canvas.width / 3, canvas.height / 4), 300);
    setTimeout(() => createFirework(canvas.width * 2 / 3, canvas.height / 4), 600);

    let animationId: number;

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Trail effect: draw semi-transparent black rectangle instead of clearing
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= p.drag;
          p.vy *= p.drag;
          p.vy += p.gravity;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
              particles.splice(i, 1);
              continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add sparkle
          if (Math.random() > 0.9) {
             ctx.fillStyle = '#FFFFFF';
             ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
          }
          ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(launchInterval);
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRegister = () => {
    if (userName.trim() && onRegisterHallOfFame) {
      onRegisterHallOfFame(userName.trim());
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      <div className="relative z-10 p-8 md:p-12 text-center transform transition-all animate-bounce-in max-w-2xl w-full mx-4">
        {/* Glowing Badge Effect */}
        <div className="mb-10 relative inline-block">
            <div className="absolute inset-0 blur-3xl bg-yellow-500/40 rounded-full animate-pulse"></div>
            <div className="text-8xl md:text-9xl relative drop-shadow-2xl">🏆</div>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 mb-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tight">
          PERFECT!
        </h2>
        
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl mx-auto">
            <p className="text-3xl md:text-4xl text-white font-bold mb-4 drop-shadow-md">만점입니다! 💯</p>
            <p className="text-indigo-100 text-lg md:text-xl mb-8 leading-relaxed font-medium">
                고생 하셨습니다.<br/>모든 문제를 완벽하게 풀어내셨군요!
            </p>

            {isMockExam && !isSubmitted ? (
               <div className="bg-white/90 p-6 rounded-2xl mb-6 shadow-inner">
                 <h3 className="text-slate-800 font-bold text-lg mb-3 flex items-center justify-center gap-2">
                   <Crown className="text-yellow-500" size={24} fill="currentColor" />
                   명예의 전당 등록
                 </h3>
                 <p className="text-slate-600 text-sm mb-4">실전 모의고사 만점을 축하합니다!<br/>명예의 전당에 남길 이름을 입력해주세요.</p>
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={userName}
                     onChange={(e) => setUserName(e.target.value.slice(0, 4))}
                     placeholder="이름 (숫자포함 4글자)"
                     className="flex-1 p-3 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none text-slate-800 font-bold text-center"
                     maxLength={4}
                   />
                   <button 
                     onClick={handleRegister}
                     disabled={!userName.trim()}
                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-bold disabled:opacity-50 transition-colors"
                   >
                     등록
                   </button>
                 </div>
               </div>
            ) : isMockExam && isSubmitted ? (
                <div className="bg-green-100/90 p-4 rounded-2xl mb-6 text-green-800 font-bold border border-green-200">
                  명예의 전당에 등록되었습니다! 🎉
                </div>
            ) : null}

            <button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-600 hover:from-yellow-300 hover:to-orange-500 text-white font-black py-4 px-10 rounded-2xl shadow-lg shadow-orange-500/40 transform transition hover:scale-[1.02] active:scale-95 text-xl flex items-center justify-center gap-2"
            >
              <Sparkles size={24} />
              결과 확인하기
            </button>
        </div>
      </div>
    </div>
  );
};

// --- Extracted Components ---

// Admin Login Modal Component
const AdminLoginModal = ({ onClose, onLogin }: { onClose: () => void, onLogin: (pin: string) => void }) => {
  const [pin, setPin] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(pin);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-bounce-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">관리자 모드</h2>
          <p className="text-slate-500 text-sm mt-1">접근을 위해 비밀번호를 입력하세요.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-4 text-center text-2xl font-bold tracking-widest border border-slate-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none mb-4"
            placeholder="PIN"
            maxLength={4}
            autoFocus
          />
          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

// Admin View Component
const AdminView = ({ 
  onSimulatePerfectScore,
  onLogout,
  addToast,
  onSyncQuestions
}: { 
  onSimulatePerfectScore: (name: string) => void,
  onLogout: () => void,
  addToast: (msg: string, type: 'success' | 'error') => void,
  onSyncQuestions: () => Promise<void>
}) => {
  const [testName, setTestName] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await onSyncQuestions();
      addToast('데이터베이스 동기화가 완료되었습니다.', 'success');
    } catch (error) {
      addToast('동기화 실패', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Calendar Event State
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventColor, setEventColor] = useState('purple');
  const [recentEvents, setRecentEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetchRecentEvents();
  }, []);

  const fetchRecentEvents = async () => {
    const { data } = await supabase
      .from('calendar_events')
      .select('*')
      .order('date', { ascending: true })
      .limit(5);
    if(data) setRecentEvents(data);
  };

  const handleSimulate = () => {
    if (testName.trim().length === 0) return;
    onSimulatePerfectScore(testName);
    setTestName('');
  };

  const handleAddEvent = async () => {
    if (!eventDate || !eventTitle.trim()) {
      addToast('날짜와 일정을 입력해주세요.', 'error');
      return;
    }

    const { error } = await supabase.from('calendar_events').insert([
      { 
        date: eventDate, 
        title: eventTitle, 
        type: 'event',
        color: eventColor 
      }
    ]);

    if (error) {
      addToast('일정 등록 실패', 'error');
    } else {
      addToast('일정이 등록되었습니다. (캘린더 확인)', 'success');
      setEventTitle('');
      fetchRecentEvents();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if(!window.confirm('삭제하시겠습니까?')) return;
    const { error } = await supabase.from('calendar_events').delete().eq('id', id);
    if (!error) {
        addToast('일정이 삭제되었습니다.', 'success');
        fetchRecentEvents();
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-red-600" /> 관리자 패널
        </h1>
        <button 
          onClick={onLogout}
          className="text-slate-500 hover:text-red-600 flex items-center gap-2 font-medium transition-colors"
        >
          <LogOut size={18} /> 로그아웃
        </button>
      </div>

      {/* Calendar Event Manager */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <CalendarDays size={20} className="text-purple-600"/> 캘린더 일정 관리
        </h2>
        
        <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
                <input 
                    type="date" 
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="p-3 border border-slate-300 rounded-xl focus:border-purple-500 outline-none font-medium"
                />
                <select
                    value={eventColor}
                    onChange={(e) => setEventColor(e.target.value)}
                    className="p-3 border border-slate-300 rounded-xl focus:border-purple-500 outline-none font-medium bg-white"
                >
                    {Object.entries(EVENT_COLORS).map(([key, value]) => (
                        <option key={key} value={key} className={value.text}>
                            {value.label}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="flex gap-3">
                <input 
                    type="text" 
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="일정 내용 (예: 필기시험 접수)"
                    className="flex-1 p-3 border border-slate-300 rounded-xl focus:border-purple-500 outline-none"
                />
                <button 
                    onClick={handleAddEvent}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-xl font-bold transition-colors shadow-md shadow-purple-200"
                >
                    등록
                </button>
            </div>
        </div>
        
        <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 mb-2">최근 등록된 일정</p>
            {recentEvents.length === 0 ? (
                <p className="text-sm text-slate-400">등록된 일정이 없습니다.</p>
            ) : (
                recentEvents.map(evt => {
                    const theme = EVENT_COLORS[evt.color || 'purple'] || EVENT_COLORS['purple'];
                    return (
                        <div key={evt.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex gap-3 items-center">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${theme.bg} ${theme.text} ${theme.border} border`}>
                                    {evt.date}
                                </span>
                                <span className="text-sm font-medium text-slate-700">{evt.title}</span>
                            </div>
                            <button onClick={() => handleDeleteEvent(evt.id)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* Hall of Fame Simulation */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">명예의 전당 테스트 (만점 시뮬레이션)</h2>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-sm text-yellow-800">
          <p className="font-bold flex items-center gap-2 mb-1"><AlertCircle size={16}/> 주의사항</p>
          <p>이 기능은 실제 시험을 치르지 않고 강제로 <strong>만점 처리</strong>를 시뮬레이션합니다. 버튼을 누르면 즉시 축하 화면이 뜨고 명예의 전당에 이름이 등록됩니다.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">등록할 이름 (Test Name)</label>
            <input 
              type="text" 
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="예: 홍길동12"
              className="w-full p-3 border border-slate-300 rounded-xl focus:border-red-500 outline-none"
              maxLength={10}
            />
          </div>
          <button 
            onClick={handleSimulate}
            disabled={!testName.trim()}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Crown size={20} />
            만점 시뮬레이션 시작
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <RefreshCw size={16} className="text-blue-500" />
            데이터베이스 동기화
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            코드의 초기 문제 데이터를 데이터베이스와 동기화합니다. (중복 방지 upsert)
          </p>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`w-full py-2 ${isSyncing ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2`}
          >
            {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {isSyncing ? '동기화 중...' : '지금 동기화'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TestView = ({
    questions,
    categories,
    isTestRunning,
    setIsTestRunning,
    activeTestQuestions,
    setActiveTestQuestions,
    isMockMode,
    setIsMockMode,
    testResult,
    setTestResult,
    showCelebration,
    setShowCelebration,
    registerHallOfFame,
    loadData,
    addToast
}: {
    questions: Question[];
    categories: Category[];
    isTestRunning: boolean;
    setIsTestRunning: (v: boolean) => void;
    activeTestQuestions: Question[];
    setActiveTestQuestions: (q: Question[]) => void;
    isMockMode: boolean;
    setIsMockMode: (v: boolean) => void;
    testResult: any;
    setTestResult: (v: any) => void;
    showCelebration: boolean;
    setShowCelebration: (v: boolean) => void;
    registerHallOfFame: (name: string) => void;
    loadData: () => void;
    addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}) => {
    const [config, setConfig] = useState({ category: '전체', count: 10 });

    const startTest = () => {
        let filtered = questions;
        if (config.category !== '전체') filtered = filtered.filter(q => q.category === config.category);
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, config.count);
        
        if (selected.length === 0) { addToast('선택한 조건에 맞는 문제가 없습니다.', 'error'); return; }
        setActiveTestQuestions(selected); 
        setIsTestRunning(true); 
        setIsMockMode(false); 
        setTestResult(null); 
        setShowCelebration(false);
    };

    const startMockExam = () => {
        const objectiveQuestions = questions.filter(q => q.category === '객관식');
        const subjectiveQuestions = questions.filter(q => q.category === '주관식');
        if (objectiveQuestions.length < 30) { addToast(`객관식 문제가 부족합니다. (현재: ${objectiveQuestions.length} / 필요: 30)`, 'error'); return; }
        if (subjectiveQuestions.length < 10) { addToast(`주관식 문제가 부족합니다. (현재: ${subjectiveQuestions.length} / 필요: 10)`, 'error'); return; }
        const selectedObjective = [...objectiveQuestions].sort(() => 0.5 - Math.random()).slice(0, 30);
        const selectedSubjective = [...subjectiveQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
        const combined = [...selectedObjective, ...selectedSubjective];
        setActiveTestQuestions(combined); 
        setIsTestRunning(true); 
        setIsMockMode(true); 
        setTestResult(null); 
        setShowCelebration(false);
    };

    if (isTestRunning) {
       return (
         <div className="animate-fade-in">
           <TestRunner 
             questions={activeTestQuestions}
             isMockExam={isMockMode}
             onComplete={async (correct, total, score, maxScore) => {
               setIsTestRunning(false);
               setTestResult({ correct, total, score, maxScore });
               await loadData(); 
               if (correct === total && total > 0) { setShowCelebration(true); }
             }}
           />
         </div>
       )
    }

    if (testResult) {
      // Calculate normalized score (out of 100)
      const normalizedScore = Math.round((testResult.score / testResult.maxScore) * 100);

      return (
        <div className="relative">
          {showCelebration && (
            <CelebrationOverlay 
              onClose={() => setShowCelebration(false)} 
              isMockExam={isMockMode}
              onRegisterHallOfFame={registerHallOfFame}
            />
          )}
          <div className="max-w-md mx-auto text-center pt-12 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">테스트 완료!</h2>
              <div className="flex flex-col gap-4 mb-6">
                  <div className="flex justify-center gap-8">
                      <div className="text-center">
                          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">총 점수</p>
                          <div className="text-4xl font-bold text-blue-600">{testResult.score} <span className="text-lg text-slate-400">/ {testResult.maxScore}</span></div>
                      </div>
                      <div className="text-center">
                          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">정답 수</p>
                          <div className="text-4xl font-bold text-slate-700">{testResult.correct} <span className="text-lg text-slate-400">/ {testResult.total}</span></div>
                      </div>
                  </div>
                  {/* Converted Score Display */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-slate-500 text-xs font-bold mb-1">100점 환산 점수</p>
                      <p className="text-2xl font-bold text-indigo-600">{normalizedScore} 점</p>
                  </div>
              </div>
              <button onClick={() => setTestResult(null)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all">처음으로 돌아가기</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto animate-fade-in space-y-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">문제 풀기 설정</h1>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500"><FileText size={120} /></div>
            <h2 className="text-2xl font-bold mb-2">실전 모의고사</h2>
            <p className="text-indigo-100 mb-6 max-w-sm">실제 시험과 동일하게 객관식 30문제, 주관식 10문제를 랜덤으로 추출하여 100점 만점으로 평가합니다.</p>
            <button onClick={startMockExam} className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2"><PlayCircle size={20} />모의고사 시작</button>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
           <h3 className="text-lg font-bold text-slate-700 border-b pb-2">사용자 설정 테스트</h3>
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-3">유형 선택</label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               <button onClick={() => setConfig({...config, category: '전체'})} className={`p-3 rounded-xl text-sm font-medium border transition-all ${config.category === '전체' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>모든 유형</button>
               {categories.map(cat => <button key={cat.id} onClick={() => setConfig({...config, category: cat.name})} className={`p-3 rounded-xl text-sm font-medium border transition-all ${config.category === cat.name ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>{cat.name}</button>)}
             </div>
           </div>
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-3">문제 개수</label>
             <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
               <input type="range" min="5" max="50" step="5" value={config.count} onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
               <span className="text-lg font-bold text-blue-600 w-12 text-center">{config.count}</span>
             </div>
           </div>
           <button onClick={startTest} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"><PlayCircle size={24} />선택 조건으로 시작</button>
        </div>
      </div>
    );
};

const DashboardView = ({ questions, hallOfFame, visitorCount, todayVisitorCount, notices, showCelebration, setShowCelebration, isMockMode, registerHallOfFame, setIsMockMode, wrongNoteIds, latestPost, setView, addToast }: any) => {
    // Process data for Stacked Bar Chart: Category vs Difficulty
    const chartData = [
      { name: '객관식', easy: 0, medium: 0, hard: 0, total: 0 },
      { name: '주관식', easy: 0, medium: 0, hard: 0, total: 0 }
    ];

    questions.forEach((q: Question) => {
      const target = q.category === '객관식' ? chartData[0] : chartData[1];
      if (q.difficulty === Difficulty.EASY) target.easy++;
      else if (q.difficulty === Difficulty.MEDIUM) target.medium++;
      else if (q.difficulty === Difficulty.HARD) target.hard++;
      
      target.total++;
    });

    // Latest Hall of Fame Entry
    const latestChampion = hallOfFame.length > 0 ? hallOfFame[0] : null;

    // Check if the latest post is recent (e.g., within 1 hour)
    const isNewPost = latestPost && (Date.now() - latestPost.createdAt < 1000 * 60 * 60);

    return (
      <div className="space-y-6 animate-fade-in relative">
        {showCelebration && (
            <CelebrationOverlay 
              onClose={() => setShowCelebration(false)} 
              isMockExam={isMockMode} 
              onRegisterHallOfFame={registerHallOfFame}
            />
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4 md:gap-0">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-slate-800 break-keep leading-tight">자동차정비산업기사 모의고사</h1>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast('앱 주소가 복사되었습니다. 다른 사람에게 공유해보세요!', 'success');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-2 py-1 rounded-lg w-fit"
              >
                <Share2 size={12} />
                앱 공유하기
              </button>
            </div>
            <div className="flex flex-col items-end gap-1 w-full md:w-auto">
               {/* Updated Visitor Counter with Today's Count */}
               <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <Users size={18} className="text-slate-500" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                      {/* 총문제수 */}
                      <div className="flex flex-col items-start leading-none">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">총문제수</span>
                          <span className="text-lg font-bold text-slate-800">{questions.length.toLocaleString()}</span>
                      </div>

                      {/* Divider */}
                      <div className="w-px h-6 bg-slate-100"></div>

                      {/* 총방문횟수 */}
                      <div className="flex flex-col items-start leading-none">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">총방문횟수</span>
                          <span className="text-lg font-bold text-slate-800">{visitorCount.toLocaleString()}</span>
                      </div>
                      
                      {/* Divider */}
                      <div className="w-px h-6 bg-slate-100"></div>
                      
                      {/* Today */}
                      <div className="flex flex-col items-start leading-none">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Today</span>
                          <span className="text-lg font-bold text-blue-600">{todayVisitorCount.toLocaleString()}</span>
                      </div>
                  </div>
               </div>
            </div>
        </div>
        
        {/* Hall of Fame Section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl overflow-hidden relative border-2 border-yellow-500/30 flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-yellow-400 text-sm font-bold uppercase tracking-[0.3em] mb-4 relative z-10 flex items-center gap-2">
                <Crown size={16} fill="currentColor" />
                Hall of Fame
                <Crown size={16} fill="currentColor" />
            </h2>
            
            {latestChampion ? (
                <div className="text-center relative z-10 animate-fade-in-up">
                    <div className="text-lg text-slate-400 font-medium mb-2">{new Date(latestChampion.date).toLocaleDateString()} 만점 달성</div>
                    <div className="text-7xl md:text-9xl font-black neon-text-gold mb-4 tracking-tight drop-shadow-2xl">
                        {latestChampion.name}
                    </div>
                    <div className="inline-block bg-yellow-500/20 text-yellow-300 px-6 py-2 rounded-full font-bold border border-yellow-500/50 backdrop-blur-sm whitespace-nowrap">
                        자동차정비산업기사 모의고사
                    </div>
                </div>
            ) : (
                <div className="text-slate-500 text-center py-8 relative z-10">
                    <div className="text-6xl mb-4 opacity-30">👑</div>
                    <p className="text-xl font-bold text-slate-400">아직 등록된 만점자가 없습니다.</p>
                    <p className="text-sm mt-2 text-slate-600">실전 모의고사 100점에 도전하여 첫 번째 주인공이 되어보세요!</p>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mb-4">
               <Layers size={24} />
             </div>
             <div className="text-3xl font-bold text-slate-800">{questions.length}</div>
             <div className="text-sm text-slate-500">총 문제 수</div>
          </div>

          {/* Notice Card with Fire Effect */}
          <div className="neon-border-card group h-full shadow-lg">
             {/* Content */}
             <div className="relative p-6 flex flex-col items-start w-full h-full z-20">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <Megaphone size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">공지사항</h3>
                <div className="w-full">
                   {notices.length > 0 ? (
                       <div className="text-sm text-slate-600 font-medium animate-fade-in leading-relaxed">
                           {notices[0].content}
                           <div className="text-xs text-slate-400 mt-2 text-right">
                               {new Date(notices[0].createdAt).toLocaleDateString()}
                           </div>
                       </div>
                   ) : (
                       <p className="text-sm text-slate-400">등록된 공지가 없습니다.</p>
                   )}
                </div>
             </div>
          </div>

          {/* Community Notification Card (Replaces Wrong Note) */}
          <button 
            onClick={() => setView('COMMUNITY')}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:border-indigo-300 hover:shadow-md transition-all text-left group relative overflow-hidden"
          >
             <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg mb-4 relative group-hover:scale-110 transition-transform">
               <BellRing size={24} />
               {isNewPost && (
                 <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                 </span>
               )}
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">실시간 커뮤니티</h3>
             <div className="w-full">
               {latestPost ? (
                 <div className="animate-fade-in">
                   <div className="flex items-center gap-2 mb-1">
                     <span className="bg-indigo-50 text-indigo-600 text-[10px] px-1.5 py-0.5 rounded font-bold">New</span>
                     <p className="text-sm font-bold text-slate-700 line-clamp-1">{latestPost.title}</p>
                   </div>
                   <p className="text-xs text-slate-500 line-clamp-2 mb-2">{latestPost.content}</p>
                   <div className="text-xs text-slate-400 text-right">
                     {new Date(latestPost.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · {latestPost.author}
                   </div>
                 </div>
               ) : (
                 <p className="text-sm text-slate-400">아직 등록된 글이 없습니다.</p>
               )}
             </div>
          </button>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start">
             <div className="p-3 bg-green-100 text-green-600 rounded-lg mb-4">
               <Trophy size={24} />
             </div>
             <div className="text-xl font-bold text-slate-800 break-keep leading-tight mb-1">
                산업기사 자격증 취득 과정
             </div>
             <div className="text-lg text-slate-500">제작 : 배철호 </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h2 className="text-lg font-bold text-slate-800 mb-4">유형별 난이도 분포</h2>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                 <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                 />
                 <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                 
                 {/* Stacked Bars for Difficulty */}
                 <Bar dataKey="easy" name="난이도 하" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]}>
                    <LabelList dataKey="easy" position="center" fill="#14532d" fontSize={11} formatter={(v: number) => v > 0 ? v : ''} />
                 </Bar>
                 <Bar dataKey="medium" name="난이도 중" stackId="a" fill="#facc15" radius={[0, 0, 0, 0]}>
                    <LabelList dataKey="medium" position="center" fill="#713f12" fontSize={11} formatter={(v: number) => v > 0 ? v : ''} />
                 </Bar>
                 <Bar dataKey="hard" name="난이도 상" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="hard" position="center" fill="#ffffff" fontSize={11} fontWeight="bold" formatter={(v: number) => v > 0 ? v : ''} />
                 </Bar>
                 
                 {/* Invisible Line to show Total Count on Top */}
                 <Line type="monotone" dataKey="total" stroke="none" dot={false} activeDot={false} legendType="none">
                    <LabelList position="top" offset={10} fill="#64748b" fontSize={14} fontWeight="bold" formatter={(v: number) => `${v}문제`} />
                 </Line>
                 
               </ComposedChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    );
};

// ... ManageQuestionsView, CommunityView, WrongNotesView (remain mostly same) ...
// Ensure they handle their internal states correctly

const ManageQuestionsView = ({ questions, categories, loadData, addToast }: any) => {
    // ... existing implementation ...
    const [formData, setFormData] = useState({
      content: '',
      answer: '',
      image: '',
      explanation: '',
      category: '객관식',
      difficulty: Difficulty.MEDIUM,
      options: ['', '', '', ''] 
    });
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('전체');
    const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      let finalAnswer = formData.answer;
      if (formData.category === '객관식') {
        if (formData.options.some(opt => !opt.trim())) { addToast('객관식 보기를 모두 입력해주세요.', 'error'); return; }
        if (selectedOptionIndex === null) { addToast('정답이 되는 보기를 선택(체크)해주세요.', 'error'); return; }
        finalAnswer = formData.options[selectedOptionIndex];
      } else {
        if (!formData.answer.trim()) { addToast('주관식 정답을 입력해주세요.', 'error'); return; }
      }
      if (!formData.content.trim()) { addToast('문제 지문을 입력해주세요.', 'error'); return; }

      const newQuestion: Question = {
        id: Date.now().toString(),
        content: formData.content,
        image: formData.image,
        answer: finalAnswer,
        explanation: formData.explanation,
        category: formData.category,
        difficulty: formData.difficulty,
        options: formData.category === '객관식' ? formData.options : undefined,
        createdAt: Date.now()
      };
      await storageService.saveQuestion(newQuestion);
      await loadData();
      addToast('문제가 성공적으로 등록되었습니다!', 'success');
      setFormData({ content: '', answer: '', image: '', explanation: '', category: '객관식', difficulty: Difficulty.MEDIUM, options: ['', '', '', ''] });
      setSelectedOptionIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) { addToast('이미지 크기는 500KB 이하여야 합니다.', 'error'); e.target.value = ''; return; }
            const reader = new FileReader();
            reader.onloadend = () => { setFormData(prev => ({ ...prev, image: reader.result as string })); };
            reader.readAsDataURL(file);
        }
    };

    const generateAIExplanation = async () => {
        let currentAnswer = '';
        if (formData.category === '객관식') {
            if (selectedOptionIndex !== null) currentAnswer = formData.options[selectedOptionIndex];
        } else {
            currentAnswer = formData.answer;
        }
        if (!formData.content.trim() || !currentAnswer.trim()) {
            addToast('문제 내용과 정답을 입력해야 합니다.', 'error'); return;
        }
        setIsGeneratingExplanation(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `다음 자동차 정비 산업기사 시험 문제에 대한 해설을 작성해줘. 문제: ${formData.content}, 정답: ${currentAnswer}, 해설:`,
            });
            const text = response.text;
            if (text) {
                setFormData(prev => ({ ...prev, explanation: text.trim() }));
                addToast('AI 해설이 생성되었습니다.', 'success');
            }
        } catch (error) { addToast('AI 해설 생성 실패', 'error'); } finally { setIsGeneratingExplanation(false); }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            await storageService.deleteQuestion(id);
            await loadData();
            addToast('문제가 삭제되었습니다.', 'info');
        }
    };

    const filteredQuestions = questions.filter((q: Question) => {
        const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === '전체' || q.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">문제 관리</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">문제 유형</label>
                            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none">
                                {categories.map((c: Category) => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">난이도</label>
                            <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value as Difficulty})} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none">
                                {Object.values(Difficulty).map(diff => <option key={diff} value={diff}>{diff}</option>)}
                            </select>
                        </div>
                    </div>
                    <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full p-3 h-20 rounded-lg border border-slate-200 bg-slate-50 outline-none resize-none" placeholder="문제를 입력하세요..." required />
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex gap-2 mb-2">
                            <input type="text" placeholder="이미지 URL" value={formData.image.startsWith('data:') ? '' : formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full p-2 rounded-lg border text-sm" />
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm cursor-pointer"><Upload size={16}/> 업로드</label>
                        </div>
                        {formData.image && <img src={formData.image} alt="Preview" className="h-40 object-contain mx-auto" />}
                    </div>

                    {formData.category === '객관식' ? (
                        <div className="grid grid-cols-2 gap-3">
                            {formData.options.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input type="radio" name="correctOption" checked={selectedOptionIndex === idx} onChange={() => setSelectedOptionIndex(idx)} className="w-4 h-4 accent-blue-600" />
                                    <input type="text" value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} placeholder={`보기 ${idx+1}`} className="flex-1 p-2 text-sm rounded-lg border outline-none" required />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <input type="text" value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} className="w-full p-3 rounded-lg border bg-slate-50 outline-none" placeholder="정답" required />
                    )}
                    
                    <div className="relative">
                        <button type="button" onClick={generateAIExplanation} disabled={isGeneratingExplanation} className="absolute right-2 top-2 text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded flex items-center gap-1">{isGeneratingExplanation ? '생성중...' : <><Bot size={12}/> AI 해설</>}</button>
                        <textarea value={formData.explanation} onChange={(e) => setFormData({...formData, explanation: e.target.value})} className="w-full p-3 h-24 rounded-lg border bg-slate-50 outline-none resize-none" placeholder="해설 입력" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold">등록</button>
                </form>
            </div>
            
            <div className="space-y-3">
                <input type="text" placeholder="검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 border rounded-lg mb-4" />
                {filteredQuestions.map((q: Question) => (
                    <div key={q.id} className="bg-white p-4 rounded-xl border flex justify-between items-start">
                        <div>
                            <div className="font-bold text-slate-800">{q.content}</div>
                            <div className="text-xs text-slate-500 mt-1">{q.category} | {q.difficulty} | 정답: {q.answer}</div>
                        </div>
                        <button onClick={() => handleDelete(q.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CommunityView = ({ addToast }: { addToast: (msg: string, type: 'success'|'error'|'info') => void }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
    const [isOfflineView, setIsOfflineView] = useState(false);

    useEffect(() => {
        fetchPosts();
        const channel = supabase
            .channel('public:posts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
                const newPostRaw = payload.new as any;
                const newPost: Post = {
                    ...newPostRaw,
                    id: newPostRaw.id.toString(),
                    createdAt: new Date(newPostRaw.created_at).getTime()
                };
                setPosts(prev => [newPost, ...prev]);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
                const deletedId = payload.old.id.toString();
                setPosts(prev => prev.filter(p => p.id !== deletedId));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            const formattedData: Post[] = (data || []).map(p => ({
                ...p,
                id: p.id.toString(), 
                createdAt: new Date(p.created_at).getTime() 
            }));
            setPosts(formattedData);
            setIsOfflineView(false);
        } catch (err) {
            console.error("Supabase fetch error, switching to offline mode:", err);
            setIsOfflineView(true);
            const localPosts = await storageService.getPosts();
            setPosts(localPosts);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) {
            addToast('제목과 내용을 모두 입력해주세요.', 'error');
            return;
        }

        setIsSubmitting(true);
        let aiReplyText = '';

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `당신은 자동차 정비 산업기사 시험을 준비하는 학생들을 돕는 친절하고 전문적인 멘토입니다. 
                다음은 학생이 커뮤니티에 올린 게시글입니다. 이 글에 대해 격려하거나, 도움이 되는 조언, 또는 전문적인 답변을 짧고 따뜻하게 작성해주세요.
                
                제목: ${newPost.title}
                내용: ${newPost.content}
                
                답변:`
            });
            aiReplyText = response.text || '';
        } catch (error) {
            console.error("AI Reply Generation Failed", error);
        }

        if (isOfflineView) {
             const localPost: Post = {
                id: Date.now().toString(),
                title: newPost.title,
                content: newPost.content,
                author: newPost.author || '익명',
                aiReply: aiReplyText,
                createdAt: Date.now()
             };
             await storageService.savePost(localPost);
             setPosts(prev => [localPost, ...prev]);
             setIsWriting(false);
             setNewPost({ title: '', content: '', author: '' });
             addToast('오프라인 모드로 저장되었습니다.', 'success');
             setIsSubmitting(false);
             return;
        }

        try {
            const { error } = await supabase
                .from('posts')
                .insert([
                    { 
                        title: newPost.title, 
                        content: newPost.content, 
                        author: newPost.author || '익명', 
                        ai_reply: aiReplyText 
                    }
                ]);

            if (error) throw error;

            setIsWriting(false);
            setNewPost({ title: '', content: '', author: '' });
            addToast('게시글이 공유되었습니다.', 'success');
        } catch (err) {
            console.error("Supabase insert error, falling back to local:", err);
            const localPost: Post = {
                id: Date.now().toString(),
                title: newPost.title,
                content: newPost.content,
                author: newPost.author || '익명',
                aiReply: aiReplyText,
                createdAt: Date.now()
             };
             await storageService.savePost(localPost);
             setPosts(prev => [localPost, ...prev]);
             
             setIsOfflineView(true);
             
             setIsWriting(false);
             setNewPost({ title: '', content: '', author: '' });
             addToast('서버 연결 실패. 로컬에 저장되었습니다.', 'info');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(!window.confirm('정말 삭제하시겠습니까?')) return;

        if (isOfflineView) {
            await storageService.deletePost(id);
            setPosts(prev => prev.filter(p => p.id !== id));
            addToast('게시글이 삭제되었습니다 (로컬).', 'info');
            return;
        }

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            setPosts(prev => prev.filter(p => p.id !== id));
            addToast('게시글이 삭제되었습니다.', 'info');
        } catch (err) {
             await storageService.deletePost(id);
             setPosts(prev => prev.filter(p => p.id !== id));
             addToast('로컬 데이터가 삭제되었습니다.', 'info');
        }
    }

    return (
      <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <Globe className="text-blue-600" size={24} /> 
                    실시간 커뮤니티
                </h1>
                <p className="text-slate-500 text-sm">다른 수험자들과 실시간으로 소통하고 정보를 공유하세요.</p>
            </div>
            {!isWriting && (
                <button 
                    onClick={() => setIsWriting(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
                >
                    <PenSquare size={18} />
                    글쓰기
                </button>
            )}
        </div>

        {isOfflineView && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-orange-700 flex items-center gap-3 animate-fade-in">
                <WifiOff size={20} />
                <div className="flex-1">
                    <span className="font-bold">오프라인 상태:</span> 현재 로컬 모드로 작동 중입니다. 작성한 글은 이 기기에만 저장됩니다.
                </div>
            </div>
        )}

        {isWriting && (
            <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-fade-in-up relative">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center rounded-2xl">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-sm font-bold text-blue-600 animate-pulse">AI가 답변을 준비하며 등록 중입니다...</p>
                    </div>
                )}
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-700">새 게시글 작성</h3>
                    <button type="button" onClick={() => setIsWriting(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <input 
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                    placeholder="제목을 입력하세요"
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    maxLength={50}
                    disabled={isSubmitting}
                />
                <textarea 
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 h-32 resize-none"
                    placeholder="내용을 자유롭게 입력하세요..."
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    disabled={isSubmitting}
                />
                <div className="flex gap-4 items-center">
                    <input 
                        className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                        placeholder="작성자 (선택, 기본: 익명)"
                        value={newPost.author}
                        onChange={e => setNewPost({...newPost, author: e.target.value})}
                        maxLength={10}
                        disabled={isSubmitting}
                    />
                    <button type="submit" disabled={isSubmitting} className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70">
                        {isOfflineView ? '로컬에 저장' : '공유하기'}
                    </button>
                </div>
            </form>
        )}

        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                    <p>아직 게시글이 없습니다.</p>
                    <p className="text-sm">첫 번째 글을 남겨보세요!</p>
                </div>
            ) : (
                posts.map(post => (
                    <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all group relative">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-800">{post.title}</h3>
                            <div className="text-xs text-slate-400 flex flex-col items-end gap-1">
                                <span>{new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <span className="font-medium text-slate-500">{post.author}</span>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mb-4">{post.content}</p>
                        
                        {post.aiReply && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4 relative animate-fade-in">
                                <div className="absolute -top-3 left-4 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                    <Bot size={12} /> AI 멘토 답변
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed pt-2">
                                    {post.aiReply}
                                </p>
                            </div>
                        )}

                        <button 
                            onClick={() => handleDelete(post.id)}
                            className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="삭제"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>
    );
};

const WrongNotesView = ({ questions, wrongNoteIds, isTestRunning, setActiveTestQuestions, setIsTestRunning, activeTestQuestions, loadData }: any) => {
    const wrongQuestions = questions.filter((q: Question) => wrongNoteIds.includes(q.id));
    if (isTestRunning) {
        return (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4 text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100"><AlertCircle size={20} /><span className="font-medium text-sm">복습 모드: 정답을 맞히면 목록에서 제거됩니다.</span></div>
            <TestRunner questions={activeTestQuestions} isReviewMode={true} onComplete={async () => { setIsTestRunning(false); await loadData(); }} />
          </div>
        )
     }
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">오답 노트</h1>
            {wrongQuestions.length > 0 && <button onClick={() => { setActiveTestQuestions(wrongQuestions); setIsTestRunning(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all"><PlayCircle size={18} />전체 복습 시작</button>}
        </div>
        {wrongQuestions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200"><div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><Trophy size={32} /></div><h3 className="text-lg font-semibold text-slate-600">훌륭합니다!</h3><p className="text-slate-400">오답 노트가 비어있습니다.</p></div>
        ) : (
            <div className="grid grid-cols-1 gap-4">{wrongQuestions.map((q: Question) => (<div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-all group"><div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">{q.category}</span><span className="text-xs text-slate-400">{new Date(q.createdAt).toLocaleDateString()}</span></div><h3 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">{q.content}</h3>{q.image && <div className="mb-3 rounded-lg overflow-hidden border border-slate-100"><img src={q.image} alt="Question" className="h-32 object-contain bg-slate-50" /></div>}{q.category === '객관식' && <div className="text-sm text-slate-500 mb-2"><span className="font-medium mr-2">보기:</span> {q.options?.join(', ')}</div>}<p className="text-sm text-slate-500 line-clamp-2">{q.explanation}</p></div>))}</div>
        )}
      </div>
    );
};

const DEFAULT_MESSAGES = [
  "📢 공지사항 : 문제오류 발견시 커뮤니티 게시판에 알려주시면 수정하겠습니다! 📢",
  "🔥 수험자 여러분! 포기하지 않는 끈기가 합격의 열쇠입니다! 오늘도 힘내세요! 🔥",
  "🌟 당신의 노력이 빛나는 결과로 돌아올 것입니다! 합격 기원! 🌟",
  "🔧 자동차 정비 산업기사 당신은 이미 잘하고계십니다! 끝까지 파이팅! 🔧",
  "⚠️ 이론시험을 어려워하시는분들을 위해 제작되었습니다. 합격 할 수 있습니다~ ⚠️"
];

const App = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [todayVisitorCount, setTodayVisitorCount] = useState(0);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  
  // Test State
  const [activeTestQuestions, setActiveTestQuestions] = useState<Question[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false); // Track if current test is a Mock Exam
  const [testResult, setTestResult] = useState<{correct: number, total: number, score: number, maxScore: number} | null>(null);

  // Wrong Note State
  const [wrongNoteIds, setWrongNoteIds] = useState<string[]>([]);
  
  // Celebration & Connection State
  const [showCelebration, setShowCelebration] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hofNotification, setHofNotification] = useState<{name: string, visible: boolean} | null>(null);
  
  // Dynamic Marquee State
  const [marqueeMessages, setMarqueeMessages] = useState<string[]>(DEFAULT_MESSAGES);

  // Latest Community Post State (New)
  const [latestPost, setLatestPost] = useState<Post | null>(null);

  // Startup Notice State
  const [showStartupNotice, setShowStartupNotice] = useState(false);

  // Admin Mode State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Ref to track processed notification IDs to prevent duplicates "1회만"
  const processedNotificationIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const init = async () => {
      await loadData();
      checkConnection();
    };
    init();
    
    // Check local storage for hidden notice status
    const hiddenDate = localStorage.getItem('hide_notice_date');
    const today = new Date().toDateString();
    if (hiddenDate !== today) {
        setShowStartupNotice(true);
    }
    
    // Initial fetch for latest post
    const fetchLatestPost = async () => {
        try {
            const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(1).single();
            if (data) {
                setLatestPost({
                    ...data,
                    id: data.id.toString(),
                    createdAt: new Date(data.created_at).getTime()
                });
            }
        } catch (e) {
            console.error("Failed to fetch latest post", e);
        }
    };
    fetchLatestPost();

    // 1. Hall of Fame & Notice & Posts Realtime Subscription
    const globalChannel = supabase
      .channel('public:global_updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'hall_of_fame' 
      }, (payload) => {
        const newEntryRaw = payload.new as any;
        if (newEntryRaw && newEntryRaw.name) {
          const newEntry: HallOfFameEntry = {
            id: newEntryRaw.id.toString(),
            name: newEntryRaw.name,
            score: newEntryRaw.score,
            date: new Date(newEntryRaw.created_at).getTime()
          };
          
          setHallOfFame(prev => {
             // If entry exists, do nothing
             if (prev.some(e => e.id === newEntry.id)) return prev;
             // Add new entry and sort
             return [newEntry, ...prev].sort((a, b) => b.date - a.date);
          });

          if (!processedNotificationIds.current.has(newEntryRaw.id.toString())) {
             processedNotificationIds.current.add(newEntryRaw.id.toString());
             triggerHofNotification(newEntryRaw.name);
             const celebrationMsg = `🎉 축하합니다! ${newEntryRaw.name}님이 실전 모의고사 만점을 달성하셨습니다! 🎉`;
             setMarqueeMessages(prev => [celebrationMsg, ...prev.slice(0, 4)]);
          }
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notices'
      }, (payload) => {
        const newNoticeRaw = payload.new as any;
        if (newNoticeRaw && newNoticeRaw.content) {
            const newNotice: Notice = {
                id: newNoticeRaw.id.toString(),
                content: newNoticeRaw.content,
                createdAt: new Date(newNoticeRaw.created_at).getTime()
            };
            setNotices(prev => [newNotice, ...prev]);
        }
      })
      // New: Listen for new posts
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts'
      }, (payload) => {
        const newPostRaw = payload.new as any;
        if (newPostRaw) {
            const newPost: Post = {
                ...newPostRaw,
                id: newPostRaw.id.toString(),
                createdAt: new Date(newPostRaw.created_at).getTime()
            };
            setLatestPost(newPost);
        }
      })
      // New: Listen for question changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'questions'
      }, () => {
        loadData();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          fetchLatestHallOfFame();
          fetchNotices();
        } else {
          setIsConnected(false);
        }
      });

    // 2. Realtime Visitor Count Logic (Total & Daily)
    const initVisitorStats = async () => {
        // Fetch Total
        const { data: totalData } = await supabase
            .from('visitor_stats')
            .select('count')
            .eq('id', 1)
            .single();
        
        if (totalData) {
            setVisitorCount(totalData.count);
        }

        // Fetch Today
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: todayData } = await supabase
            .from('daily_visitor_stats')
            .select('count')
            .eq('date', todayStr)
            .single();
        
        if (todayData) {
            setTodayVisitorCount(todayData.count);
        }

        const visitorChannel = supabase
            .channel('public:visitor_stats')
            // Listen for Total updates
            .on('postgres_changes', { 
                event: 'UPDATE', 
                schema: 'public', 
                table: 'visitor_stats',
                filter: 'id=eq.1'
            }, (payload) => {
                setVisitorCount((payload.new as any).count);
            })
            // Listen for Daily updates (Insert for new day, Update for existing day)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'daily_visitor_stats'
            }, (payload) => {
                const newDay = payload.new as any;
                if (newDay.date === todayStr) {
                    setTodayVisitorCount(newDay.count);
                }
            })
            .on('postgres_changes', { 
                event: 'UPDATE', 
                schema: 'public', 
                table: 'daily_visitor_stats'
            }, (payload) => {
                const updatedDay = payload.new as any;
                if (updatedDay.date === todayStr) {
                    setTodayVisitorCount(updatedDay.count);
                }
            })
            .subscribe();

        const hasVisited = sessionStorage.getItem('fq_realtime_visited_v2');
        if (!hasVisited) {
            sessionStorage.setItem('fq_realtime_visited_v2', 'true');
            // This RPC now updates both tables (Total + Daily)
            await supabase.rpc('increment_visitor_count');
        }
        
        return () => { supabase.removeChannel(visitorChannel); };
    };

    const cleanupVisitor = initVisitorStats();

    return () => {
      supabase.removeChannel(globalChannel);
      cleanupVisitor.then(cleanup => cleanup && cleanup());
    };
  }, []);

  const checkConnection = async () => {
    try {
      const { error } = await supabase.from('posts').select('count', { count: 'exact', head: true });
      if (!error) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch {
      setIsConnected(false);
    }
  };

  const fetchLatestHallOfFame = async () => {
    try {
      const { data, error } = await supabase
        .from('hall_of_fame')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        const mappedData: HallOfFameEntry[] = data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          score: item.score,
          date: new Date(item.created_at).getTime()
        }));
        setHallOfFame(mappedData);
      }
    } catch (e) {
      console.error("Failed to fetch Hall of Fame", e);
    }
  };

  const fetchNotices = async () => {
    try {
        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (!error && data) {
            const mappedNotices: Notice[] = data.map((item: any) => ({
                id: item.id.toString(),
                content: item.content,
                createdAt: new Date(item.created_at).getTime()
            }));
            setNotices(mappedNotices);
        }
    } catch (e) {
        console.error("Failed to fetch notices", e);
    }
  };

  const loadData = async () => {
    const rawQuestions = await storageService.getQuestions();
    
    // Deduplicate IDs to prevent "multiple questions with same ID showing in wrong notes" bug
    const uniqueQuestions: Question[] = [];
    const idMap = new Map<string, number>();
    
    rawQuestions.forEach(q => {
        let newId = q.id;
        if (idMap.has(q.id)) {
            const count = idMap.get(q.id)! + 1;
            idMap.set(q.id, count);
            newId = `${q.id}_dup${count}`;
        } else {
            idMap.set(q.id, 1);
        }
        uniqueQuestions.push({ ...q, id: newId });
    });

    setQuestions(uniqueQuestions);
    setCategories(await storageService.getCategories());
    setWrongNoteIds(storageService.getWrongNotes());
    setHallOfFame(await storageService.getHallOfFame());
  };

  const triggerHofNotification = (name: string) => {
    setHofNotification({ name, visible: true });
    setTimeout(() => {
      setHofNotification(null);
    }, 6000); 
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const registerHallOfFame = async (name: string) => {
    const now = Date.now();
    // 1. Optimistic Update: Update UI immediately
    const optimisticEntry: HallOfFameEntry = {
      id: `temp_${now}`, // Temporary ID
      name,
      score: 100,
      date: now
    };
    
    setHallOfFame(prev => [optimisticEntry, ...prev].sort((a, b) => b.date - a.date));
    
    // 2. Local Storage Update
    await storageService.addHallOfFameEntry(name, 100);
    
    // 3. Immediate Feedback
    triggerHofNotification(name); 
    const celebrationMsg = `🎉 축하합니다! ${name}님이 실전 모의고사 만점을 달성하셨습니다! 🎉`;
    setMarqueeMessages(prev => [celebrationMsg, ...prev.slice(0, 4)]);

    // 4. Server Update
    if (isConnected) {
      try {
        await supabase.from('hall_of_fame').insert([{ name, score: 100 }]);
        // No need to fetch immediately if subscription works, but to be safe:
        // We do a background fetch to ensure consistency but don't block UI
        fetchLatestHallOfFame(); 
      } catch (e) {
        console.error("Hall of Fame sync failed", e);
      }
    }

    addToast(`${name}님이 명예의 전당에 등록되었습니다!`, 'success');
  };

  // Admin Logic
  const handleAdminLogin = (pin: string) => {
    if (pin === '0000') {
      setIsAdminModalOpen(false);
      setView('ADMIN');
      addToast('관리자 모드로 전환되었습니다.', 'success');
    } else {
      addToast('비밀번호가 일치하지 않습니다.', 'error');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(id);
        setIsMobileMenuOpen(false);
        setIsTestRunning(false); 
        setTestResult(null);
        // Do NOT reset isMockMode here to allow hall of fame registration if applicable
        setShowCelebration(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        view === id 
          ? 'bg-blue-50 text-blue-700 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const ConnectionStatus = () => (
    <div className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors duration-300 mt-auto border ${
        isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
    }`}>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        {isConnected ? (
            <span className="flex items-center gap-1">
                <Wifi size={12} /> 서버 연결됨
            </span>
        ) : (
            <span className="flex items-center gap-1 flex-1">
                <WifiOff size={12} /> 오프라인 모드
            </span>
        )}
        {!isConnected && (
            <button 
                onClick={checkConnection} 
                className="ml-auto p-1 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                title="재연결 시도"
            >
                <RefreshCw size={12} />
            </button>
        )}
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <GlobalStyles />
      
      {/* Admin Login Modal */}
      {isAdminModalOpen && (
        <AdminLoginModal onClose={() => setIsAdminModalOpen(false)} onLogin={handleAdminLogin} />
      )}

      {/* Global Notification Popup */}
      {hofNotification && hofNotification.visible && (
        <GlobalCelebrationPopup name={hofNotification.name} />
      )}

      {/* Startup Notice Modal */}
      {showStartupNotice && notices.length > 0 && (
        <StartupNoticeModal 
            notice={notices[0]} 
            onClose={() => setShowStartupNotice(false)} 
        />
      )}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-fade-in-up ${
            t.type === 'success' ? 'bg-white border-green-100 text-green-700' :
            t.type === 'error' ? 'bg-white border-red-100 text-red-700' :
            'bg-white border-blue-100 text-blue-700'
          }`}>
             {t.type === 'success' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
             {t.type === 'error' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
             <span className="font-medium text-sm">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">그린</div>
          <span className="text-xl font-bold text-slate-800">기출문제은행</span>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
          <SidebarItem id="DASHBOARD" icon={LayoutDashboard} label="대시보드" />
          <SidebarItem id="TEST" icon={PlayCircle} label="문제풀기" />
          <SidebarItem id="WRONG_NOTES" icon={BookX} label="오답 노트" />
          
          <div className="pt-8 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4">관리</span>
          </div>
          
          <SidebarItem id="QUESTIONS" icon={PlusCircle} label="문제 관리" />
          <SidebarItem id="COMMUNITY" icon={MessageSquare} label="실시간 커뮤니티" />
          
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              view === 'ADMIN' 
                ? 'bg-red-50 text-red-700 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Lock size={20} />
            관리자 모드
          </button>

          <CalendarWidget />
          <CalendarLegend />
        </nav>

        {/* Server Connection Status (Bottom of Sidebar) */}
        <ConnectionStatus />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-40 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">그린</div>
            <span className="text-lg font-bold text-slate-800">기출문제은행</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-30 pt-20 px-6 space-y-2 md:hidden flex flex-col overflow-y-auto">
            <SidebarItem id="DASHBOARD" icon={LayoutDashboard} label="대시보드" />
            <SidebarItem id="TEST" icon={PlayCircle} label="문제풀기" />
            <SidebarItem id="WRONG_NOTES" icon={BookX} label="오답 노트" />
            <div className="h-px bg-slate-100 my-4"></div>
            <SidebarItem id="QUESTIONS" icon={PlusCircle} label="문제 관리" />
            <SidebarItem id="COMMUNITY" icon={MessageSquare} label="실시간 커뮤니티" />
            <button
                onClick={() => { setIsMobileMenuOpen(false); setIsAdminModalOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-50 font-medium"
            >
                <Lock size={20} /> 관리자 모드
            </button>
            <div className="px-4 pb-4">
               <CalendarWidget />
               <CalendarLegend />
            </div>
            <div className="mt-auto mb-8">
               <ConnectionStatus />
            </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-0 p-6 md:p-10">
        <div className="max-w-5xl mx-auto h-full">
           
           {/* Dynamic Neon Marquee Message */}
           <div className="bg-slate-900 overflow-hidden py-3 rounded-xl shadow-lg border border-slate-700 relative mb-6">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
              <div className="animate-marquee whitespace-nowrap flex items-center">
                 {marqueeMessages.map((msg, i) => {
                   // Apply different neon style for celebration messages
                   const isCelebration = msg.includes("만점");
                   return (
                     <span 
                       key={i} 
                       className={`text-xl font-bold mx-8 ${isCelebration ? 'neon-text-pink drop-shadow-[0_0_5px_rgba(255,0,222,0.8)]' : (i % 2 === 0 ? 'neon-text-blue' : 'neon-text-gold')}`}
                     >
                        {msg}
                     </span>
                   );
                 })}
              </div>
           </div>

           {view === 'DASHBOARD' && 
             <DashboardView 
               questions={questions} 
               hallOfFame={hallOfFame} 
               visitorCount={visitorCount} 
               todayVisitorCount={todayVisitorCount}
               notices={notices} 
               showCelebration={showCelebration}
               setShowCelebration={setShowCelebration}
               isMockMode={isMockMode}
               registerHallOfFame={registerHallOfFame}
               setIsMockMode={setIsMockMode}
               wrongNoteIds={wrongNoteIds}
               latestPost={latestPost}
               setView={setView}
               addToast={addToast}
             />
           }
           {view === 'QUESTIONS' && <ManageQuestionsView questions={questions} categories={categories} loadData={loadData} addToast={addToast} />}
           {view === 'COMMUNITY' && <CommunityView addToast={addToast} />}
           {view === 'TEST' && 
             <TestView 
               questions={questions}
               categories={categories}
               isTestRunning={isTestRunning}
               setIsTestRunning={setIsTestRunning}
               activeTestQuestions={activeTestQuestions}
               setActiveTestQuestions={setActiveTestQuestions}
               isMockMode={isMockMode}
               setIsMockMode={setIsMockMode}
               testResult={testResult}
               setTestResult={setTestResult}
               showCelebration={showCelebration}
               setShowCelebration={setShowCelebration}
               registerHallOfFame={registerHallOfFame}
               loadData={loadData}
               addToast={addToast}
             />
           }
           {view === 'WRONG_NOTES' && 
             <WrongNotesView 
               questions={questions} 
               wrongNoteIds={wrongNoteIds} 
               isTestRunning={isTestRunning}
               setActiveTestQuestions={setActiveTestQuestions}
               setIsTestRunning={setIsTestRunning}
               activeTestQuestions={activeTestQuestions}
               loadData={loadData}
             />
           }
           {view === 'ADMIN' && (
             <AdminView 
               onSimulatePerfectScore={(name) => {
                 // Trigger full flow: Notification, Confetti, DB Update
                 setIsMockMode(true); // Treat as mock exam to show celebration inputs if needed
                 registerHallOfFame(name); // This function handles everything
                 setShowCelebration(true); // Force show celebration overlay
                 setView('DASHBOARD'); // Go back to dashboard to see results
               }}
               onLogout={() => {
                 setView('DASHBOARD');
                 addToast('로그아웃 되었습니다.', 'info');
               }}
               addToast={addToast}
               onSyncQuestions={async () => {
                 await storageService.syncQuestions();
                 await loadData();
               }}
             />
           )}
        </div>
      </main>

    </div>
  );
};

export default App;
