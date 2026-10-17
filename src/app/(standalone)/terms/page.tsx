import type { Metadata } from 'next';
import Link from 'next/link';
import LegalDraft, { Missing } from '@/components/site/LegalDraft';

export const metadata: Metadata = {
  title: 'Terms (draft) — Soulmates Quest',
  description: 'Draft terms of use for the Soulmates Quest website. Not yet in effect.',
  robots: { index: false, follow: true },
  openGraph: { title: 'Terms (draft) — Soulmates Quest', url: '/terms', type: 'website', images: [{ url: '/app-content/logo.png', width: 1373, height: 655 }] },
};

export default function TermsDraftPage() {
  return (
    <LegalDraft title="Terms of use (draft)">
      <p>These draft terms would apply to the Soulmates Quest website at www.soulmates.quest.</p>

      <h2>Who we are</h2>
      <p>
        <Missing>legal entity name</Missing>, <Missing>registered address</Missing>,{' '}
        <Missing>company registration number</Missing>
      </p>

      <h2>The free readings are for reflection</h2>
      <ul>
        <li>
          The free readings (horoscope, tarot, numbers and the Moon calendar) follow traditional astrology, tarot
          and numerology, with Moon and planet positions calculated astronomically. They are offered for
          reflection only.
        </li>
        <li>
          We make no claim that it is accurate or that it predicts anything, including who you will meet or
          whether a relationship will work.
        </li>
        <li>
          It is not medical, psychological, financial or legal advice. Do not base important decisions on it.
        </li>
      </ul>

      <h2>No guarantee of meeting anyone</h2>
      <p>
        Soulmates Quest does not guarantee that you will be introduced to, meet, or form a relationship with
        anyone.
      </p>

      <h2>The app is not available yet</h2>
      <p>
        The Soulmates Quest mobile app is not available in the App Store or Google Play. It is being prepared for a
        private pilot (see <Link href="/app">App status</Link>). The website sells nothing and takes no payments.
        Separate terms will be needed for the app.
      </p>
      <p>Age requirement for the app: <Missing>minimum age for the future app</Missing></p>
      <p>Age requirement for this website: <Missing>minimum age, if any, for using the website</Missing></p>

      <h2>Using the website</h2>
      <p>
        <Missing>acceptable use, intellectual property and limitation of liability wording — to be drafted by counsel</Missing>
      </p>

      <h2>Governing law</h2>
      <p>
        <Missing>governing law and jurisdiction</Missing>
      </p>

      <h2>Contact and changes</h2>
      <p>
        Contact: <Missing>contact email for legal notices</Missing>. Effective date: <Missing>effective date</Missing>
      </p>
    </LegalDraft>
  );
}
