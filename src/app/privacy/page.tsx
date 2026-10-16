import type { Metadata } from 'next';
import Link from 'next/link';
import '../landing.css';
import LegalDraft, { Missing } from '@/components/landing/LegalDraft';
import { CONTACT_EMAIL } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy (draft) — Soulmates Quest',
  description: 'Draft privacy notice for the Soulmates Quest website. Not yet in effect.',
  robots: { index: false, follow: true },
  openGraph: { title: 'Privacy (draft) — Soulmates Quest', url: '/privacy', type: 'website', images: [{ url: '/logo.png', width: 1024, height: 1024 }] },
};

export default function PrivacyDraftPage() {
  return (
    <LegalDraft title="Privacy notice (draft)">
      <p>
        This draft describes what the Soulmates Quest website at www.soulmates.quest does with personal data
        today. It covers this website only. The Soulmates Quest mobile app is not available and is not covered
        here.
      </p>

      <h2>Who is responsible</h2>
      <ul>
        <li>Controller: <Missing>legal entity name</Missing></li>
        <li>Address: <Missing>registered address</Missing></li>
        <li>Company number: <Missing>company registration number</Missing></li>
        <li>Contact for privacy requests: <Missing>contact email for privacy requests</Missing></li>
      </ul>

      <h2>The free reading</h2>
      <p>
        When you use the free reading on the <Link href="/">home page</Link>, your browser sends the name you type
        and your birth date to our server at <code>/api/blueprint</code>. The server uses them to calculate your
        numerology numbers, sun sign and element, and a symbolic past-life archetype, and sends the result back
        to your browser.
      </p>
      <ul>
        <li>We do not save the name or birth date to a database or file.</li>
        <li>
          Our code does not write the name or birth date to our logs. If a calculation fails, the server logs a
          short error message that does not include what you entered.
        </li>
        <li>No account is created.</li>
      </ul>
      <p>Lawful basis: <Missing>lawful basis — to be confirmed by counsel</Missing></p>

      <h2>Soulmate quiz (&quot;Are you my soulmate?&quot;)</h2>
      <p>
        A Soulmates Quest member can share a quiz link that asks: &quot;Are you my soulmate?&quot;. If someone sends
        them that link and you answer it on this website (pages under <code>/quiz</code>), this is what happens.
      </p>
      <ul>
        <li>
          What we collect from you: your first name; your answers to the ten quiz questions and to any questions
          the quiz creator wrote; your birth date, only if you choose to add it; and when you agreed to send your
          answers and the language you used.
        </li>
        <li>
          Who sees it: only the person who made the quiz. Soulmates Quest compares your answers with the
          creator&apos;s own answers to write a reading that is shown only to the creator. If you add your birth
          date, it is used only for the traditional signs-and-numbers part of that reading: the creator sees your
          sign and life path number, not the date itself.
        </li>
        <li>Your answers are not shown to anyone else and are not used to match you with anyone.</li>
        <li>
          How long we keep it: until the creator deletes it, or for up to 12 months (proposed period, pending
          review), whichever comes first.
        </li>
        <li>
          Deleting your answers: after sending, you get a one-time link that deletes your answers at any time.
          The creator can also delete them. If you answered while signed in to a Soulmates Quest account, deleting
          that account deletes them too.
        </li>
        <li>
          Abuse protection: to limit repeated or automated sending, our server keeps a rate-limit record that
          contains only a keyed hash of your IP address, not the address itself, for 48 hours.
        </li>
      </ul>
      <p>Lawful basis: <Missing>lawful basis for the quiz — to be confirmed by counsel</Missing></p>

      <h2>Hosting</h2>
      <p>
        The website is hosted by our hosting provider, Vercel, which may process technical request logs when you
        visit the site or use the free reading. Retention of those logs: <Missing>hosting log retention period</Missing>
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        The website does not set cookies and does not include analytics, advertising or tracking scripts. The
        fonts are served from our own domain.
      </p>

      <h2>Email</h2>
      <p>
        If you write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, we receive your email address and
        your message. Email provider and retention: <Missing>email provider and retention period</Missing>
      </p>

      <h2>Your rights</h2>
      <p>
        <Missing>applicable law, data subject rights wording and how to exercise them — to be confirmed by counsel</Missing>
      </p>
      <p>Supervisory authority: <Missing>supervisory authority confirmation</Missing></p>

      <h2>Changes</h2>
      <p>
        This is a draft. It will be reviewed before it takes effect, and the effective date will be shown here:{' '}
        <Missing>effective date</Missing>
      </p>
    </LegalDraft>
  );
}
