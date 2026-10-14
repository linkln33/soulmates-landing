import type { Metadata } from 'next';
import Link from 'next/link';
import '../landing.css';
import Stars from '@/components/landing/Stars';
import SiteNav from '@/components/landing/SiteNav';
import SiteFooter, { CONTACT_EMAIL } from '@/components/landing/SiteFooter';

const title = 'App status — Soulmates Quest';
const description =
  'The Soulmates Quest mobile app is not yet available in the App Store or Google Play. It is being prepared for a private pilot.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/app' },
  openGraph: {
    title,
    description,
    url: '/app',
    type: 'website',
    images: [{ url: '/logo.png', width: 1024, height: 1024 }],
  },
};

export default function AppStatusPage() {
  return (
    <>
      <div className="bgo">
        <div className="orb o1" />
        <div className="orb o2" />
      </div>
      <Stars />
      <SiteNav />

      <main className="doc">
        <div className="sl2">App status</div>
        <h1>The app isn&apos;t available yet</h1>
        <p>
          The Soulmates Quest mobile app is <strong>not yet available</strong> in the App Store or Google Play,
          and there is no public download. We are preparing it for a private pilot. We are not promising a
          date.
        </p>

        <h2>What you can do now</h2>
        <ul>
          <li>
            Get the <Link href="/#free-taste">free reading</Link> on the home page: numerology numbers, your sun
            sign and element, and a symbolic past-life archetype from your first name and birth date. No account
            is needed.
          </li>
          <li>
            Questions? Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </li>
        </ul>

        <h2>What the pilot app is being designed to do</h2>
        <p>
          These are plans, not available features. The app is being designed to suggest one introduction at a
          time, only between real members who have both agreed to be introduced, with no swiping. Chat would open
          only after both people accept. Pricing has not been set; the pilot is free.
        </p>

        <div className="doc-cta">
          <Link href="/#free-taste" className="bl bp">Get the free reading</Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
