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
  media: { kind: 'plate'; base: string } | { kind: 'chart' };
  /** A measured figure, stamped. Never an estimate. */
  stat?: string;
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
    links: { live: 'https://artms-website.vercel.app', source: 'https://github.com/danil-tzn31/ARTMS-Website' },
    media: { kind: 'plate', base: 'artms' },
    stat: 'LCP 0.50s · 127 kB JS',
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
    links: { live: 'https://moodtune-psi-lyart.vercel.app', source: 'https://github.com/danil-tzn31/moodtune' },
    media: { kind: 'plate', base: 'moodtune' },
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
    media: { kind: 'plate', base: 'halina' },
  },
  {
    n: '04',
    slug: 'Watch Price',
    title: 'Luxury Watch Price Prediction',
    year: '2026',
    plain:
      'Estimates what a luxury watch should cost from its specifications, and checks ten models to see which does it best.',
    does: [
      'Cleans the data, then trains ten regression models tuned with GridSearchCV.',
      'Compares them on RMSE and R², with residual and prediction-vs-actual plots.',
    ],
    stack: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'matplotlib', 'seaborn', 'Jupyter'],
    links: { source: 'https://github.com/danil-tzn31/Luxury-Watch-Price-Prediction' },
    media: { kind: 'chart' },
  },
];
