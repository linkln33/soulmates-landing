import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import DocPage, { docMetadata } from '@/components/site/DocPage';

type Props = PageProps<'/[lang]/delete-account'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return docMetadata('delete-account', (await params).lang as Locale);
}

export default async function Page({ params }: Props) {
  return <DocPage doc="delete-account" lang={(await params).lang as Locale} />;
}
