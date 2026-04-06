import React, { useState, useEffect } from 'react';
import { Router, HardDrive, Tv, Lightbulb, Lock, Fan, Bell, ShieldAlert, BellRing, Settings, Play, SquareSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Data ---
type AttackStage = 0 | 1 | 2 | 3;

interface LogEntry {
  id: string;
  time: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'FATAL';
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: '1', time: '13:58:12', level: 'INFO', message: 'Sync: Smart Fan (Office) -> OK' },
  { id: '2', time: '13:59:02', level: 'INFO', message: 'Auth: User ADMIN_ROOT logged in' },
];

export default function App() {
  const [stage, setStage] = useState<AttackStage>(0);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [networkMode, setNetworkMode] = useState<'conventional' | 'secure'>('conventional');
  const [secureBlocked, setSecureBlocked] = useState(false);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toTimeString().split(' ')[0];
  };

  const addLog = (level: LogEntry['level'], message: string) => {
    setLogs(prev => {
      const newLog = { id: Math.random().toString(), time: formatTime(new Date()), level, message };
      return [newLog, ...prev].slice(0, 10); // Keep last 10
    });
  };

  const advanceStage = () => {
    if (networkMode === 'secure') {
      setSecureBlocked(true);
      addLog('WARN', 'Unsigned OTA payload detected targeting Smart Bulb_04');
      setTimeout(() => addLog('INFO', 'SECURE_NET: Payload rejected. Zero Trust micro-segmentation enforced.'), 1000);
      setTimeout(() => setSecureBlocked(false), 5000);
      return;
    }

    if (stage === 0) {
      setStage(1);
      addLog('WARN', 'Unsigned OTA payload received at Smart Bulb_04');
      setTimeout(() => addLog('CRITICAL', 'Smart Bulb_04 compromised (Mirai-variant)'), 1500);
    } else if (stage === 1) {
      setStage(2);
      addLog('CRITICAL', 'Lateral movement detected: .104 -> Gateway -> .22');
      setTimeout(() => addLog('WARN', 'Implicit trust exploit attempted on Smart Lock'), 1500);
    } else if (stage === 2) {
      setStage(3);
      addLog('FATAL', 'Smart Lock override successful. Perimeter breached.');
      setTimeout(() => addLog('CRITICAL', 'Pivoting to NAS_VAULT. Data exfiltration initiated.'), 1500);
    } else {
      // Reset
      setStage(0);
      setLogs(INITIAL_LOGS);
    }
  };

  // --- Derived State ---
  const isBulbHacked = stage >= 1;
  const isLockTargeted = stage === 2;
  const isLockBreached = stage >= 3;
  const isNasTargeted = stage >= 3;

  const systemHealth = stage === 0 ? 100 : stage === 1 ? 82 : stage === 2 ? 65 : 40;
  const healthColor = systemHealth > 80 ? 'bg-primary-container glow-cyan' : systemHealth > 50 ? 'bg-yellow-500' : 'bg-secondary-container glow-red';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body overflow-hidden flex flex-col selection:bg-primary-container/30">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center px-8 h-16 w-full fixed z-50 bg-surface border-b border-primary-container/10">
        <div className="text-xl font-bold text-primary-container tracking-[0.2em] font-headline uppercase">
          CYBERARCHITECT
        </div>

        {/* Center Toggles */}
        <div className="flex bg-surface-container-low p-1 border border-outline-variant/20">
          <button 
            onClick={() => { setNetworkMode('conventional'); setStage(0); setLogs(INITIAL_LOGS); setSecureBlocked(false); }}
            className={`px-4 py-1 text-[10px] font-headline tracking-widest uppercase transition-colors ${networkMode === 'conventional' ? 'text-primary-container bg-primary-container/10 border-b border-primary-container' : 'text-slate-500 hover:bg-primary-container/5'}`}
          >
            CONVENTIONAL NETWORK
          </button>
          <button 
            onClick={() => { setNetworkMode('secure'); setStage(0); setLogs(INITIAL_LOGS); setSecureBlocked(false); }}
            className={`px-4 py-1 text-[10px] font-headline tracking-widest uppercase transition-colors ${networkMode === 'secure' ? 'text-primary-container bg-primary-container/10 border-b border-primary-container' : 'text-slate-500 hover:bg-primary-container/5'}`}
          >
            SECURE (SIGNAL SIGN)
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 items-center">
            <a className="text-[10px] font-headline tracking-widest uppercase text-primary-container border-b border-primary-container pb-1" href="#">MAP</a>
            <a className="text-[10px] font-headline tracking-widest uppercase text-slate-500 hover:text-primary-container/70 transition-colors" href="#">DEVICES</a>
            <a className="text-[10px] font-headline tracking-widest uppercase text-slate-500 hover:text-primary-container/70 transition-colors" href="#">METRICS</a>
            <a className="text-[10px] font-headline tracking-widest uppercase text-slate-500 hover:text-primary-container/70 transition-colors" href="#">LOGS</a>
          </div>
          <div className="flex gap-4 items-center ml-4">
            <button onClick={advanceStage} className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-primary-container/30 text-primary-container text-[10px] font-headline tracking-widest uppercase hover:bg-primary-container/10 transition-colors">
              {networkMode === 'secure' ? <ShieldAlert size={12} /> : stage === 3 ? <SquareSquare size={12} /> : <Play size={12} />}
              {networkMode === 'secure' ? 'Test Attack' : stage === 0 ? 'Start Demo' : stage === 3 ? 'Reset' : 'Next Stage'}
            </button>
            <BellRing size={18} className="text-primary-container cursor-pointer" />
            <Settings size={18} className="text-primary-container cursor-pointer" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar Navigation */}
        <aside className="w-72 flex flex-col z-40 bg-surface-container-lowest border-r border-primary-container/5 shrink-0">
          {/* Dashboard Header */}
          <div className="p-6 border-b border-outline-variant/10">
            <div className="flex justify-between items-end mb-1">
              <span className="text-lg font-black text-primary-container font-headline">NODE_MANAGER</span>
              <span className="text-[10px] font-mono text-on-surface-variant">v2.4.0_STABLE</span>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-surface-container-high border border-primary-container/20 flex items-center justify-center">
                <ShieldAlert size={20} className="text-primary-container" />
              </div>
              <div>
                <div className="text-[10px] font-headline text-on-surface-variant tracking-widest uppercase">System Operator</div>
                <div className="text-xs font-mono text-primary-container">ADMIN_ROOT</div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-headline tracking-widest text-on-surface-variant uppercase">System Health</span>
              <span className={`text-xs font-mono ${systemHealth < 50 ? 'text-secondary-container' : 'text-primary-container'}`}>{systemHealth}%</span>
            </div>
            <div className="h-1 w-full bg-surface-container-highest">
              <motion.div 
                className={`h-full ${healthColor}`}
                initial={{ width: '100%' }}
                animate={{ width: `${systemHealth}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-2 text-[10px] text-on-surface-variant/60 font-mono italic">
              {stage === 0 ? 'SYSTEM_NOMINAL' : 'INTEGRITY_SCORE_DEGRADED'}
            </p>
          </div>

          {/* Component Inventory */}
          <div className="px-6 flex-1 overflow-y-auto custom-scrollbar">
            <span className="text-[10px] font-headline tracking-widest text-on-surface-variant uppercase mb-4 block">Component Inventory</span>
            <div className="space-y-4">
              <InventoryItem icon={Router} name="Main Gateway" status="secure" />
              <InventoryItem icon={HardDrive} name="NAS Storage" status={isNasTargeted ? 'breached' : 'secure'} />
              <InventoryItem icon={Tv} name="Smart TV" status="secure" />
              <InventoryItem icon={Lightbulb} name="Smart Bulb_04" status={isBulbHacked ? 'breached' : 'secure'} />
              <InventoryItem icon={Lock} name="Door Lock" status={isLockBreached ? 'breached' : isLockTargeted ? 'targeted' : 'secure'} />
            </div>
          </div>

          {/* Security Log */}
          <div className="p-6 bg-surface-container-lowest/50 border-t border-outline-variant/10">
            <span className="text-[10px] font-headline tracking-widest text-on-surface-variant uppercase mb-3 block">Security Log</span>
            <div className="space-y-2 font-mono text-[9px] leading-relaxed max-h-40 overflow-y-auto custom-scrollbar flex flex-col-reverse">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      log.level === 'FATAL' || log.level === 'CRITICAL' ? 'text-secondary-container' :
                      log.level === 'WARN' ? 'text-yellow-500' : 'text-on-surface-variant'
                    }
                  >
                    <span className="opacity-50">[{log.time}]</span> {log.level}: {log.message}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* Main Blueprint Area */}
        <main className="flex-1 relative bg-surface overflow-hidden flex items-center justify-center">
          {/* Blueprint Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00f2ff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

          {/* Blueprint Container */}
          <div className="relative w-[800px] h-[600px]">
            
            {/* SVG Architectural Base Layer */}
            <svg className="absolute inset-0 pointer-events-none" fill="none" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
              {/* Outer Walls */}
              <path d="M50 50 H750 V550 H50 Z" stroke="#3a494b" strokeOpacity="0.5" strokeWidth="1" />
              {/* Internal Walls */}
              <path d="M300 50 V300 M50 300 H300 M500 50 V550 M500 300 H750" stroke="#3a494b" strokeOpacity="0.3" strokeWidth="1" />
              
              {/* Network Paths (Healthy) */}
              <path className="glow-cyan" d="M400 280 L175 140" stroke="#00f2ff" strokeOpacity="0.4" strokeWidth="0.5" />
              <path className="glow-cyan" d="M400 280 L175 425" stroke="#00f2ff" strokeOpacity="0.4" strokeWidth="0.5" />
              <path className="glow-cyan" d="M400 280 L625 140" stroke="#00f2ff" strokeOpacity={isBulbHacked ? "0.1" : "0.4"} strokeWidth="0.5" />
              <path className="glow-cyan" d="M400 280 L625 425" stroke="#00f2ff" strokeOpacity={isNasTargeted ? "0.1" : "0.4"} strokeWidth="0.5" />
              <path className="glow-cyan" d="M400 280 L400 525" stroke="#00f2ff" strokeOpacity={isLockTargeted || isLockBreached ? "0.1" : "0.4"} strokeWidth="0.5" />

              {/* ATTACK PATHS */}
              {/* From Bulb (Living Room) to Gateway */}
              {stage >= 2 && (
                <path className="attack-path glow-red" d="M625 140 L400 280" stroke="#c31e00" strokeWidth="2" />
              )}
              {/* From Gateway to Door Lock (Entryway) */}
              {stage >= 2 && (
                <path className="attack-path glow-red" d="M400 280 L400 525" stroke="#c31e00" strokeWidth="2" />
              )}
              {/* From Gateway to NAS (Office) */}
              {stage >= 3 && (
                <path className="attack-path glow-red" d="M400 280 L625 425" stroke="#c31e00" strokeWidth="2" />
              )}
            </svg>

            {/* Room Labels */}
            <div className="absolute top-8 left-12 text-[10px] font-headline tracking-[0.3em] uppercase text-on-surface-variant/30">Master Bedroom</div>
            <div className="absolute top-8 left-[512px] text-[10px] font-headline tracking-[0.3em] uppercase text-on-surface-variant/30">Living Room</div>
            <div className="absolute top-[312px] left-12 text-[10px] font-headline tracking-[0.3em] uppercase text-on-surface-variant/30">Kitchen</div>
            <div className="absolute top-[312px] left-[512px] text-[10px] font-headline tracking-[0.3em] uppercase text-on-surface-variant/30">Home Office</div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-headline tracking-[0.3em] uppercase text-on-surface-variant/30">Entryway</div>

            {/* MAIN GATEWAY (Center) */}
            <MapNode 
              icon={Router} 
              name="Central Gateway" 
              ip="192.168.1.1" 
              x={400} y={280} 
              status={stage >= 2 ? 'targeted' : 'secure'} 
            />

            {/* SMART BULB (Living Room) */}
            <MapNode 
              icon={Lightbulb} 
              name="Smart Bulb_04" 
              ip="192.168.1.104" 
              x={625} y={140} 
              status={isBulbHacked ? 'breached' : secureBlocked ? 'targeted' : 'secure'} 
              alertText={isBulbHacked ? "HACKED_ALERT" : secureBlocked ? "BLOCKED" : undefined}
            />

            {/* SMART TV (Living Room) */}
            <MapNode 
              icon={Tv} 
              name="Smart TV" 
              ip="192.168.1.108" 
              x={700} y={220} 
              status="secure" 
              muted
            />

            {/* NAS STORAGE (Home Office) */}
            <MapNode 
              icon={HardDrive} 
              name="NAS_VAULT" 
              ip="192.168.1.50" 
              x={625} y={425} 
              status={isNasTargeted ? 'breached' : 'secure'} 
              alertText="DATA LEAKAGE"
            />

            {/* DOOR LOCK (Entryway) */}
            <MapNode 
              icon={Lock} 
              name="Smart Lock" 
              ip="192.168.1.22" 
              x={400} y={525} 
              status={isLockBreached ? 'breached' : isLockTargeted ? 'targeted' : 'secure'} 
              alertText={isLockBreached ? "OVERRIDE SUCCESS" : "OVERRIDE ATTEMPT"}
            />

            {/* SMART FAN (Bedroom) */}
            <MapNode 
              icon={Fan} 
              name="Air Control" 
              ip="192.168.1.112" 
              x={175} y={140} 
              status="secure" 
              muted
            />

            {/* ENTRY ALARM (Kitchen) */}
            <MapNode 
              icon={Bell} 
              name="Entry Alarm" 
              ip="v1.2.9_SEC" 
              x={175} y={425} 
              status="secure" 
            />

          </div>

          {/* Floating HUD Detail */}
          <AnimatePresence>
            {(stage > 0 || secureBlocked) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`absolute bottom-8 right-8 w-72 p-4 bg-surface-container-high/80 backdrop-blur-md border-l-2 ${secureBlocked ? 'border-primary-container' : 'border-secondary-container'}`}
              >
                <div className={`text-[10px] font-headline tracking-[0.2em] uppercase mb-2 ${secureBlocked ? 'text-primary-container' : 'text-secondary-container'}`}>
                  {secureBlocked ? 'Security Enforcement' : 'Threat Intelligence'}
                </div>
                <div className="text-xs font-mono text-on-surface mb-3 italic">
                  {secureBlocked && '"Rogue OTA blocked. Zero Trust policy prevented unauthorized payload execution."'}
                  {stage === 1 && '"Detection of Mirai-variant via rogue OTA on Node .104."'}
                  {stage === 2 && '"Lateral movement detected. Implicit trust boundary exploited from internal node."'}
                  {stage === 3 && '"Privilege escalation successful. Multiple critical nodes compromised."'}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-on-surface-variant uppercase">Threat Level</span>
                  <span className={`text-xs font-mono font-bold uppercase ${secureBlocked ? 'text-primary-container' : 'text-secondary-container'}`}>
                    {secureBlocked ? 'Mitigated' : 'Severe'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-8 bg-surface-container-lowest border-t border-outline-variant/10 flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${stage === 0 ? 'bg-primary-container glow-cyan' : 'bg-yellow-500'}`}></span>
            <span className={`text-[9px] font-mono uppercase ${stage === 0 ? 'text-on-surface-variant' : 'text-yellow-500'}`}>
              Global Status: {stage === 0 ? 'Operational' : 'Compromised'}
            </span>
          </div>
          {stage > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container glow-red animate-pulse"></span>
              <span className="text-[9px] font-mono text-secondary-container uppercase">Intrusions Detected: {stage === 1 ? '01' : stage === 2 ? '02' : '03'}</span>
            </div>
          )}
        </div>
        <div className="text-[9px] font-mono text-on-surface-variant/40">
          SEC_OPS_LATENCY: 12ms | PKT_LOSS: 0.00% | UPTIME: 322:14:02
        </div>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function InventoryItem({ icon: Icon, name, status }: { icon: any, name: string, status: 'secure' | 'targeted' | 'breached' }) {
  const isBreached = status === 'breached';
  const isTargeted = status === 'targeted';
  
  return (
    <div className="group flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-3">
        <Icon size={16} className={isBreached ? 'text-secondary-container' : isTargeted ? 'text-yellow-500' : 'text-primary-container'} />
        <span className="text-xs font-mono group-hover:text-primary-container transition-colors">{name}</span>
      </div>
      {isBreached ? (
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-secondary-container uppercase">BREACHED</span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-container glow-red"></span>
        </div>
      ) : isTargeted ? (
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-primary-container glow-cyan"></span>
      )}
    </div>
  );
}

function MapNode({ icon: Icon, name, ip, x, y, status, alertText, muted = false }: { 
  icon: any, name: string, ip: string, x: number, y: number, status: 'secure' | 'targeted' | 'breached', alertText?: string, muted?: boolean 
}) {
  const isBreached = status === 'breached';
  const isTargeted = status === 'targeted';
  
  const containerClass = isBreached 
    ? 'bg-secondary-container/10 border-secondary-container glow-red animate-pulse' 
    : isTargeted
    ? 'bg-yellow-500/10 border-yellow-500 animate-pulse'
    : muted
    ? 'bg-surface-container border-outline-variant/30'
    : 'bg-surface-container border-primary-container/40 glow-cyan';

  const iconClass = isBreached 
    ? 'text-secondary-container' 
    : isTargeted
    ? 'text-yellow-500'
    : muted
    ? 'text-on-surface-variant'
    : 'text-primary-container';

  const textClass = isBreached 
    ? 'text-secondary-container' 
    : isTargeted
    ? 'text-yellow-500'
    : muted
    ? 'text-on-surface-variant'
    : 'text-primary-container';

  return (
    <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
      <div className={`w-12 h-12 border flex items-center justify-center transition-colors duration-500 ${containerClass}`}>
        <Icon size={24} className={`transition-colors duration-500 ${iconClass}`} />
      </div>
      <div className="mt-3 text-center">
        <div className={`text-[10px] font-headline tracking-widest uppercase transition-colors duration-500 ${textClass}`}>
          {name}
        </div>
        
        {(isBreached || (isTargeted && alertText)) && (
          <div className={`px-2 py-0.5 mt-1 text-[8px] font-mono font-bold text-surface uppercase ${isBreached ? 'bg-secondary-container' : 'bg-yellow-500'}`}>
            {alertText}
          </div>
        )}
        
        <div className={`text-[9px] font-mono mt-1 ${muted ? 'text-on-surface-variant/60' : 'text-on-surface-variant'}`}>
          {ip}
        </div>
        
        {!isBreached && !muted && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className={`w-1 h-1 rounded-full ${isTargeted ? 'bg-yellow-500' : 'bg-primary-container'}`}></span>
            <span className={`text-[8px] font-mono uppercase ${isTargeted ? 'text-yellow-500' : 'text-on-surface-variant'}`}>
              {isTargeted ? 'Under Attack' : 'Secure'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
