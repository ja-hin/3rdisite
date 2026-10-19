'use client';

import Atmosphere from '@/components/Atmosphere';
import { Hero, Nav } from '@/components/Hero';
import { Approach, Services } from '@/components/Services';
import { Audience, Automation, Commerce, Content, Cta, Enquire, Footer, Insights, Products, Work } from '@/components/Sections';

export default function Home() {
  return (
    <Atmosphere>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Approach />
        <Commerce />
        <Content />
        <Automation />
        <Products />
        <Work />
        <Audience />
        <Insights />
        <Cta />
        <Enquire />
      </main>
      <Footer />
    </Atmosphere>
  );
}
