'use client';
import { useEffect, useRef } from 'react';

export default function Stars() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    for (let i = 0; i < 120; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${0.1+Math.random()*0.5};--dur:${3+Math.random()*5}s;--del:-${Math.random()*6}s${Math.random()>.85?';width:3px;height:3px':''}`;
      c.appendChild(s);
    }
  }, []);
  return <div className="stars" ref={ref} />;
}
