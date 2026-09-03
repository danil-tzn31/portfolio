'use client';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Registered once, here. Every animated component imports gsap from this
// module rather than from the package, so a plugin can never be missing at
// the point of use.
// Only what the site actually uses. Observer and ScrollToPlugin were
// registered here from the plan's list and called nowhere: Lenis owns every
// programmatic scroll, and no section needs raw gesture observation. Both
// were parsed and evaluated on every load for nothing.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, useGSAP, ScrollTrigger, SplitText };
