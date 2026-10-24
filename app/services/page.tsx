import type { Metadata } from 'next';
import ServicesIndex from '@/components/services/ServicesIndex';

export const metadata: Metadata = {
  title: 'Growth & Marketing Services — 3rd i Visuals',
  description:
    'Growth and marketing services from 3rd i Visuals: content and creative, e-commerce and digital sales growth, marketing automation and AI, B2B lead generation and sales outreach.',
};

export default function ServicesPage() {
  return <ServicesIndex />;
}
