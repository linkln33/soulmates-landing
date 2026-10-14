'use client';

import { useState, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Hash, Planet, Scroll } from '@phosphor-icons/react';
import { MIN_BIRTH_YEAR, todayInSofia, validateBirthDate } from '@/lib/blueprint/dates';

type DetailValue = string | number | null;
interface Section {
  key: string;
  emoji: string;
  title: string;
  summary: string;
  details?: Record<string, DetailValue>;
  notes?: string[];
}
interface BlueprintResponse {
  success: boolean;
  message?: string;
  blueprint?: { sections?: Section[] };
}

const NAME_MAX_LENGTH = 100;

const noSubscribe = () => () => {};

function label(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
}

export default function FreeTaste() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<BlueprintResponse | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Same rule as the server: the latest accepted birth date is today in
  // Europe/Sofia. Read on the client only (undefined during prerender), so a
  // build-time date is never baked into the picker's `max`.
  const sofiaToday = useSyncExternalStore(noSubscribe, () => todayInSofia(), () => undefined);

  async function getFreeReading() {
    setErr('');
    if (!name.trim()) { setErr('Please enter your name.'); return; }
    if (Array.from(name.trim()).length > NAME_MAX_LENGTH) {
      setErr(`Name must be at most ${NAME_MAX_LENGTH} characters.`);
      return;
    }
    if (!date) { setErr('Please enter your birth date.'); return; }
    const check = validateBirthDate(date, todayInSofia());
    if (!check.ok) { setErr(check.error); return; }

    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), birthDate: date }),
      });
      let data: BlueprintResponse | null = null;
      try {
        data = (await resp.json()) as BlueprintResponse;
      } catch {
        data = null;
      }
      if (!data || !resp.ok || !data.success) {
        throw new Error(data?.message || 'Something went wrong. Please try again.');
      }
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ft-s" id="free-taste">
      <div className="wrap">
        <div className="ft-inner">
          <div className="sl2">Free Reading — No Account Needed</div>
          <div className="st" style={{ fontSize: 'clamp(24px,4vw,36px)' }}>A free reading from your name and birth date</div>
          <p style={{ fontSize: 15, color: 'var(--ts)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 0' }}>
            Enter your first name and birth date. We calculate your numerology numbers, your sun sign and
            element, and a symbolic past-life archetype — right here, no account needed. What you enter is
            used only to calculate this reading and is not stored.
          </p>
          <div className="ft-row">
            <input
              className="ft-inp"
              type="text"
              placeholder="Your name"
              autoComplete="given-name"
              maxLength={200}
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="ft-inp"
              type="date"
              min={`${MIN_BIRTH_YEAR}-01-01`}
              max={sofiaToday}
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
          {err && <div className="ft-err show" role="alert">{err}</div>}
          {loading && (
            <div className="ft-loading show">
              <div style={{ fontSize: 28, marginBottom: 10, display: 'inline-block', animation: 'pd 1s ease-in-out infinite' }}>🔮</div>
              <div>Calculating your reading…</div>
            </div>
          )}
          {result && !loading && (
            <div className="ft-result show" ref={resultRef}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--tm)', lineHeight: 1.6, marginBottom: 16 }}>
                  These readings follow traditional numerology and Western sun-sign conventions. They are for
                  reflection and entertainment, not predictions.
                </p>
                <div className="bps">
                  {(result.blueprint?.sections ?? []).map((sec) => {
                    const dets = Object.entries(sec.details ?? {});
                    return (
                      <div key={sec.key} className="bpsec">
                        <h4>{sec.emoji} {sec.title}</h4>
                        <p>{sec.summary}</p>
                        {dets.length > 0 && (
                          <div className="bpdet">
                            {dets.map(([k, v]) => (
                              <span key={k}>{label(k)}: {v === null ? 'not calculated' : String(v)}</span>
                            ))}
                          </div>
                        )}
                        {(sec.notes ?? []).map((n) => (
                          <p key={n} style={{ fontSize: 12, color: 'var(--tm)', marginTop: 8 }}>{n}</p>
                        ))}
                        {sec.key === 'numerology' && (
                          <p id="numerology-convention" style={{ fontSize: 12, color: 'var(--tm)', marginTop: 8 }}>
                            * Latin letters use standard Pythagorean values. Bulgarian letters are scored with
                            our chosen convention: alphabet position reduced to 1–9 (а=1 … и=9, й=1 …). Other
                            conventions exist for Cyrillic names, and results differ between them.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="bpfork">
                  <p>
                    The Soulmates Quest app is being prepared for a private pilot and is not yet available
                    in the App Store or Google Play.
                  </p>
                  <Link href="/app" className="bl bp" style={{ display: 'inline-flex', padding: '13px 28px', fontSize: 15, textDecoration: 'none' }}>
                    App status
                  </Link>
                </div>
              </div>
            </div>
          )}
          {!result && !loading && (
            <div className="ft-chips">
              <div className="ft-chip"><Hash size={15} weight="bold" /> Numerology</div>
              <div className="ft-chip"><Planet size={15} weight="bold" /> Sun sign &amp; element</div>
              <div className="ft-chip"><Scroll size={15} weight="bold" /> Symbolic past-life archetype</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
