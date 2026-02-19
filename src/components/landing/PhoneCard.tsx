'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Flame, Gem, ScanEye, HeartHandshake, MoonStar, type LucideIcon } from 'lucide-react';

interface Profile {
  img: string;
  name: string;
  loc: string;
  conn: { icon: LucideIcon; cat: string; name: string; color: string };
  score: { emoji: string; tier: string; val: number; color: string };
}

const PROFILES: Profile[] = [
  {
    img: '/images/p1.jpg', name: 'Mia, 26', loc: 'Berlin, Germany',
    conn:  { icon: Flame,     cat: '', name: 'Twin Flame',        color: '#f97316' },
    score: { emoji: '',  tier: 'Perfect Match',       val: 94, color: '#FF4500' },
  },
  {
    img: '/images/p2.jpg', name: 'Luna, 28', loc: 'Barcelona, Spain',
    conn:  { icon: Gem,           cat: '', name: 'Soulmate',           color: '#8b5cf6' },
    score: { emoji: '', tier: 'Exceptional Match',   val: 88, color: '#9333EA' },
  },
  {
    img: '/images/p3.jpg', name: 'Sofia, 24', loc: 'Amsterdam, NL',
    conn:  { icon: ScanEye,       cat: '', name: 'Spiritual Mirror',   color: '#06b6d4' },
    score: { emoji: '', tier: 'Celestial Match',     val: 82, color: '#6366F1' },
  },
  {
    img: '/images/p4.jpg', name: 'Aria, 27', loc: 'Paris, France',
    conn:  { icon: HeartHandshake, cat: '', name: 'Heart-Based Union',  color: '#ec4899' },
    score: { emoji: '', tier: 'Outstanding Match',   val: 71, color: '#10B981' },
  },
  {
    img: '/images/p5.jpg', name: 'Zara, 25', loc: 'London, UK',
    conn:  { icon: MoonStar,      cat: '', name: 'Sacred Devotion',    color: '#fbbf24' },
    score: { emoji: '',  tier: 'Glowing Match',       val: 62, color: '#F59E0B' },
  },
];

export default function PhoneCard() {
  const [ci, setCi] = useState(0);
  const [entering, setEntering] = useState(false);
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

  const swipeAway = useCallback((dir: number) => {
    const f = frontRef.current;
    if (!f) return;
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    f.style.transition = 'transform .4s cubic-bezier(.4,0,1,1),opacity .4s';
    f.style.transform = `translateX(${dir > 0 ? '115%' : '-115%'}) rotate(${dir > 0 ? '22deg' : '-22deg'})`;
    f.style.opacity = '0';
    setTimeout(() => {
      f.style.transition = '';
      f.style.transform = '';
      f.style.opacity = '';
      setCi(prev => (prev + 1) % PROFILES.length);
      setEntering(true);
      setTimeout(() => setEntering(false), 460);
      scheduleAuto();
    }, 420);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const rot = currentXRef.current * 0.08;
      f!.style.transform = `translateX(${currentXRef.current}px) rotate(${rot}deg)`;
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
      {/* Floating context cards */}
      <div className="fc2 fcl">
        <div className="fi">♈ + ♒</div>
        <div className="ft2">Synastry Score</div>
        <div className="fsc">94%</div>
        <div className="fsb">Fire ↔ Air — harmonious</div>
        <div className="fb"><div className="ff" style={{ width: '94%' }}></div></div>
      </div>
      <div className="fc2 fct">
        <div className="nc2">
          <div className="nci">🔔</div>
          <div className="nct">
            <div className="nt1">New Match Alert!</div>
            <div className="nt2">89% match just joined</div>
          </div>
        </div>
      </div>
      <div className="fc2 fcr">
        <div className="fi">🧬</div>
        <div className="ft2">Human Design</div>
        <div className="fsb">Projector × Generator</div>
        <div className="fsb" style={{ color: '#C084FC', fontWeight: 700, marginTop: 3 }}>High compatibility</div>
        <div className="fb" style={{ marginTop: 8 }}><div className="ff" style={{ width: '88%' }}></div></div>
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
              <div className="mac-btn mac-oracle">
                <div className="mac-circle">🔮</div>
                <span className="mac-lbl">Oracle</span>
              </div>
              <div className="mac-btn mac-like" onClick={() => swipeAway(1)}>
                <div className="mac-circle">♥</div>
                <span className="mac-lbl">Like</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
