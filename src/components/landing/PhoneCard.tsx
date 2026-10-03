import { Radio, Sparkles } from 'lucide-react';

/** Product-faithful preview: private Radar, daily Oracle, one match only. */
export default function PhoneCard() {
  return (
    <div className="po" style={{ position: 'relative', width: 390, height: 750 }}>
      <div className="fc2 fcl">
        <div className="fc-label">Private matching</div>
        <div className="fc-score" style={{ fontSize: 28 }}>No public search</div>
        <div className="fc-rows">
          <div className="fc-row"><span className="fc-sys">Reciprocal preferences</span><span className="fc-pct">✓</span></div>
          <div className="fc-row"><span className="fc-sys">Deep compatibility</span><span className="fc-pct">✓</span></div>
          <div className="fc-row"><span className="fc-sys">One connection</span><span className="fc-pct">✓</span></div>
        </div>
      </div>

      <div className="fc2 fct">
        <div className="fc-notif-header">
          <div className="fc-notif-icon"><Sparkles size={12} /></div>
          <span className="fc-notif-app">Soulmates Quest</span>
          <div className="fc-notif-dot" />
          <span className="fc-notif-time">now</span>
        </div>
        <div className="fc-notif-body">
          <div className="fc-notif-avatar">✦</div>
          <div className="fc-notif-content">
            <div className="fc-notif-title">A mutual alignment arrived</div>
            <div className="fc-notif-sub">Your private connection is ready</div>
          </div>
        </div>
      </div>

      <div className="fc2 fcr">
        <div className="fc-oracle-header">
          <div className="fc-oracle-ball"><span className="fc-oracle-glyph">🔮</span><div className="fc-oracle-ring" /></div>
          <div>
            <div className="fc-oracle-title">Daily Oracle</div>
            <div className="fc-oracle-status"><span className="fc-oracle-pulse" />Ready while you wait</div>
          </div>
        </div>
        <div className="fc-oracle-line" />
        <div className="fc-oracle-reading">Personal guidance from your calculated spiritual profile—valuable from your very first day.</div>
      </div>

      <div className="pw">
        <div className="ps">
          <div className="pn" />
          <div className="psc" style={{ background: 'linear-gradient(180deg,#0b0920,#17102f)' }}>
            <div className="pst"><span>9:41</span><span>●●●</span></div>
            <div style={{ padding: '44px 22px 18px', textAlign: 'center' }}>
              <div style={{ width: 110, height: 110, borderRadius: 60, margin: '18px auto', display: 'grid', placeItems: 'center', border: '1px solid rgba(167,139,250,.45)', background: 'rgba(124,58,237,.16)', boxShadow: '0 0 45px rgba(124,58,237,.3)' }}>
                <Radio size={48} color="#c4b5fd" />
              </div>
              <div style={{ color: '#a78bfa', letterSpacing: 2, fontSize: 11, fontWeight: 800 }}>RADAR ACTIVE</div>
              <h3 style={{ color: 'white', fontSize: 24, lineHeight: 1.2, margin: '12px 0' }}>We are listening for your match</h3>
              <p style={{ color: '#aaa4c0', fontSize: 13, lineHeight: 1.55, margin: 0 }}>No swiping. No public intentions. The Oracle quietly checks mutual preferences and deep compatibility.</p>

              <div style={{ marginTop: 24, padding: 16, borderRadius: 16, textAlign: 'left', background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9e97b5', fontSize: 12 }}><span>Profile visibility</span><strong style={{ color: '#5eead4' }}>Private · Active</strong></div>
                <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '13px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9e97b5', fontSize: 12 }}><span>Matching mode</span><strong style={{ color: 'white' }}>Reciprocal</strong></div>
              </div>

              <div style={{ marginTop: 16, padding: 15, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', background: 'rgba(124,58,237,.15)', border: '1px solid rgba(167,139,250,.25)' }}>
                <span style={{ fontSize: 25 }}>🔮</span>
                <div><strong style={{ color: 'white', fontSize: 13 }}>Today&apos;s Oracle is ready</strong><div style={{ color: '#9e97b5', fontSize: 11, marginTop: 3 }}>Guidance while Radar works</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
