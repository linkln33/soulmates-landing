import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import DocPage, { docMetadata } from '@/components/site/DocPage';

type Props = PageProps<'/[lang]/about'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return docMetadata('about', (await params).lang as Locale);
}

export default async function Page({ params }: Props) {
  return <DocPage doc="about" lang={(await params).lang as Locale} />;
}
