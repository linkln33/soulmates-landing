import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { checkoutState, checkoutView } from '@/lib/site/checkout';

type Props = PageProps<'/[lang]/checkout/done'>;

/**
 * Where Stripe Checkout returns (src/lib/site/checkout.ts). Reads only `checkout`; never calls the
 * backend and never reads the session id. Not indexed and not in the sitemap; /checkout/done without
 * a language is redirected here by src/proxy.ts with its query kept.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = site((await params).lang as Locale).checkout;
  return { title: t.metaTitle, robots: { index: false, follow: false } };
}

export default async function CheckoutDonePage({ params, searchParams }: Props) {
  const lang = (await params).lang as Locale;
  const view = checkoutView(site(lang).checkout, checkoutState((await searchParams).checkout));
  return (
    <div className="wrap page narrow stack">
      <h1 className="display">{view.title}</h1>
      <p className="lead">{view.body}</p>
      <div className="row">
        <a href={view.href} className="btn btn-primary">{view.button}</a>
      </div>
      <p className="small muted">{view.note}</p>
    </div>
  );
}
