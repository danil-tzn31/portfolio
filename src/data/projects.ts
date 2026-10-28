export type Project = {
  n: '01' | '02' | '03' | '04';
  slug: string;
  title: string;
  year: string;
  /** One sentence, written for a reader who is not an engineer. */
  plain: string;
  /**
   * Exactly two, and each one has to hold a single line at the narrowest
   * viewport the panel runs at — restraint rule 7. That is about fifty
   * characters. A bullet that wraps stops being a bullet.
   */
  does: readonly [string, string];
  stack: readonly string[];
  links: { live?: string; source: string };
  /** Basename in public/media of the plate and the contact-sheet thumbnail. */
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
    slug: 'Now Serving',
    title: 'Now Serving',
    year: '2026',
    plain:
      'Answers questions about Philippine passport and PSA birth certificate applications, and links where every answer came from.',
    does: [
      'Answers only from ten articles I wrote and checked.',
      'Refuses anything out of scope instead of guessing.',
    ],
    stack: [
      'Python',
      'AWS Lambda',
      'Amazon Bedrock',
      'API Gateway',
      'AWS SAM',
      'S3 Vectors',
      'JavaScript',
    ],
    links: {
      live: 'https://danil-tzn31.github.io/Now-Serving/',
      source: 'https://github.com/danil-tzn31/Now-Serving',
    },
    plate: 'nowserving',
  },
  {
    n: '02',
    slug: 'moodtune',
    title: 'moodtune',
    year: '2026',
    plain:
      'Turns an album cover into a mood board — colours, a mood label, and artists that sound like it.',
    does: [
      'Reads the artwork’s colours and names the mood.',
      'Suggests artists that sound like it, with previews.',
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
      'Books flights and hotels, Stripe in test mode.',
      'A confirmation page laid out like a boarding pass.',
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
    does: ['Nine regression models, tuned with GridSearchCV.', 'Lasso came out best, at R² 0.87.'],
    stack: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'matplotlib', 'seaborn', 'Jupyter'],
    links: { source: 'https://github.com/danil-tzn31/Luxury-Watch-Price-Prediction' },
    plate: 'watch',
    figure: true,
  },
];
