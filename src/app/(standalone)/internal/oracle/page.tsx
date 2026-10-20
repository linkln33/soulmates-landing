/**
 * Internal review page for the Oracle component (not linked anywhere, not in
 * the sitemap, noindex, and a 404 in production builds). Shows every variant
 * at 40, 64 and 120 px plus the card in both states. `?theme=light|dark`
 * pins the theme for review; otherwise it follows local time like the site.
 * Screenshots: scripts/oracle-screenshots.mjs.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OracleBadge, OracleCard, OracleOrb, ORACLE_SIZES, type OracleVariant } from '@/components/oracle';
import './demo.css';

export const metadata: Metadata = {
  title: 'Oracle component (internal)',
  robots: { index: false, follow: false },
};

const VARIANTS: { variant: OracleVariant; label: string }[] = [
  { variant: 'main', label: 'Oracle' },
  { variant: 'ask', label: 'Ask' },
  { variant: 'connection', label: 'Connection' },
];

const PIN_THEME = `(function(){try{var t=new URLSearchParams(location.search).get('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

export default function OracleDemoPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <main className="oracle-demo">
      <script dangerouslySetInnerHTML={{ __html: PIN_THEME }} />
      <h1>Oracle component</h1>
      <p className="oracle-demo__note">Internal review only. Not linked, not indexed, unavailable in production builds.</p>

      <section aria-labelledby="sizes">
        <h2 id="sizes">Variants and sizes</h2>
        <div className="oracle-demo__grid">
          {VARIANTS.map(({ variant, label }) =>
            Object.entries(ORACLE_SIZES).map(([name, px]) => (
              <div key={`${variant}-${name}`} className="oracle-demo__cell" data-shot={`${variant}-${px}`}>
                <OracleBadge variant={variant} size={px} label={label} />
              </div>
            )),
          )}
        </div>
      </section>

      <section aria-labelledby="interactive">
        <h2 id="interactive">As a link (hover or press for the glow compression)</h2>
        <div className="oracle-demo__row">
          {VARIANTS.map(({ variant, label }) => (
            <a key={variant} href="#interactive" className="oracle-press oracle-demo__link" data-shot={`link-${variant}`}>
              <OracleOrb variant={variant} size="small" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="cards">
        <h2 id="cards">Card</h2>
        <div className="oracle-demo__row">
          <div data-shot="card-available">
            <OracleCard availability="available" href="#cards" description="A quiet space to reflect on your own readings." />
          </div>
          <div data-shot="card-unavailable">
            <OracleCard availability="unavailable" variant="ask" description="A quiet space to reflect on your own readings." />
          </div>
          <div data-shot="card-connection">
            <OracleCard availability="unavailable" variant="connection" title="Oracle for a match" />
          </div>
        </div>
      </section>
    </main>
  );
}
