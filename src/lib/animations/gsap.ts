'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useGSAP } from '@gsap/react';

// Register all plugins once (ES module deduplication guarantees single execution)
gsap.registerPlugin(
  ScrollTrigger, SplitText, Flip, CustomEase, Observer,
  DrawSVGPlugin, ScrambleTextPlugin, TextPlugin, ScrollToPlugin,
  Draggable, InertiaPlugin, useGSAP
);

export {
  gsap, ScrollTrigger, SplitText, Flip, CustomEase, Observer,
  DrawSVGPlugin, ScrambleTextPlugin, TextPlugin, ScrollToPlugin,
  Draggable, InertiaPlugin, useGSAP
};
