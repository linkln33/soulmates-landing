import Link from 'next/link';

/** Top navigation shared by every page. */
export default function SiteNav() {
  return (
    <nav className="lnav">
      <Link href="/" className="nl">
        <div className="ni">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Soulmates Quest" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
        </div>
        Soulmates Quest
      </Link>
      <Link href="/app" className="nc">App status</Link>
    </nav>
  );
}
