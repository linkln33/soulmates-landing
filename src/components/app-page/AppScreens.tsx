/**
 * Recreated app screens for the /app page, drawn in HTML and CSS from the
 * current mobile screens (SoulMates-Quest-mobile: app/(tabs)/index.tsx with
 * components/home/YourDayCard.tsx and DailyMetersCard.tsx; app/(tabs)/matches.tsx
 * with components/matches/MatchVisuals.tsx; app/chat/[matchId].tsx). Wording is
 * the app's own (lib/i18n/messages), copied into src/i18n/site/*.ts.
 *
 * Rules (owner, 19 Oct 2026): no compatibility score, percentage or type, no
 * automatic acceptance, concealed matches show only the abstract orb (no
 * photograph, not even blurred), and the people are fictional adults whose
 * portraits are owner-supplied AI images (assets/source/README.md).
 *
 * Each phone is one image to assistive technology (role="img" + a
 * description); the drawn text inside is hidden from it. Sizes inside a phone
 * are in container units, so a phone scales as one picture.
 */
import type { ReactNode } from 'react';
import {
  ArrowRight, CaretLeft, CaretRight, ChatCircleDots, ChatsCircle, FlowerLotus, GearSix, Heart,
  HourglassMedium, House, Lightning, MoonStars, PaperPlaneRight, ShieldCheck, SlidersHorizontal,
  Sparkle, Sun, SunHorizon, Target,
} from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';

type Screens = ReturnType<typeof site>['app']['screens'];

export function Phone({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`ps-phone ${className}`} role="img" aria-label={label}>
      <div className="ps-screen" aria-hidden>
        <div className="ps-status"><span>9:41</span><span className="ps-notch" /><span className="ps-battery" /></div>
        {children}
      </div>
    </div>
  );
}

/** Portrait of a fictional adult (public/app-page, 96/192/288 px). Below the hero, so lazy. */
function Portrait({ name, alt = '' }: { name: 'mila' | 'martin'; alt?: string }) {
  const set = (ext: string) => [96, 192, 288].map((w) => `/app-page/${name}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className="ps-portrait">
      <source type="image/avif" srcSet={set('avif')} sizes="(min-width: 1100px) 64px, 18vw" />
      <img src={`/app-page/${name}-192.webp`} srcSet={set('webp')} sizes="(min-width: 1100px) 64px, 18vw" width={96} height={96} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
}

function TabBar({ s, active }: { s: Screens; active: 0 | 1 | 2 }) {
  const icons = [House, Heart, ChatsCircle, GearSix];
  return (
    <div className="ps-tabs">
      {s.tabs.map((label, i) => {
        const Icon = icons[i];
        return (
          <span key={label} className={i === active ? 'is-active' : ''}>
            <Icon weight={i === active ? 'fill' : 'regular'} />
            <small>{label}</small>
          </span>
        );
      })}
    </div>
  );
}

/** The app's eight abstract orb gradients (CONCEALED_ORBS), never skin tones. */
function Orb({ variant, isNew = false, size = 'md' }: { variant: number; isNew?: boolean; size?: 'md' | 'lg' }) {
  return (
    <span className={`ps-orb ps-orb-${size} ps-orb-v${variant}`}>
      <span className="ps-orb-glow" />
      <span className={`ps-orb-heart${isNew ? ' is-new' : ''}`}><Heart weight="fill" /></span>
    </span>
  );
}

const METER_ICONS = [Lightning, Heart, Target, ChatCircleDots, FlowerLotus];
const METER_KEYS = ['energy', 'connection', 'focus', 'communication', 'balance'] as const;
const METER_LEVELS = [3, 4, 2, 3, 3];

export function HomeScreen({ lang }: { lang: Locale }) {
  const s = site(lang).app.screens;
  const tileIcons = [Sun, null, null, MoonStars];
  return (
    <>
      <div className="ps-body">
        <div className="ps-head">
          <div>
            <p className="ps-h1">{s.greeting}</p>
            <p className="ps-muted">{s.subtitle}</p>
          </div>
          <span className="ps-avatar-dot" />
        </div>
        <div className="ps-day">
          <span className="ps-day-glow" />
          <p className="ps-day-title"><Sparkle weight="fill" />{s.yourDay}</p>
          <p className="ps-day-text">{s.daySentence}</p>
          <div className="ps-day-foot">
            <span><SunHorizon weight="fill" />{s.daySources}</span>
            <span className="ps-round"><ArrowRight weight="bold" /></span>
          </div>
        </div>
        <div className="ps-card">
          <p className="ps-h2">{s.meters}</p>
          {METER_KEYS.map((key, i) => {
            const Icon = METER_ICONS[i];
            return (
              <div key={key} className={`ps-meter m-${key}`}>
                <Icon weight="fill" />
                <b>{s.meterNames[i]}</b>
                <span className="ps-bar">{[1, 2, 3, 4].map((n) => <i key={n} className={n <= METER_LEVELS[i] ? 'on' : ''} />)}</span>
                <small>{s.meterWords[i]}</small>
              </div>
            );
          })}
        </div>
        <p className="ps-h2">{s.explore}</p>
        <div className="ps-tiles">
          {s.tiles.map((tile, i) => {
            const Icon = tileIcons[i];
            return (
              <div key={tile.name} className={`ps-tile t-${i}`}>
                <span className="ps-tile-icon">{Icon ? <Icon weight="fill" /> : i === 1 ? <span className="ps-card-glyph" /> : <b>22</b>}</span>
                <span><b>{tile.name}</b><small>{tile.about}</small></span>
              </div>
            );
          })}
        </div>
      </div>
      <TabBar s={s} active={0} />
    </>
  );
}

function MatchesBody({ s }: { s: Screens }) {
  return (
    <div className="ps-body">
      <div className="ps-head">
        <p className="ps-h1">{s.matchesTitle}</p>
        <span className="ps-icon-btn"><SlidersHorizontal /></span>
      </div>
      <p className="ps-muted ps-text">{s.matchesIntro}</p>
      <p className="ps-label">{s.possible}</p>
      <p className="ps-small">{s.scoreNote}</p>
      <div className="ps-field">
        <div className="ps-row">
          <Orb variant={1} isNew />
          <b className="ps-new">{s.statusNew}</b>
          <CaretRight />
        </div>
        <div className="ps-row ps-row-in">
          <Orb variant={0} />
          <b className="ps-seen">{s.statusSeen}</b>
          <CaretRight />
        </div>
        <div className="ps-row">
          <Orb variant={3} />
          <span className="ps-stack"><b className="ps-wait"><HourglassMedium />{s.statusWaiting}</b><small>{s.youAccepted}</small></span>
          <CaretRight />
        </div>
      </div>
      <div className="ps-note"><ShieldCheck /><span>{s.identity}</span></div>
    </div>
  );
}

export function MatchesScreen({ lang }: { lang: Locale }) {
  const s = site(lang).app.screens;
  return (
    <>
      <MatchesBody s={s} />
      <TabBar s={s} active={1} />
    </>
  );
}

export function AcceptScreen({ lang }: { lang: Locale }) {
  const s = site(lang).app.screens;
  return (
    <>
      <MatchesBody s={s} />
      <TabBar s={s} active={1} />
      <div className="ps-scrim" />
      <div className="ps-sheet">
        <span className="ps-grabber" />
        <p className="ps-h2 ps-center">{s.sheetTitle}</p>
        <div className="ps-center-box"><Orb variant={1} size="lg" /></div>
        <p className="ps-muted ps-text">{s.sheetHidden}</p>
        <span className="ps-btn">{s.accept}</span>
      </div>
    </>
  );
}

export function ChatScreen({ lang }: { lang: Locale }) {
  const s = site(lang).app.screens;
  return (
    <>
      <div className="ps-chat-head">
        <CaretLeft />
        <Portrait name="mila" />
        <b>{s.otherName}</b>
      </div>
      <div className="ps-body ps-chat">
        <div className="ps-opened">
          <span className="ps-pair">
            <Portrait name="martin" />
            <span className="ps-pair-heart"><Heart weight="fill" /></span>
            <Portrait name="mila" />
          </span>
          <b>{s.opened}</b>
          <small>{s.bothAccepted}</small>
        </div>
        {s.messages.map((m) => (
          <p key={m.text} className={`ps-bubble${m.mine ? ' is-mine' : ''}`}>{m.text}</p>
        ))}
      </div>
      <div className="ps-composer"><span>{s.composer}</span><span className="ps-send"><PaperPlaneRight weight="fill" /></span></div>
    </>
  );
}
