import { About } from '@/components/about/About';
import { Hero } from '@/components/hero/Hero';
import { Projects } from '@/components/projects/Projects';
import { StackMarquee } from '@/components/stack/StackMarquee';

export default function Page() {
  return (
    <main>
      <Hero />
      <About />
      <StackMarquee />
      <Projects />
    </main>
  );
}
