import Link from 'next/link';

/** Contact address already published on the site before M0.1. */
export const CONTACT_EMAIL = 'hello@soulmates.quest';

export default function SiteFooter() {
  return (
    <footer className="lfooter">
      <p>
        © {new Date().getFullYear()} Soulmates Quest &nbsp;·&nbsp;{' '}
        <Link href="/app">App status</Link> &nbsp;·&nbsp;{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </footer>
  );
}
