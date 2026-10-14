import type { Metadata } from 'next';
import Link from 'next/link';
import './landing.css';
import Stars from '@/components/landing/Stars';
import PhoneCard from '@/components/landing/PhoneCard';
import FreeTaste from '@/components/landing/FreeTaste';
import SiteNav from '@/components/landing/SiteNav';
import SiteFooter from '@/components/landing/SiteFooter';
import { Ico } from '@/components/landing/PhosphorIco';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      {/* Background */}
      <div className="bgo">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
      </div>
      <Stars />

      <SiteNav />

      {/* HERO */}
      <section className="lsection">
        <div className="hero">
          {/* LEFT: text */}
          <div className="hero-text">
            <div className="badge"><span className="bd" />&nbsp;Dating app in preparation</div>
            <h1><span className="gr">Step Outside<br />Your Usual Circles</span></h1>
            <p className="hs">
              Somewhere along the way, love got reduced to a photo and an opening line —
              a face that passes a three-second test or disappears forever.
              <br /><br />
              The person who belongs with you won&apos;t be found in a photo. They live in the way they think,
              the way they&apos;ve been shaped by everything life handed them. We&apos;re building a place that asks
              those questions — and while the app is prepared for a private pilot, the free reading below works today.
            </p>
            <div className="hb">
              <a href="#free-taste" className="bl bp">Get your free reading</a>
              <Link href="/app" className="p-cta free" style={{ padding: '13px 24px' }}>App status</Link>
            </div>
            <div className="sr">
              <div className="sc"><div className="sn" style={{fontSize:'30px',lineHeight:'1'}}>🔮</div><div className="sl">Free reading, no account</div></div>
              <div className="sc"><div className="sn sg">3</div><div className="sl">Calculations in the free reading</div></div>
              <div className="sc"><div className="sn sg">1</div><div className="sl">Introduction at a time (planned)</div></div>
              <div className="sc"><div className="sn sg">0</div><div className="sl">Swiping, by design</div></div>
            </div>
          </div>
          {/* RIGHT: phone */}
          <div className="hero-phone">
            <PhoneCard />
          </div>
        </div>
      </section>

      {/* FREE TASTE */}
      <FreeTaste />

      {/* WHAT WE WANT TO DO DIFFERENTLY */}
      <section className="feat-s lsection">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="sl2">Why We&apos;re Building This</div>
            <div className="st">WHAT WE WANT<br />TO DO DIFFERENTLY</div>
            <p className="ss" style={{ margin: '0 auto', maxWidth: 900 }}>Common frustrations with online dating — and how the pilot app is being designed to respond. These are design goals, not finished features.</p>
          </div>
          <div className="why-grid">
            {[
              {
                pain: 'Judged in 3 seconds — on looks alone',
                fix: 'A compatible person might never pass a photo test',
                how: 'The app is being designed to describe compatibility from values, personality and life patterns, so looks are not the first filter.',
              },
              {
                pain: 'Endless scrolling, few real conversations',
                fix: 'Volume can feel like progress but lead nowhere',
                how: 'The pilot is planned around one introduction at a time, so the aim is to get you off the app, not keep you on it.',
              },
              {
                pain: '100 matches, 0 real connections',
                fix: 'Parallel conversations dilute attention',
                how: 'One person at a time, with no parallel introductions, is a core part of the design.',
              },
              {
                pain: 'Every conversation dies at "hey"',
                fix: 'Small talk has no structure — so it just stops',
                how: 'Each introduction is planned to come with understandable reasons why the two of you might fit, which gives a first conversation somewhere to start.',
              },
              {
                pain: 'Miss a week and everyone moved on',
                fix: 'Constant checking is exhausting',
                how: 'The plan: describe who you are looking for once, then wait quietly while we look for a real, consenting person who fits. We cannot promise when, or whether, someone will appear.',
              },
              {
                pain: 'Your profile tells people nothing',
                fix: 'Four photos and a bio cannot explain who you are',
                how: 'Profiles are being designed around values and dealbreakers rather than photos alone.',
              },
            ].map(({ pain, fix, how }) => (
              <div key={pain} className="why-card">
                <div className="why-problem">
                  <div className="why-x">✕</div>
                  <div>
                    <div className="why-pain">{pain}</div>
                    <div className="why-fix">{fix}</div>
                  </div>
                </div>
                <div className="why-divider" />
                <div className="why-solution">
                  <div className="why-check">✦</div>
                  <div className="why-how">{how}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE THINGS STAND */}
      <section className="how-s lsection">
        <div className="wrap">
          <div style={{ textAlign: 'center' }}>
            <div className="sl2">Where Things Stand</div>
            <div className="st">What works today,<br />and what is planned</div>
          </div>
          <div className="srow">
            {[
              ['Free reading — available now','Enter your first name and birth date to see your numerology numbers, sun sign and element, and a symbolic past-life archetype. No account needed, and we do not store what you enter.'],
              ['Pilot app — in preparation','We are preparing a private pilot of the mobile app. It is not in the App Store or Google Play yet, and we are not promising a date.'],
              ['Introductions — planned','In the pilot, the app is being designed to suggest one introduction at a time between real, consenting members, with chat opening only after both people accept.'],
            ].map(([title, desc], i) => (
              <div key={title} className="step">
                <div className="snum">{i+1}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONE INTRODUCTION AT A TIME (PLANNED) */}
      <section className="status-s lsection">
        <div className="wrap">
          <div style={{textAlign:'center'}}>
            <div className="sl2">Planned for the pilot · One introduction at a time</div>
            <div className="st">Intentional connection,<br />not infinite scroll</div>
            <p className="ss" style={{margin:'0 auto'}}>No swiping and no browsing. This is how the pilot app is being designed to work.</p>
          </div>
          <div className="flow-g" style={{gridTemplateColumns:'repeat(2,1fr)',maxWidth:560}}>
            <div className="flow">
              <div className="flow-ic"><Ico k="heart" s={56} /></div>
              <div className="flow-name">Waiting</div>
              <div className="flow-dur">Quiet search</div>
              <div className="flow-desc">You describe who you are looking for. Nobody browses your profile.</div>
            </div>
            <div className="flow" style={{borderRadius:'0 24px 24px 0',borderLeft:'none'}}>
              <div className="flow-ic"><Ico k="lock" s={56} /></div>
              <div className="flow-name">Introduced</div>
              <div className="flow-dur">One at a time</div>
              <div className="flow-desc">If both people accept the introduction, chat opens. No parallel introductions.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-s lsection">
        <div className="ci">
          <h2>Start with the<br /><span style={{background:'linear-gradient(135deg,#C084FC,#f472b6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>free reading</span></h2>
          <p>The app is not available yet. Pricing has not been set; the pilot is free.</p>
          <div className="sbs">
            <a href="#free-taste" className="bl bp">Get your free reading</a>
            <Link href="/app" className="p-cta free" style={{ padding: '13px 24px' }}>App status</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
