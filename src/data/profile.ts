export const about = {
  // Two sentences each, and no more. Nothing on this site asks to be read
  // twice: the projects carry the detail, the copy points at them.
  quote: 'Building things and learning from it is how I do it, no matter the difficulty',
  paragraphs: [
    'I’m Daniel. I build websites and small machine-learning projects end to end — design, front end, back end, deployed.',
    'Computer Engineering at De La Salle University–Dasmariñas, then an internship on an IT service desk, which is a good place to learn what actually breaks.',
  ],
} as const;

export type Record = {
  n: string;
  title: string;
  org: string;
  dates?: string;
  lines?: readonly string[];
};

export const records: readonly Record[] = [
  {
    n: '01',
    title: 'IT Service Desk',
    org: 'Cebu Air, Inc. (Cebu Pacific) · OJT',
    dates: 'Feb 2026 – Jun 2026',
    lines: [
      'Handled service desk tickets for staff company-wide.',
      'Built an offboarding automation in Power Automate and Excel VBA after an audit flagged late notices.',
    ],
  },
  {
    n: '02',
    title: 'BS Computer Engineering',
    org: 'De La Salle University – Dasmariñas',
  },
];

export const profile = {
  name: ['Daniel', 'Martin', 'Tizon'],
  masthead: ['Issue 01', 'Portfolio', 'Imus, Cavite, PH', '2026', 'Self-published'],
  statement: 'Learning out loud, in public, on purpose.',
  roles: ['Software', 'Front-end', 'Data', 'AI / ML', 'IT Support'],
  availability: 'Open to entry-level & junior roles',
  scrollCue: 'Turn the page',
} as const;

export type Channel = {
  label: string;
  /** One line. The label says which platform, so the value is the address on it. */
  value: string;
  href?: string;
};

export const contact = {
  email: 'daniel.tizon31@gmail.com',
  /**
   * All three at one size, on one line each. That is only possible if they
   * are a similar length, so the two links show the handle rather than the
   * whole URL — the label above already names the platform, and carrying
   * "linkedin.com/in/" into the value would cap all three at half the size.
   */
  channels: [
    { label: 'Email', value: 'daniel.tizon31@gmail.com' },
    { label: 'GitHub', value: 'danil-tzn31', href: 'https://github.com/danil-tzn31' },
    {
      label: 'LinkedIn',
      value: 'daniel-martin-tizon',
      href: 'https://www.linkedin.com/in/daniel-martin-tizon',
    },
  ] as readonly Channel[],
  location: 'Imus, Cavite, Philippines · UTC+8',
  colophon: ['Set in PP Neue Montreal & PP Eiko', 'Built with Next.js and GSAP', 'Issue 01 · 2026'],
} as const;
