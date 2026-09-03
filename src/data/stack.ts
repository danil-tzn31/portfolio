export type StackItem = {
  label: string;
  /** Key into MARKS. Omitted where no mark exists and a tile is drawn instead. */
  mark?: string;
  /** Two letters for the tile. Defaults to the label's first two. */
  tile?: string;
};

export type StackRow = {
  label: string;
  /** Multiplier on 100px per second. */
  speed: number;
  /**
   * Which way the items travel. Named rather than signed: forward playback
   * moves items left, so a bare -1 here would read as its own opposite.
   */
  direction: 'left' | 'right';
  items: readonly StackItem[];
};

export const stack: readonly StackRow[] = [
  {
    label: 'Languages & Data',
    // Speeds are px per second, so bigger items travel a smaller share of
    // their own width per second. Scaled up with the type.
    speed: 0.9,
    direction: 'left',
    items: [
      { label: 'Python', mark: 'python' },
      { label: 'JavaScript', mark: 'javascript' },
      { label: 'TypeScript', mark: 'typescript' },
      { label: 'PHP', mark: 'php' },
      { label: 'Java' },
      { label: 'C++', mark: 'cplusplus' },
      // simple-icons' MySQL and Cisco marks are wordmarks — at 16px they are
      // an illegible smudge that repeats the label beside it. Tiles instead.
      { label: 'MySQL', tile: 'MY' },
      { label: 'SQL Server', tile: 'MS' },
      { label: 'pandas', mark: 'pandas' },
      { label: 'NumPy', mark: 'numpy' },
      { label: 'scikit-learn', mark: 'scikitlearn' },
      { label: 'OpenCV', mark: 'opencv' },
    ],
  },
  {
    label: 'Web',
    speed: 1.4,
    direction: 'right',
    items: [
      { label: 'HTML', mark: 'html5' },
      { label: 'CSS', mark: 'css' },
      { label: 'React', mark: 'react' },
      { label: 'Next.js', mark: 'nextdotjs' },
      { label: 'Node.js', mark: 'nodedotjs' },
      { label: 'Express', mark: 'express' },
      { label: 'Tailwind CSS', mark: 'tailwindcss' },
      { label: 'Bootstrap', mark: 'bootstrap' },
      { label: 'GSAP', mark: 'greensock' },
      { label: 'Prisma', mark: 'prisma' },
      { label: 'Vite', mark: 'vite' },
      { label: 'Git', mark: 'git' },
      { label: 'GitHub', mark: 'github' },
      { label: 'Vercel', mark: 'vercel' },
    ],
  },
  {
    label: 'Systems & Tools',
    speed: 0.7,
    direction: 'left',
    items: [
      { label: 'Docker', mark: 'docker' },
      { label: 'Postman', mark: 'postman' },
      { label: 'Windows Server', tile: 'WS' },
      { label: 'Active Directory', tile: 'AD' },
      { label: 'Cisco Networking', tile: 'CI' },
      { label: 'ServiceDesk Plus', tile: 'SD' },
      { label: 'Power Automate', tile: 'PA' },
      { label: 'VS Code', tile: 'VS' },
    ],
  },
];
