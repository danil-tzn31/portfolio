export type Project = {
  n: '01' | '02' | '03' | '04';
  slug: string;
  title: string;
  year: string;
  /** One sentence, written for a reader who is not an engineer. */
  plain: string;
  /** Exactly two, one line each — restraint rule 7. */
  does: readonly [string, string];
  stack: readonly string[];
  links: { live?: string; source: string };
  /** Basename in public/media of the plate, halftone and thumbnail. */
  plate: string;
  /**
   * A plot rather than a screenshot. It is fitted whole instead of cropped
   * from the top — a chart with its axis cut off is not a chart — and
   * multiplied, so the page shows through the figure's white.
   */
  figure?: true;
};

export const projects: readonly Project[] = [
  {
    n: '01',
    slug: 'ARTMS',
    title: 'Virtual Angel Archive',
    year: '2026',
    plain: 'A fan-made archive for the group ARTMS, built as one long scroll through three eras.',
    does: [
      'One scroll through three eras, with member profiles and photography.',
      'Images, video and fonts processed at build time so it loads fast on a phone.',
    ],
    stack: ['Vite', 'React 19', 'TypeScript', 'Tailwind v4', 'GSAP', 'Lenis', 'sharp', 'ffmpeg'],
    links: {
      live: 'https://artms-website.vercel.app',
      source: 'https://github.com/danil-tzn31/ARTMS-Website',
    },
    plate: 'artms',
  },
  {
    n: '02',
    slug: 'moodtune',
    title: 'moodtune',
    year: '2026',
    plain:
      'Turns an album cover into a mood board — colours, a mood label, and artists that sound like it.',
    does: [
      'Pulls the dominant colours off the artwork and names the mood from them.',
      'Suggests similar artists, plays a preview, and copies any swatch on click.',
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'iTunes API', 'Last.fm API'],
    links: {
      live: 'https://moodtune-psi-lyart.vercel.app',
      source: 'https://github.com/danil-tzn31/moodtune',
    },
    plate: 'moodtune',
  },
  {
    n: '03',
    slug: 'Halina',
    title: 'Halina Travel',
    year: '2026',
    plain: 'A Philippine travel booking site, rebuilt from an old PHP and SQL Server codebase.',
    does: [
      'Search and book flights and hotels, with accounts and Stripe checkout in test mode.',
      'A shareable confirmation page laid out like a boarding pass.',
    ],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js', 'Stripe', 'Tailwind'],
    links: {
      live: 'https://halina-website-revamped.vercel.app',
      source: 'https://github.com/danil-tzn31/Halina-Website-Revamped',
    },
    plate: 'halina',
  },
  {
    n: '04',
    slug: 'Watch Price',
    title: 'Luxury Watch Price Prediction',
    year: '2026',
    plain:
      'Estimates what a luxury watch should cost from its specifications, and checks nine models to see which does it best.',
    does: [
      'Cleans the data, then trains nine regression models tuned with GridSearchCV.',
      'Lasso came out best at R² 0.87, checked on residual and predicted-vs-actual plots.',
    ],
    stack: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'matplotlib', 'seaborn', 'Jupyter'],
    links: { source: 'https://github.com/danil-tzn31/Luxury-Watch-Price-Prediction' },
    plate: 'watch',
    figure: true,
  },
];
