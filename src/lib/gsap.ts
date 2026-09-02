'use client';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Registered once, here. Every animated component imports gsap from this
// module rather than from the package, so a plugin can never be missing at
// the point of use.
gsap.registerPlugin(useGSAP, Observer, ScrollToPlugin, ScrollTrigger, SplitText);

export { gsap, useGSAP, Observer, ScrollToPlugin, ScrollTrigger, SplitText };
