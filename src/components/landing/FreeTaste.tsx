'use client';

import { useState, useRef } from 'react';
import { Hash, Sun, Planet, Leaf, Scroll } from '@phosphor-icons/react';

interface Section { emoji: string; title: string; summary: string; details?: Record<string, unknown> }
interface LockedSection { title: string; description: string }
interface BlueprintResult {
  success: boolean;
  message?: string;
  confidence?: number;
  blueprint?: { sections?: Section[] };
  lockedSections?: LockedSection[];
}

export default function FreeTaste() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<BlueprintResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split('T')[0];

  async function getFreeReading() {
    setErr('');
    if (!name.trim()) { setErr('Please enter your name.'); return; }
    if (!date) { setErr('Please enter your birth date.'); return; }
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), birthDate: date }),
      });
      const data: BlueprintResult = await resp.json();
      if (!data.success) throw new Error(data.message || 'Calculation failed');
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const fill = document.getElementById('conf-anim') as HTMLElement | null;
        if (fill) fill.style.width = `${data.confidence ?? 55}%`;
      }, 120);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const appStoreUrl = 'https://apps.apple.com/app/id000000000';

  return (
    <section className="ft-s" id="free-taste">
      <div className="wrap">
        <div className="ft-inner">
          <div className="sl2">Free Reading — No Account Needed</div>
          <div className="st" style={{ fontSize: 'clamp(24px,4vw,36px)' }}>See your soulmate before you meet them</div>
          <p style={{ fontSize: 15, color: 'var(--ts)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 0' }}>
            Enter your name and birth date. We&apos;ll run real calculations across 5 spiritual systems and show
            your partial soulmate profile — right here, no account needed.
          </p>
          <div className="ft-row">
            <input
              className="ft-inp"
              type="text"
              placeholder="Your name"
              autoComplete="given-name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="ft-inp"
              type="date"
              max={today}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <button
              onClick={getFreeReading}
              disabled={loading}
              className="bl bp"
              style={{ flex: '0 0 auto', padding: '13px 28px', fontSize: 15, cursor: 'pointer', border: 'none', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? '⏳ Calculating…' : '✨ Get My Reading'}
            </button>
          </div>
          {err && <div className="ft-err show">{err}</div>}
          {loading && (
            <div className="ft-loading show">
              <div style={{ fontSize: 28, marginBottom: 10, display: 'inline-block', animation: 'pd 1s ease-in-out infinite' }}>🔮</div>
              <div>Calculating your cosmic blueprint…</div>
            </div>
          )}
          {result && !loading && (
            <div className="ft-result show" ref={resultRef}>
              <div>
                <div className="conf-row">
                  <div style={{ fontSize: 12, color: 'var(--tm)', whiteSpace: 'nowrap' }}>Profile accuracy</div>
                  <div className="conf-bar2"><div className="conf-fill2" id="conf-anim" style={{ width: 0 }}></div></div>
                  <div className="conf-pct2">{result.confidence ?? 55}%</div>
                </div>
                <div className="bps">
                  {(result.blueprint?.sections ?? []).map((sec, i) => (
                    <div key={i} className="bpsec">
                      <h4>{sec.emoji} {sec.title}</h4>
                      <p>{sec.summary}</p>
                      {sec.details && (() => {
                        const dets = Object.entries(sec.details!).filter(([, v]) => v && typeof v !== 'object' && !String(v).startsWith('🔒'));
                        return dets.length ? (
                          <div className="bpdet">
                            {dets.map(([k, v]) => (
                              <span key={k}>{k.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}: {String(v)}</span>
                            ))}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  ))}
                  {(result.lockedSections ?? []).map((sec, i) => (
                    <div key={i} className="bpsec bplocked">
                      <h4>🔒 {sec.title}</h4>
                      <p>{sec.description}</p>
                    </div>
                  ))}
                </div>
                <div className="bpfork">
                  <p>
                    Your profile is <strong>{result.confidence ?? 55}% complete</strong>. Sign up and answer 6 short
                    questionnaires to reach <strong>93%</strong> accuracy — then your Soulmate Radar activates.
                  </p>
                  <a href={appStoreUrl} className="bl bp" style={{ display: 'inline-flex', padding: '13px 28px', fontSize: 15, textDecoration: 'none' }}>
                    🚀 Complete My Profile Free
                  </a>
                </div>
              </div>
            </div>
          )}
          {!result && !loading && (
            <div className="ft-chips">
              <div className="ft-chip"><Hash size={15} weight="bold" /> Numerology</div>
              <div className="ft-chip"><Sun size={15} weight="bold" /> Mayan Kin</div>
              <div className="ft-chip"><Planet size={15} weight="bold" /> Astrology</div>
              <div className="ft-chip"><Leaf size={15} weight="bold" /> Elemental</div>
              <div className="ft-chip"><Scroll size={15} weight="bold" /> Past Life</div>
              <div className="ft-chip" style={{ color: 'rgba(255,255,255,.35)' }}>+ 11 more with quizzes</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
