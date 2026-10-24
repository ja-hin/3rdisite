import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServicePage from '@/components/services/ServicePage';
import { SERVICE_DATA, SERVICE_PAGES, pageBySlug } from '@/lib/services';

type Params = { params: Promise<{ slug: string }> };

// the four service pages are known up front, so they are prerendered (and exported statically)
export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = pageBySlug(slug);
  if (!page) return {};
  const hero = SERVICE_DATA[page.key][0];
  if (hero.type !== 'hero') return {};
  return { title: `${hero.eyebrow} — 3rd i Visuals`, description: hero.p1 };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const page = pageBySlug(slug);
  if (!page) notFound();
  return <ServicePage service={page.key} />;
}
