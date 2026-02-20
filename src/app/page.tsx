import './landing.css';
import Stars from '@/components/landing/Stars';
import PhoneCard from '@/components/landing/PhoneCard';
import FreeTaste from '@/components/landing/FreeTaste';
import { Ico } from '@/components/landing/PhosphorIco';

const APP_URL  = 'https://limewire.com/d/GjWGY#J68L6xtGKk';
const PLAY_URL = 'https://limewire.com/d/GjWGY#J68L6xtGKk';

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

      {/* NAV */}
      <nav className="lnav">
        <a href="/" className="nl">
          <div className="ni"><img src="/logo.png" alt="Soulmates Quest" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'10px'}} /></div>Soulmates Quest
        </a>
        <a href={APP_URL} className="nc">Download App</a>
      </nav>

      {/* HERO */}
      <section className="lsection">
        <div className="hero">
          {/* LEFT: text */}
          <div className="hero-text">
            <div className="badge"><span className="bd" />&nbsp;Oracle-First Dating</div>
            <h1><span className="gr">Find Your<br />Perfect Match</span></h1>
            <p className="hs">
              Somewhere along the way, love got reduced to a photo and an opening line —
              a face that passes a three-second test or disappears forever.
              <br /><br />
              The soul that belongs with yours won't be found in a photo. It lives in the way they think,
              the way they've been shaped by everything life handed them. We built a place that asks those questions.
            </p>
            <div className="hb">
              <a href={APP_URL} className="store-badge-link">
                <img src="/images/badge-appstore.svg" alt="Download on the App Store" className="store-badge" />
              </a>
              <a href={PLAY_URL} className="store-badge-link">
                <img src="/images/badge-googleplay.svg" alt="Get it on Google Play" className="store-badge" />
              </a>
            </div>
            <div className="sr">
              <div className="sc"><div className="sn" style={{fontSize:'30px',lineHeight:'1'}}>🔮</div><div className="sl">Divine Oracle</div></div>
              <div className="sc"><div className="sn sg">93–100%</div><div className="sl">Match Score</div></div>
              <div className="sc"><div className="sn sg">7</div><div className="sl">Daily Oracle Cards</div></div>
              <div className="sc"><div className="sn sg">1</div><div className="sl">Match at a Time</div></div>
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

      {/* WHY DATING NEEDS AN UPDATE */}
      <section className="feat-s lsection">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="sl2">The Real Problem</div>
            <div className="st">DATING APPS HAVE<br />A BROKEN MODEL</div>
            <p className="ss" style={{ margin: '0 auto', maxWidth: 900 }}>Swiping apps were never designed to find you love.<br />They were designed to keep you scrolling. Here&apos;s the honest breakdown — and what we do differently.</p>
          </div>
          <div className="why-grid">
            {[
              {
                pain: 'You judge in 3 seconds — on looks alone',
                fix: 'Your most compatible person might never pass a photo test',
                how: 'We build compatibility from who you are inside — values, personality, life patterns. Looks are never the filter.',
              },
              {
                pain: 'Your loneliness is their business model',
                fix: 'Apps profit from keeping you single and scrolling',
                how: 'We are built to get you out of the app. One match at a time means we win only when you do.',
              },
              {
                pain: '100 matches, 0 real connections',
                fix: 'Volume feels like progress but leads nowhere',
                how: 'One person in front of you. Full focus for 7 days. No parallel conversations diluting your attention.',
              },
              {
                pain: 'Every conversation dies at "hey"',
                fix: 'Small talk has no structure — so it just stops',
                how: 'Your shared compatibility profile gives you real things to explore from day one. The hard questions are already answered.',
              },
              {
                pain: 'You disappear when you log off',
                fix: 'Miss a week and your matches moved on',
                how: 'Set your threshold once. We watch for your match forever — and notify you the moment they arrive, even months from now.',
              },
              {
                pain: 'Your profile tells people nothing',
                fix: 'Four photos and a bio cannot explain who you are',
                how: 'A rich profile built from personality science and lived experience tells the full story — for people who actually care to read it.',
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

      {/* HOW IT WORKS */}
      <section className="how-s lsection">
        <div className="wrap">
          <div style={{ textAlign: 'center' }}>
            <div className="sl2">The Journey</div>
            <div className="st">From stranger to soulmate<br />in three steps</div>
          </div>
          <div className="srow">
            {[
              ['Free Reading','Enter your name and birth date. Instantly receive a partial soulmate profile — no account needed. Shareable to stories.'],
              ['Complete Your Profile','Sign up and answer short questionnaires about your personality, values, and life patterns. Unlock your full soulmate profile at 100%.'],
              ['Daily Oracle + Matching','Personalized oracle readings every morning. Get notified the moment a high-compatibility match joins — even months from now.'],
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

      {/* THE DIVINE ORACLE */}
      <section className="sys-s lsection">
        <div className="wrap">
          <div className="oracle-prose-wrap">
            <img src="/images/crystal-ball.png" alt="Crystal Ball" className="oracle-big-icon" />
            <div className="oracle-prose-text">
              <div className="sl2">Your Daily Companion</div>
              <div className="st" style={{marginBottom:24}}>The Divine Oracle</div>
              <div className="oracle-prose">
                <p>Every morning, before you check a single notification, seven personal readings are already waiting for you. Not horoscope columns written for everyone born in the same month — insights drawn specifically from the exact moment you came into the world.</p>
                <p>The oracle reads the sky, the cards, and the numbers. It looks at where you are in the larger cycles of your life and distills everything into clear, plain language you can actually use today. No charts to decode. No jargon. Just a quiet message that belongs only to you.</p>
                <p>The same oracle that reads you, reads every person on the platform. When two people&apos;s patterns align at a deep level, the connection is already half-made before they say hello.</p>
                <p>Three core readings are yours for free, every single day, forever. The oracle is not a feature. It is the foundation everything else is built on.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DAILY ORACLE */}
      <section className="orc-s lsection">
        <div className="wrap">
          <div style={{textAlign:'center'}}>
            <div className="sl2">Daily Oracle</div>
            <div className="st">Your morning ritual</div>
            <p className="ss" style={{margin:'0 auto'}}>Seven readings. All personal. All waiting before you open your eyes.</p>
          </div>
          <div className="oracle-big-card">
            {[
              ['planet','Daily Horoscope','Free',   'Which planets are touching your chart today — and what that means for love, energy, and decisions.'],
              ['cards','Tarot Pull','Free','One card drawn for your day. A short, honest reading — more like a mirror than a fortune.'],
              ['hash','Numerology','Free','Your personal day number. Some days are for starting things. Others are for letting go.'],
              ['lotus','Chakra Focus','Premium','Which of your 7 energy centers needs attention today. Practical and felt, not abstract.'],
              ['spiral','Gene Keys','Premium','One of your personal Gene Keys rotates each week. A contemplation that goes deep if you let it.'],
              ['/images/glyphs/glyph_05.svg','Mayan Oracle','Premium','Your Tzolkin kin energy for today — an ancient read of your day\'s tone and direction.'],
              ['moon','Vedic Moon','Premium','Where the Moon sits in your Vedic chart. The nakshatra it\'s in colors your emotional weather.'],
            ].map(([ic, title, tier, desc]) => (
              <div key={title} className="oracle-row">
                <div className="oracle-row-ic">
                  {ic.startsWith('/')
                    ? <img src={ic} className="oc2-glyph" style={{width:26,height:26,objectFit:'contain'}} alt="" />
                    : <Ico k={ic} s={26} />}
                </div>
                <div className="oracle-row-body">
                  <div className="oracle-row-title">{title}</div>
                  <div className="oracle-row-desc">{desc}</div>
                </div>
                <span className={`oc2-tier ${tier==='Free'?'oc2-free':'oc2-prem'}`}>{tier==='Free'?'● Free':'✦ Premium'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MATCH TIERS */}
      <section className="tier-s lsection">
        <div className="wrap">
          <div style={{textAlign:'center'}}>
            <div className="sl2">Match Score</div>
            <div className="st">Six levels of cosmic alignment</div>
            <p className="ss" style={{margin:'0 auto'}}>From Glowing Match to Perfect Match — every score maps to a named level shown consistently on match cards, notifications, and shared blueprints.</p>
          </div>
          <div className="tier-g">
            {[
              ['t-pm','Perfect Match',     '93%+',   'The rarest outcome — under 1% of all cross-matches reach this across all 16 systems. Triggers a VIP push alert + email the moment the match appears.'],
              ['t-em','Exceptional Match', '85–92%', 'Outstanding alignment across spiritual and behavioral systems. Surfaces with an urgent notification and priority position in discover.'],
              ['t-cm','Celestial Match',   '80–84%', 'Exceptional multi-system resonance across spiritual and behavioral layers. Priority notification sent immediately.'],
              ['t-dm','Divine Match',      '75–79%', 'Strong alignment across the core spiritual systems. Priority notification. The majority of lasting connections originate at this level.'],
              ['t-om','Outstanding Match', '65–74%', 'Meaningful alignment across several systems. Standard match notification. A genuine connection worth exploring with real long-term potential.'],
              ['t-gm','Glowing Match',     '55–64%', 'Shown in discover only — no notification. Complete more questionnaires to refine your profile and elevate a Glowing Match higher.'],
            ].map(([cls,name,pct,desc]) => (
              <div key={name} className={`tier ${cls}`}>
                <span className="tier-name">{name}</span>
                <span className="tier-pct">{pct}</span>
                <p className="tier-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATUS FLOW */}
      <section className="status-s lsection">
        <div className="wrap">
          <div style={{textAlign:'center'}}>
            <div className="sl2">One Match at a Time</div>
            <div className="st">Intentional connection,<br />not infinite scroll</div>
            <p className="ss" style={{margin:'0 auto'}}>No swiping fatigue. Each match gets your full attention. One connection at a time — intentional, not algorithmic.</p>
          </div>
          <div className="flow-g" style={{gridTemplateColumns:'repeat(2,1fr)',maxWidth:560}}>
            <div className="flow">
              <div className="flow-ic"><Ico k="heart" s={56} /></div>
              <div className="flow-name">Available</div>
              <div className="flow-dur">Discover</div>
              <div className="flow-desc">Swipe, browse, and connect. The network shows you one match at a time.</div>
            </div>
            <div className="flow" style={{borderRadius:'0 24px 24px 0',borderLeft:'none'}}>
              <div className="flow-ic"><Ico k="lock" s={56} /></div>
              <div className="flow-name">Taken</div>
              <div className="flow-dur">7 days</div>
              <div className="flow-desc">One match. Full focus. Incoming likes held in a hidden queue while you&apos;re committed.</div>
            </div>
          </div>
        </div>
      </section>

      {/* EXTRA FEATURES */}
      <section className="lsection" style={{padding:'0 24px 100px'}}>
        <div className="wrap">
          <div style={{textAlign:'center',marginBottom:52}}>
            <div className="sl2">More Features</div>
            <div className="st">Built for real-life connection</div>
          </div>
          <div className="extra-g">
            {[
              ['pin','GPS Check-in','Meeting your match in person? Both check in from the same location to verify the date happened. Builds trust, unlocks bonus time bank hours, and adds a real-world layer to digital connection.','linear-gradient(135deg,rgba(34,197,94,.2),rgba(16,185,129,.1))','1px solid rgba(34,197,94,.25)','#4ade80'],
              ['radar','Soulmate Radar','A background engine monitors every new signup. The moment someone above your threshold appears — even months later — you get an immediate push notification. Your oracle stays active while you wait.','linear-gradient(135deg,rgba(168,85,247,.2),rgba(99,102,241,.1))','1px solid rgba(168,85,247,.25)','var(--p3)'],
              ['lightning','Response Streaks + Time Bank','Consistent back-and-forth earns streak bonuses and deposits hours into your shared time bank — extending your 7-day match window. Meaningful conversation is literally rewarded.','linear-gradient(135deg,rgba(245,158,11,.2),rgba(239,68,68,.1))','1px solid rgba(245,158,11,.25)','#fbbf24'],
              ['refresh','Match Revival','A connection ended before its time? Premium members can revive a past match — re-opening the conversation window for a second chance. One revival per match.','linear-gradient(135deg,rgba(236,72,153,.2),rgba(168,85,247,.1))','1px solid rgba(236,72,153,.25)','#f472b6'],
            ].map(([ico,title,desc,bg,border,clr]) => (
              <div key={title} className="ecard">
                <div className="eico" style={{background:bg as string,border:border as string,color:clr as string}}><Ico k={ico} s={34} /></div>
                <div style={{width:'100%'}}>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="cmp-s lsection">
        <div className="wrap">
          <div style={{textAlign:'center'}}>
            <div className="sl2">The Landscape</div>
            <div className="st">How we compare</div>
            <p className="ss" style={{margin:'0 auto'}}>No other app combines deep spiritual profiling, behavioral psychology, daily oracle content, and actual dating in one place.</p>
          </div>
          <div className="cmp-wrap">
            <table className="cmp-t">
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <div className="cmp-logo">
                      <img src="/images/competitors/tinder-logo.jpg" alt="Tinder" />
                      <span>Tinder</span>
                    </div>
                  </th>
                  <th>
                    <div className="cmp-logo">
                      <img src="/images/competitors/hinge-logo.png" alt="Hinge" />
                      <span>Hinge</span>
                    </div>
                  </th>
                  <th>
                    <div className="cmp-logo">
                      <img src="/images/competitors/bumble-logo.png" alt="Bumble" />
                      <span>Bumble</span>
                    </div>
                  </th>
                  <th>
                    <div className="cmp-logo">
                      <img src="/images/competitors/boo-logo.jpeg" alt="Boo" />
                      <span>Boo</span>
                    </div>
                  </th>
                  <th>
                    <div className="cmp-logo">
                      <img src="/images/competitors/eharmony-logo.png" alt="eHarmony" />
                      <span>eHarmony</span>
                    </div>
                  </th>
                  <th className="us">
                    <div className="cmp-logo us-logo">
                      <img src="/logo.png" alt="Soulmates Quest" />
                      <span>Soulmates Quest</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {([
                  ['Dating & Matching',         true,    true,    true,    true,           true,           true],
                  ['Spiritual profiling',        false,   false,   false,   '~Zodiac only', false,          '16 systems'],
                  ['Personality matching',       false,   false,   false,   'MBTI + Enn.',  '32 dimensions','+ Behavioral'],
                  ['Daily oracle / insights',    false,   false,   false,   false,          false,          '7 cards / day'],
                  ['Free reading, no sign-up',   false,   false,   false,   false,          false,          true],
                  ['Value without a user pool',  false,   false,   false,   false,          false,          true],
                  ['Passive match alerts',       false,   false,   false,   false,          false,          true],
                  ['One curated match',          false,   false,   false,   false,          false,          '7-day focus'],
                  ['GPS meetup check-in',        false,   false,   false,   false,          false,          true],
                ] as [string, boolean|string, boolean|string, boolean|string, boolean|string, boolean|string, boolean|string][])
                .map(([label, ti, hi, bu, bo, eh, us]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    {([ti, hi, bu, bo, eh] as (boolean|string)[]).map((v, i) => (
                      <td key={i}>
                        {v === true  ? <span className="ck">✓</span>
                        : v === false ? <span className="cx">✗</span>
                        : typeof v === 'string' && v.startsWith('~')
                          ? <span className="cpart">{v.slice(1)}</span>
                          : <span className="cbasic">{v as string}</span>}
                      </td>
                    ))}
                    <td className="cus">
                      {us === true  ? <span className="ck">✓</span>
                      : us === false ? <span className="cx">✗</span>
                      : <span className="cus-v">{us as string}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="price-s lsection">
        <div className="wrap">
          <div style={{textAlign:'center'}}>
            <div className="sl2">Simple Pricing</div>
            <div className="st">Start free forever</div>
            <p className="ss" style={{margin:'0 auto'}}>Full oracle value and soulmate radar at no cost. Upgrade for deeper readings and premium features.</p>
          </div>
          <div className="price-g">
            <div className="pcard p-free">
              <div className="p-badge">Free — forever</div>
              <div className="p-price">€0</div>
              <div className="p-sub">No credit card needed</div>
              <ul className="p-list">
                {['Full soulmate blueprint (16 systems)','3 daily oracle cards (Horoscope · Tarot · Numerology)','Soulmate Radar alerts','One match at a time (7-day model)','Real-time cosmic chat','3 compatibility views per day','GPS check-in','Shareable soulmate stories'].map(i=><li key={i}>{i}</li>)}
              </ul>
              <a href={APP_URL} className="p-cta free">Download free</a>
            </div>
            <div className="pcard premium p-prem">
              <div className="p-badge">Oracle Premium</div>
              <div className="p-price"><span className="p-orig">€49.95</span>€19<span>.95/mo</span></div>
              <div className="p-sub">Everything in Free, plus:</div>
              <ul className="p-list">
                {['4 extra oracle systems (Mayan · Chakra · Gene Keys · Vedic)','Oracle AI Chat — conversational spiritual advisor','Extended Tarot (3-card + Celtic Cross spreads)','Unlimited compatibility breakdowns','Pre-Swipe Oracle insight before deciding','Match Revival — revive past connections','Time Bank Boost (72-hr max vs 12-hr)','Unlimited streak freezes','Priority matching + Incognito mode','Monthly Past Life deep readings'].map(i=><li key={i}>{i}</li>)}
              </ul>
              <a href={APP_URL} className="p-cta prem">Get Oracle Premium</a>
            </div>
            <div className="pcard cards p-sc">
              <div className="p-badge">Soul Cards</div>
              <div className="p-price">€4<span>.99</span></div>
              <div className="p-sub">Per card — or save in packs</div>
              <ul className="p-list">
                {['Exchange real contact info with your match','Take the connection beyond the app','3 cards — €9.99','5 cards — €14.99','10 cards — €24.99'].map(i=><li key={i}>{i}</li>)}
              </ul>
              <a href={APP_URL} className="p-cta sc">Get Soul Cards</a>
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ CTA */}
      <section className="qsec lsection">
        <div className="wrap">
          <div className="qi">
            <div className="sl2" style={{marginBottom:16}}>Soulmate Quiz</div>
            <h2>Send your friends<br />a cosmic quiz</h2>
            <p>Create a quiz, add your personal <strong>Lexicon</strong> — custom questions only you can ask — then share the link. Anyone who takes it gets a full 16-system compatibility reading against your profile.</p>
            <a href={APP_URL} className="bl bp" style={{display:'inline-flex',gap:8,alignItems:'center'}}><Ico k="sparkle" s={20} />Create Your Quiz</a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-s lsection">
        <div className="ci">
          <h2>Your soulmate is<br /><span style={{background:'linear-gradient(135deg,#C084FC,#f472b6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>already out there</span></h2>
          <p>Join and we&apos;ll alert you the moment someone above 75% compatibility appears. Free daily oracle while you wait.</p>
          <div className="sbs">
            <a href={APP_URL} className="store-badge-link">
              <img src="/images/badge-appstore.svg" alt="Download on the App Store" className="store-badge store-badge-lg" />
            </a>
            <a href={PLAY_URL} className="store-badge-link">
              <img src="/images/badge-googleplay.svg" alt="Get it on Google Play" className="store-badge store-badge-lg" />
            </a>
          </div>
        </div>
      </section>

      <footer className="lfooter">
        <p>
          © {new Date().getFullYear()} Soulmates Quest &nbsp;·&nbsp;{' '}
          <a href="/quiz">Soulmate Quiz</a> &nbsp;·&nbsp;{' '}
          <a href="mailto:hello@soulmates.quest">hello@soulmates.quest</a>
        </p>
      </footer>
    </>
  );
}
