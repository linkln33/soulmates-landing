import Link from 'next/link';
import { site } from '@/i18n';

/** Unknown pages under a language. The layout's language isn't available here, so both languages are shown. */
export default function NotFound() {
  const en = site('en').notFound;
  const bg = site('bg').notFound;
  return (
    <div className="wrap page narrow stack">
      <h1 className="display">{en.title}</h1>
      <p className="lead">{en.body}</p>
      <p className="lead" lang="bg">{bg.title}. {bg.body}</p>
      <div className="row">
        <Link href="/en" className="btn btn-primary">{en.home}</Link>
        <Link href="/bg" className="btn btn-secondary" lang="bg">{bg.home}</Link>
      </div>
    </div>
  );
}
