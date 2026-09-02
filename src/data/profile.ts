export const about = {
  // Two sentences each, and no more. Nothing on this site asks to be read
  // twice: the projects carry the detail, the copy points at them.
  quote:
    'I build things to find out how they work. It’s a slow way to learn, and the only one that’s stuck.',
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
    title: 'IT Service Desk & User Access Management',
    org: 'Cebu Air, Inc. (Cebu Pacific) · OJT',
    dates: 'Feb 2026 – Jun 2026',
    lines: [
      'Handled tickets and user access requests for staff company-wide.',
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
  masthead: ['Issue 01', 'Portfolio', 'Dasmariñas, Cavite, PH', '2026', 'Self-published'],
  statement: 'Learning out loud, in public, on purpose.',
  roles: ['Software', 'Front-end', 'Data', 'AI / ML', 'IT Support'],
  availability: 'Open to entry-level & junior roles',
  scrollCue: 'Turn the page',
} as const;
