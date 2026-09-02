import { About } from '@/components/about/About';
import { Hero } from '@/components/hero/Hero';
import { StackMarquee } from '@/components/stack/StackMarquee';

export default function Page() {
  return (
    <main>
      <Hero />
      <About />
      <StackMarquee />
    </main>
  );
}
