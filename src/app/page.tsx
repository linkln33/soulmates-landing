import './landing.css';
import Stars from '@/components/landing/Stars';
import PhoneCard from '@/components/landing/PhoneCard';
import FreeTaste from '@/components/landing/FreeTaste';

const APP_URL  = 'https://apps.apple.com/app/id000000000';
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.soulmatesquest.app';

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
            <h1><span className="gr">Find Your<br />Cosmic Match</span></h1>
            <p className="hs">
              16 spiritual systems. Real calculations. One intentional match at a time —
              guided by astrology, Human Design, Mayan calendar &amp; more.
            </p>
            <div className="hb">
              <a href={APP_URL} className="store-badge-link">
                <img src="/images/badge-appstore.png" alt="Download on the App Store" className="store-badge" />
              </a>
              <a href={PLAY_URL} className="store-badge-link">
                <img src="/images/badge-googleplay.jpg" alt="Get it on Google Play" className="store-badge" />
              </a>
            </div>
            <div className="sr">
              <div><div className="sn sg">16</div><div className="sl">Spiritual Systems</div></div>
              <div><div className="sn sg">93%</div><div className="sl">Profile Accuracy</div></div>
              <div><div className="sn sg">7</div><div className="sl">Daily Oracle Cards</div></div>
              <div><div className="sn sg">1</div><div className="sl">Match at a Time</div></div>
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

      {/* FEATURES */}
      <section className="feat-s lsection">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="sl2">Why Soulmates Quest</div>
            <div className="st">Built different, by design</div>
            <p className="ss" style={{ margin: '0 auto' }}>Most apps show you a grid of faces. We show you one carefully chosen match at a time.</p>
          </div>
          <div className="fg3">
            <div className="fcard pillar">
              <div className="fico">🧮</div>
              <h3>Real calculations, not AI fluff</h3>
              <p>Your birth date powers actual Swiss Ephemeris computations. Every synastry score, nakshatra, Gene Key, and Mayan sign is calculated in real-time — not generic lookup tables.</p>
              <div className="cr">
                <span className="chip">Swiss Ephemeris</span><span className="chip">Synastry Engine</span>
                <span className="chip">Gene Keys</span><span className="chip">Human Design</span>
              </div>
            </div>
            <div className="fcard pillar">
              <div className="fico">🎯</div>
              <h3>One match at a time</h3>
              <p>No infinite scroll. No swiping fatigue. One carefully chosen match per week — then you decide. Intentional connection over dopamine loops.</p>
            </div>
            <div className="fcard pillar">
              <div className="fico">🌅</div>
              <h3>Daily Oracle — always on</h3>
              <p>7 personalized readings every morning based on your actual spiritual profile. Works even with zero matches. Horoscope, Tarot, Chakra, Vedic Moon and more.</p>
            </div>
          </div>
          <div className="fg-groups">
            <div className="fg-group">
              <div className="fg-group-label">🔮 Intelligence &amp; Matching</div>
              <div className="fg-group-cards">
                {[
                  ['🔔','Reverse-Match Engine','Background engine monitors every new signup. You get a push the moment someone above your threshold joins.'],
                  ['✨','Free Soulmate Reading','No account required. Partial profile from 5 spiritual systems. Shareable to Instagram stories.'],
                  ['⭐','Trust Score','Earned from feedback, GPS check-ins, and response reliability. Verified &amp; Trustworthy badges on every card.'],
                  ['🌟','Profile Tiers','Bronze → Silver → Gold → Platinum. Complete quizzes to rank up and unlock more precise scoring.'],
                ].map(([ico,title,desc]) => (
                  <div key={title} className="fcard compact">
                    <div className="fico sm">{ico}</div>
                    <h3>{title}</h3>
                    <p dangerouslySetInnerHTML={{__html: desc}} />
                  </div>
                ))}
              </div>
            </div>
            <div className="fg-group">
              <div className="fg-group-label">💎 Premium Experience</div>
              <div className="fg-group-cards">
                {[
                  ['🌈','Aura Visualization','Each zodiac sign mapped to an aura color — glowing radial overlay behind your card. Energy compatibility at a glance.'],
                  ['🔮','Pre-Swipe Oracle','"This person\'s Gene Key 22 harmonizes with your Key 47." Decide with soul, not just attraction.'],
                  ['📍','GPS Check-in','Verify you met your match IRL. Proximity-based check-in builds trust and unlocks bonus connection time.'],
                  ['🕵️','Incognito Mode','Browse compatibility without appearing in anyone\'s Discover feed. Radar stays on, presence stays hidden.'],
                ].map(([ico,title,desc]) => (
                  <div key={title} className="fcard compact">
                    <div className="fico sm">{ico}</div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="feat-strip">
            {['🎴 Soul Cards','💬 Real-time Cosmic Chat','⭐️ Post-Match Feedback','💌 Invite &amp; Referral','🛡️ Privacy-First'].map(pill => (
              <div key={pill} className="feat-pill" dangerouslySetInnerHTML={{__html:`<span>${pill.split(' ')[0]}</span> ${pill.slice(pill.indexOf(' ')+1)}`}} />
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
              ['Free Reading','Enter your name and birth date. Instantly receive a partial soulmate profile from 5 spiritual systems — no account needed. ~55% confidence. Shareable to stories.'],
              ['Complete Your Profile','Sign up and answer 6 behavioral questionnaires — love language, attachment style, values and more. Unlock your full ~93% confidence soulmate profile.'],
              ['Daily Oracle + Matching','7 personalized oracle readings every morning. Get notified the moment a high-compatibility match joins — even months from now.'],
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

      {/* 16 SYSTEMS */}
      <section className="sys-s lsection">
        <div className="wrap">
          <div style={{ textAlign: 'center' }}>
            <div className="sl2">The Science &amp; Spirit</div>
            <div className="st">16 systems, one truth</div>
            <p className="ss" style={{ margin: '0 auto' }}>Every major spiritual tradition, combined into a single compatibility score.</p>
          </div>
          <div className="sys-panels">
            <div className="sys-panel sys-panel-spirit">
              <div className="sys-panel-hdr">
                <span className="sys-panel-icon">✦ FROM THE STARS</span>
                <div>
                  <div className="sys-panel-title">Spiritual Systems</div>
                  <div className="sys-panel-sub">Computed from birth data — no quiz needed</div>
                </div>
                <span className="sys-panel-count">10</span>
              </div>
              <div className="sys-list">
                {[
                  ['♈','Western Astrology','Natal chart + Synastry','Free'],
                  ['🌙','Vedic / Jyotish','Moon nakshatra · Guna Milan','Premium'],
                  ['🔢','Numerology','Life Path · Expression','Free'],
                  ['🃏','Tarot','Birth card pairing','Free'],
                  ['⚙️','Human Design','Type · Profile · Gates','Premium'],
                  ['🌿','Gene Keys','4 personal spheres','Premium'],
                  ['🏛️','Mayan Calendar','Kin glyph · Wavespell','Premium'],
                  ['🌸','Chakra Analysis','7-center energy pattern','Premium'],
                  ['🔥','Elemental','Fire · Earth · Air · Water','Free'],
                  ['🕊️','Past Life / Karmic','Karmic nodes · soul lesson','Premium'],
                ].map(([em,name,desc,tier]) => (
                  <div key={name} className="sys-row">
                    <span className="sys-em">{em}</span>
                    <div className="sys-info">
                      <span className="sys-name">{name}</span>
                      <span className="sys-desc">{desc}</span>
                    </div>
                    <span className={tier==='Free'?'fb2':'pb'}>{tier}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sys-panel sys-panel-behav">
              <div className="sys-panel-hdr">
                <span className="sys-panel-icon" style={{color:'#a5b4fc'}}>✦ FROM YOUR HEART</span>
                <div>
                  <div className="sys-panel-title">Behavioral Systems</div>
                  <div className="sys-panel-sub">Unlocked via questionnaires on sign-up</div>
                </div>
                <span className="sys-panel-count">6</span>
              </div>
              <div className="sys-list">
                {[
                  ['💬','Love Language','5-scale · give vs receive'],
                  ['🪢','Attachment Style','Secure · Anxious · Avoidant'],
                  ['🧠','Big Five','OCEAN personality domains'],
                  ['🌍','Values Alignment','Goals · dealbreakers'],
                  ['🌅','Lifestyle','Rhythm · social · activities'],
                  ['🧘','Consciousness','Hawkins scale · soul age'],
                ].map(([em,name,desc]) => (
                  <div key={name} className="sys-row">
                    <span className="sys-em">{em}</span>
                    <div className="sys-info">
                      <span className="sys-name">{name}</span>
                      <span className="sys-desc">{desc}</span>
                    </div>
                    <span className="fb2">Free</span>
                  </div>
                ))}
              </div>
              <div style={{padding:'14px 20px',borderTop:'1px solid rgba(255,255,255,.06)',background:'rgba(99,102,241,.06)'}}>
                <p style={{fontSize:12,color:'var(--tm)',lineHeight:1.55,margin:0}}>
                  🎯 Each questionnaire takes ≈3 minutes. Complete all 6 to reach{' '}
                  <strong style={{color:'#a5b4fc'}}>~93% profile confidence</strong> and unlock the most precise match scoring.
                </p>
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
            <div className="st">Your cosmic inbox,<br />every morning</div>
            <p className="ss" style={{margin:'0 auto'}}>7 personalized readings based on your actual spiritual profile — not generic content.</p>
          </div>
          <div className="og">
            {[
              ['oc1','♈','Daily Horoscope','Personalized transit reading','Free'],
              ['oc2','🃏','Tarot Pull','Your card of the day','Free'],
              ['oc3','🔢','Numerology','Personal day number','Free'],
              ['oc4','🏛️','Mayan Oracle','Kin energy for today','Premium'],
              ['oc5','🌸','Chakra Focus','Your energy centers today','Premium'],
              ['oc6','🌿','Gene Keys','Rotating personal key','Premium'],
              ['oc7','🌙','Vedic Moon','Nakshatra transit','Premium'],
            ].map(([cls,ic,title,sub,tier]) => (
              <div key={title} className={`oc ${cls}`}>
                <div className="ocbg" />
                <div className="ocov" />
                <div className={`ollk ${tier==='Free'?'fl2':''}`}>{tier==='Free'?'● Free':'🔒 Premium'}</div>
                <div className="occt">
                  <div className="ocic">{ic}</div>
                  <div className="oct">{title}</div>
                  <div className="ocs">{sub}</div>
                </div>
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
            <div className="st">Five levels of cosmic alignment</div>
            <p className="ss" style={{margin:'0 auto'}}>Every compatibility score maps to a named level — shown consistently on cards, notifications, and shared blueprints.</p>
          </div>
          <div className="tier-g">
            {[
              ['t-tf','⭐','Perfect Match',    '93%+',    'Rarest outcome across all 16 systems. Under 1% of all cross-matches reach this. Triggers a VIP push alert + email the moment the match appears.'],
              ['t-sb','💫','Exceptional Match','85–92%',  'Outstanding alignment across spiritual and behavioral systems. Surfaces with an urgent notification and priority position in discover.'],
              ['t-cm','🌌','Celestial Match',  '80–84%',  'Exceptional multi-system resonance across spiritual and behavioral layers. Priority notification sent immediately.'],
              ['t-dm','🌸','Divine Match',     '75–79%',  'Strong alignment across the core spiritual systems. Priority notification. The majority of lasting connections originate at this level.'],
              ['t-om','🌿','Outstanding Match','65–74%',  'Meaningful alignment across several systems. Standard match notification. A solid connection worth exploring further.'],
              ['t-gm','✨','Glowing Match',    '55–64%',  'Shown in discover feed only — no notification. Completing more questionnaires refines your profile and can raise a Glowing Match to Outstanding or higher.'],
            ].map(([cls,ico,name,pct,desc]) => (
              <div key={name} className={`tier ${cls}`}>
                <span className="tier-icon">{ico}</span>
                <span className="tier-name">{name}</span>
                <span className="tier-pct">{pct}</span>
                <div className="tier-bar" />
                <span className="tier-desc">{desc}</span>
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
              <div className="flow-ic">💚</div>
              <div className="flow-name">Available</div>
              <div className="flow-dur">Discover</div>
              <div className="flow-desc">Swipe, browse, and connect. The network shows you one match at a time.</div>
            </div>
            <div className="flow" style={{borderRadius:'0 24px 24px 0',borderLeft:'none'}}>
              <div className="flow-ic">💗</div>
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
              ['📍','GPS Check-in','Meeting your match in person? Both check in from the same location to verify the date happened. Builds trust, unlocks bonus time bank hours, and adds a real-world layer to digital connection.','linear-gradient(135deg,rgba(34,197,94,.2),rgba(16,185,129,.1))','1px solid rgba(34,197,94,.25)'],
              ['🔔','Soulmate Radar','A background engine monitors every new signup. The moment someone above your threshold appears — even months later — you get an immediate push notification. Your oracle stays active while you wait.','linear-gradient(135deg,rgba(168,85,247,.2),rgba(99,102,241,.1))','1px solid rgba(168,85,247,.25)'],
              ['🔥','Response Streaks + Time Bank','Consistent back-and-forth earns streak bonuses and deposits hours into your shared time bank — extending your 7-day match window. Meaningful conversation is literally rewarded.','linear-gradient(135deg,rgba(245,158,11,.2),rgba(239,68,68,.1))','1px solid rgba(245,158,11,.25)'],
              ['♻️','Match Revival','A connection ended before its time? Premium members can revive a past match — re-opening the conversation window for a second chance. One revival per match.','linear-gradient(135deg,rgba(236,72,153,.2),rgba(168,85,247,.1))','1px solid rgba(236,72,153,.25)'],
            ].map(([ico,title,desc,bg,border]) => (
              <div key={title} className="ecard">
                <div className="eico" style={{background:bg as string,border:border as string}}>{ico}</div>
                <div>
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
              <div className="p-price">$0</div>
              <div className="p-sub">No credit card needed</div>
              <ul className="p-list">
                {['Full soulmate blueprint (16 systems)','3 daily oracle cards (Horoscope · Tarot · Numerology)','Soulmate Radar alerts','One match at a time (7-day model)','Real-time cosmic chat','3 compatibility views per day','GPS check-in','Shareable soulmate stories'].map(i=><li key={i}>{i}</li>)}
              </ul>
              <a href={APP_URL} className="p-cta free">Download free</a>
            </div>
            <div className="pcard premium p-prem">
              <div className="p-badge">Oracle Premium</div>
              <div className="p-price">$19<span>.99/mo</span></div>
              <div className="p-sub">Everything in Free, plus:</div>
              <ul className="p-list">
                {['4 extra oracle systems (Mayan · Chakra · Gene Keys · Vedic)','Oracle AI Chat — conversational spiritual advisor','Extended Tarot (3-card + Celtic Cross spreads)','Unlimited compatibility breakdowns','Pre-Swipe Oracle insight before deciding','Match Revival — revive past connections','Time Bank Boost (72-hr max vs 12-hr)','Unlimited streak freezes','Priority matching + Incognito mode','Monthly Past Life deep readings'].map(i=><li key={i}>{i}</li>)}
              </ul>
              <a href={APP_URL} className="p-cta prem">Get Oracle Premium</a>
            </div>
            <div className="pcard cards p-sc">
              <div className="p-badge">Soul Cards</div>
              <div className="p-price">$4<span>.99</span></div>
              <div className="p-sub">Per card — or save in packs</div>
              <ul className="p-list">
                {['Exchange real contact info with your match','Take the connection beyond the app','3 cards — $9.99','5 cards — $14.99','10 cards — $24.99'].map(i=><li key={i}>{i}</li>)}
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
            <a href={APP_URL} className="bl bp" style={{display:'inline-flex'}}>💫 Create Your Quiz</a>
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
              <img src="/images/badge-appstore.png" alt="Download on the App Store" className="store-badge store-badge-lg" />
            </a>
            <a href={PLAY_URL} className="store-badge-link">
              <img src="/images/badge-googleplay.jpg" alt="Get it on Google Play" className="store-badge store-badge-lg" />
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
