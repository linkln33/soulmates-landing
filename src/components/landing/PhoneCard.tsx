'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Flame, Gem, ScanEye, HeartHandshake, MoonStar, type LucideIcon } from 'lucide-react';

interface Profile {
  img: string;
  name: string;
  loc: string;
  conn: { icon: LucideIcon; cat: string; name: string; color: string };
  score: { emoji: string; tier: string; val: number; color: string };
  oracle: { system: string; icon: string; reading: string; color: string };
}

const PROFILES: Profile[] = [
  {
    img: '/images/p1.jpg', name: 'Mia, 26', loc: 'Berlin, Germany',
    conn:  { icon: Flame,     cat: '', name: 'Twin Flame',        color: '#f97316' },
    score: { emoji: '',  tier: 'Perfect Match',       val: 94, color: '#FF4500' },
    oracle: { system: 'Venus Transit', icon: '♀', reading: 'Venus conjuncts your natal Mars today. The cosmos is pulling two flames toward the same point in space and time.', color: '#f97316' },
  },
  {
    img: '/images/p2.jpg', name: 'Luna, 28', loc: 'Barcelona, Spain',
    conn:  { icon: Gem,           cat: '', name: 'Soulmate',           color: '#8b5cf6' },
    score: { emoji: '', tier: 'Exceptional Match',   val: 88, color: '#9333EA' },
    oracle: { system: 'Vedic Moon', icon: '🌙', reading: 'Your Moon in Pisces mirrors her Sun energy. A karmic contract written lifetimes ago is preparing to surface.', color: '#8b5cf6' },
  },
  {
    img: '/images/p3.jpg', name: 'Sofia, 24', loc: 'Amsterdam, NL',
    conn:  { icon: ScanEye,       cat: '', name: 'Spiritual Mirror',   color: '#06b6d4' },
    score: { emoji: '', tier: 'Celestial Match',     val: 82, color: '#6366F1' },
    oracle: { system: 'Mayan Tzolkin', icon: '🗓', reading: 'Your Mayan kin aligns on the sacred Tzolkin wheel. This convergence recurs only once every 260 days — you are in that window now.', color: '#06b6d4' },
  },
  {
    img: '/images/p4.jpg', name: 'Aria, 27', loc: 'Paris, France',
    conn:  { icon: HeartHandshake, cat: '', name: 'Heart-Based Union',  color: '#ec4899' },
    score: { emoji: '', tier: 'Outstanding Match',   val: 71, color: '#10B981' },
    oracle: { system: 'Gene Keys', icon: '🧬', reading: 'Gene Key 46 illuminates your heart center. This connection holds the frequency to unlock something that has been dormant in your soul.', color: '#ec4899' },
  },
  {
    img: '/images/p5.jpg', name: 'Zara, 25', loc: 'London, UK',
    conn:  { icon: MoonStar,      cat: '', name: 'Sacred Devotion',    color: '#fbbf24' },
    score: { emoji: '',  tier: 'Glowing Match',       val: 62, color: '#F59E0B' },
    oracle: { system: 'Nakshatra', icon: '⭐', reading: 'Your Vedic nakshatra forms a trine with her rising star. Patience here is not waiting — it is sacred preparation for a deep union.', color: '#fbbf24' },
  },
];

export default function PhoneCard() {
  const [ci, setCi] = useState(0);
  const [entering, setEntering] = useState(false);
  const [oracleVisible, setOracleVisible] = useState(false);
  const [oracleFading, setOracleFading] = useState(false);
  const oracleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const likeRef = useRef<HTMLDivElement>(null);
  const nopeRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 72;

  const p = PROFILES[ci];
  const mid = PROFILES[(ci + 1) % PROFILES.length];
  const back = PROFILES[(ci + 2) % PROFILES.length];

  const triggerOracle = useCallback(() => {
    if (oracleTimerRef.current) clearTimeout(oracleTimerRef.current);
    setOracleFading(false);
    setOracleVisible(true);
    // start fade-out after 3.6s, fully hidden at 4.5s
    oracleTimerRef.current = setTimeout(() => {
      setOracleFading(true);
      oracleTimerRef.current = setTimeout(() => setOracleVisible(false), 700);
    }, 3600);
  }, []);

  useEffect(() => () => { if (oracleTimerRef.current) clearTimeout(oracleTimerRef.current); }, []);

  const swipeAway = useCallback((dir: number) => {
    const f = frontRef.current;
    if (!f) return;
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    f.style.transition = 'transform .4s cubic-bezier(.4,0,1,1),opacity .4s';
    f.style.transform = `translateX(${dir > 0 ? '115%' : '-115%'})`;
    f.style.opacity = '0';
    setTimeout(() => {
      f.style.transition = '';
      f.style.transform = '';
      f.style.opacity = '';
      setCi(prev => (prev + 1) % PROFILES.length);
      setEntering(true);
      setTimeout(() => setEntering(false), 460);
      scheduleAuto();
      setTimeout(() => triggerOracle(), 300);
    }, 420);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOracle]);

  const scheduleAuto = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => swipeAway(1), 5600);
  }, [swipeAway]);

  useEffect(() => {
    scheduleAuto();
    return () => { if (autoTimerRef.current) clearInterval(autoTimerRef.current); };
  }, [scheduleAuto]);

  // Drag handlers
  useEffect(() => {
    const f = frontRef.current;
    if (!f) return;

    function onStart(e: MouseEvent | TouchEvent) {
      if (entering) return;
      draggingRef.current = true;
      currentXRef.current = 0;
      startXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
      f!.classList.add('dragging');
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      e.preventDefault();
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!draggingRef.current) return;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      currentXRef.current = cx - startXRef.current;
      f!.style.transform = `translateX(${currentXRef.current}px)`;
      const ratio = Math.min(Math.abs(currentXRef.current) / THRESHOLD, 1);
      if (currentXRef.current > 10) {
        if (likeRef.current) likeRef.current.style.opacity = String(ratio);
        if (nopeRef.current) nopeRef.current.style.opacity = '0';
      } else if (currentXRef.current < -10) {
        if (nopeRef.current) nopeRef.current.style.opacity = String(ratio);
        if (likeRef.current) likeRef.current.style.opacity = '0';
      } else {
        if (likeRef.current) likeRef.current.style.opacity = '0';
        if (nopeRef.current) nopeRef.current.style.opacity = '0';
      }
      e.preventDefault();
    }

    function onEnd() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      f!.classList.remove('dragging');
      if (likeRef.current) likeRef.current.style.opacity = '0';
      if (nopeRef.current) nopeRef.current.style.opacity = '0';
      if (Math.abs(currentXRef.current) >= THRESHOLD) {
        swipeAway(currentXRef.current > 0 ? 1 : -1);
        f!.style.transform = '';
      } else {
        f!.style.transition = 'transform .35s cubic-bezier(0,.9,.4,1)';
        f!.style.transform = '';
        setTimeout(() => { f!.style.transition = ''; }, 360);
        scheduleAuto();
      }
      currentXRef.current = 0;
    }

    f.addEventListener('mousedown', onStart as EventListener);
    window.addEventListener('mousemove', onMove as EventListener);
    window.addEventListener('mouseup', onEnd);
    f.addEventListener('touchstart', onStart as EventListener, { passive: false });
    window.addEventListener('touchmove', onMove as EventListener, { passive: false });
    window.addEventListener('touchend', onEnd);

    return () => {
      f.removeEventListener('mousedown', onStart as EventListener);
      window.removeEventListener('mousemove', onMove as EventListener);
      window.removeEventListener('mouseup', onEnd);
      f.removeEventListener('touchstart', onStart as EventListener);
      window.removeEventListener('touchmove', onMove as EventListener);
      window.removeEventListener('touchend', onEnd);
    };
  }, [entering, swipeAway, scheduleAuto]);

  return (
    <div className="po" style={{ position: 'relative', width: 390, height: 750 }}>
      {/* LEFT: Multi-system compatibility breakdown */}
      <div className="fc2 fcl">
        <div className="fc-label">Soul Compatibility</div>
        <div className="fc-score">94%</div>
        <div className="fc-rows">
          <div className="fc-row"><span className="fc-sys">Star Alignment</span><div className="fc-bar"><div className="fc-fill" style={{width:'94%'}} /></div><span className="fc-pct">94</span></div>
          <div className="fc-row"><span className="fc-sys">Energy Type</span><div className="fc-bar"><div className="fc-fill" style={{width:'88%',background:'linear-gradient(90deg,#818cf8,#6366f1)'}} /></div><span className="fc-pct">88</span></div>
          <div className="fc-row"><span className="fc-sys">Sacred Calendar</span><div className="fc-bar"><div className="fc-fill" style={{width:'82%',background:'linear-gradient(90deg,#34d399,#059669)'}} /></div><span className="fc-pct">82</span></div>
          <div className="fc-row"><span className="fc-sys">Soul Purpose</span><div className="fc-bar"><div className="fc-fill" style={{width:'91%',background:'linear-gradient(90deg,#fbbf24,#f59e0b)'}} /></div><span className="fc-pct">91</span></div>
        </div>
      </div>
      {/* TOP-RIGHT: Match found notification */}
      <div className="fc2 fct">
        <div className="fc-notif-header">
          <div className="fc-notif-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <span className="fc-notif-app">Soulmates Quest</span>
          <div className="fc-notif-dot" />
          <span className="fc-notif-time">now</span>
        </div>
        <div className="fc-notif-body">
          <div className="fc-notif-avatar">L</div>
          <div className="fc-notif-content">
            <div className="fc-notif-title">New Soulmate Match ✨</div>
            <div className="fc-notif-sub">Luna, 28 · Berlin</div>
            <div className="fc-notif-score">
              <span className="fc-notif-pct">89%</span>
            </div>
          </div>
        </div>
        <div className="fc-systems-used">Calculated across 16 systems</div>
      </div>
      {/* RIGHT: Divine Oracle Active */}
      <div className="fc2 fcr">
        <div className="fc-oracle-header">
          <div className="fc-oracle-ball">
            <span className="fc-oracle-glyph">🔮</span>
            <div className="fc-oracle-ring" />
            <div className="fc-oracle-ring fc-oracle-ring2" />
          </div>
          <div>
            <div className="fc-oracle-title">Divine Oracle</div>
            <div className="fc-oracle-status"><span className="fc-oracle-pulse" />Active &amp; Watching</div>
          </div>
        </div>
        <div className="fc-oracle-line" />
        <div className="fc-oracle-reading">Reading your cosmic fingerprint across dimensions of time, soul &amp; energy…</div>
        <div className="fc-oracle-dots"><span /><span /><span /></div>
      </div>

      {/* Phone shell */}
      <div className="pw">
        <div className="ps">
          <div className="pn"></div>
          <div className="psc">
            <div className="pst"><span>9:41</span><span>●●●</span></div>
            <div className="cs">
              {/* Back card */}
              <div className="mc mcb">
                <div className="mi"><img src={back.img} alt="" loading="lazy" /></div>
                <div className="mg"></div>
              </div>
              {/* Mid card */}
              <div className="mc mcm">
                <div className="mi"><img src={mid.img} alt="" loading="lazy" /></div>
                <div className="mg"></div>
              </div>
              {/* Front card — real SwipeCard design */}
              <div
                ref={frontRef}
                className={`mc mcf${entering ? ' entering' : ''}`}
                style={{ cursor: 'grab' }}
              >
                {/* Drag stamps */}
                <div ref={likeRef} className="stamp stamp-like">LIKE</div>
                <div ref={nopeRef} className="stamp stamp-nope">NOPE</div>

                {/* Full-bleed photo */}
                <div className="mi"><img src={p.img} alt="" loading="lazy" /></div>

                {/* Top scrim */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.45) 0%,transparent 28%)', pointerEvents: 'none', zIndex: 1 }} />

                {/* TOP-LEFT: Connection type badge */}
                <div className="card-badge card-badge-left" style={{ borderColor: p.conn.color + '80' }}>
                  <p.conn.icon className="cb-icon" style={{ width: 13, height: 13, color: p.conn.color, flexShrink: 0 }} strokeWidth={2.2} />
                  <div className="cb-val" style={{ color: p.conn.color }}>{p.conn.name.toUpperCase()}</div>
                </div>

                {/* TOP-RIGHT: Match score badge */}
                <div className="card-badge card-badge-right" style={{ borderColor: p.score.color + '80' }}>
                  <div className="cb-val" style={{ color: p.score.color }}>{p.score.tier.toUpperCase()} {p.score.val}%</div>
                </div>

                {/* Heavy bottom gradient */}
                <div className="mg" />

                {/* Name + location */}
                <div className="mb">
                  <div className="mn">{p.name}</div>
                  <div className="mloc">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {p.loc}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons — Nope · Oracle · Like */}
            <div className="mac">
              <div className="mac-btn mac-nope" onClick={() => swipeAway(-1)}>
                <div className="mac-circle">✕</div>
                <span className="mac-lbl">Nope</span>
              </div>
              <div className="mac-btn mac-oracle" onClick={() => { triggerOracle(); }}
                style={{ transform: oracleVisible && !oracleFading ? 'scale(1.12)' : 'scale(1)', transition: 'transform .2s' }}>
                <div className="mac-circle" style={{ boxShadow: oracleVisible && !oracleFading ? '0 0 22px rgba(139,92,246,.9),0 0 44px rgba(139,92,246,.4)' : '', transition: 'box-shadow .3s' }}>🔮</div>
                <span className="mac-lbl">Oracle</span>
              </div>
              <div className="mac-btn mac-like" onClick={() => swipeAway(1)}>
                <div className="mac-circle">♥</div>
                <span className="mac-lbl">Like</span>
              </div>
            </div>

            {/* Oracle reading popup */}
            {oracleVisible && (
              <div className="oracle-popup" style={{ opacity: oracleFading ? 0 : 1 }}>
                <div className="oracle-popup-inner">
                  <div className="oracle-popup-top">
                    <span className="oracle-popup-ball">🔮</span>
                    <div>
                      <div className="oracle-popup-system" style={{ color: p.oracle.color }}>{p.oracle.icon} {p.oracle.system}</div>
                      <div className="oracle-popup-title">Your Reading</div>
                    </div>
                  </div>
                  <div className="oracle-popup-divider" style={{ background: p.oracle.color + '55' }} />
                  <p className="oracle-popup-text">{p.oracle.reading}</p>
                  <div className="oracle-popup-dots">
                    <span style={{ background: p.oracle.color }} />
                    <span style={{ background: p.oracle.color + '88' }} />
                    <span style={{ background: p.oracle.color + '44' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
