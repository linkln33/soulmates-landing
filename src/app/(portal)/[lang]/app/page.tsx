import { redirect } from 'next/navigation';

type Props = PageProps<'/[lang]/app'>;

/** No separate app page any more (owner, 11 Nov 2026): old links land on the home page's download section. */
export default async function AppPage({ params }: Props) {
  const { lang } = await params;
  redirect(`/${lang}#download`);
}
