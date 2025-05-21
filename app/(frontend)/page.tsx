import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { WhyUs } from '@/components/sections/why-us';
import { Technologies } from '@/components/sections/technologies';
import { ProjectShowcase } from '@/components/sections/project-showcase';
import { Stats } from '@/components/sections/stats';
import { Testimonials } from '@/components/sections/testimonials';
import { CTASection } from '@/components/sections/cta';

export default function Home() {
  return (
    <>
      <Hero />
      {/* <Stats /> */}
      <Services />
      <WhyUs />
      <ProjectShowcase />
      <Technologies />
      <Testimonials />
      <CTASection />
    </>
  );
}