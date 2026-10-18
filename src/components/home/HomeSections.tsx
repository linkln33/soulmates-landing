/**
 * Homepage section after the free readings: one short, future-facing view of
 * the app, which is being prepared for a limited pilot. Matching mechanics,
 * compatibility details and scores stay off the site until the backend and
 * mobile release ships them (SoulMates-Quest-mobile/docs/MATCHES_MODEL.md).
 */
import { EyeSlash, HandHeart, Sparkle } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';

export function ConnectionSection({ lang }: { lang: Locale }) {
  const t = site(lang).home.connection;
  const icons = [EyeSlash, Sparkle, HandHeart];
  return (
    <section className="h-section h-tinted" aria-labelledby="connection-title">
      <div className="wrap stack-lg">
        <div className="h-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="connection-title" className="h-title">{t.title}</h2>
          <p className="lead">{t.lead}</p>
        </div>
        <ul className="h-grid h-grid-3">
          {t.points.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} className="h-card">
                <span className="h-icon h-icon-pink"><Icon weight="duotone" aria-hidden /></span>
                <h3 className="heading">{item.title}</h3>
                <p className="small muted">{item.body}</p>
              </li>
            );
          })}
        </ul>
        <p className="small subtle">{t.note}</p>
      </div>
    </section>
  );
}
