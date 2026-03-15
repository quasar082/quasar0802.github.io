'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

// Register all plugins once (ES module deduplication guarantees single execution)
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, Observer, useGSAP);

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, Observer, useGSAP };
