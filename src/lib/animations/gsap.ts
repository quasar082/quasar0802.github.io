import { gsap } from 'gsap';

let initialized = false;

export function getGsap() {
  if (!initialized) {
    initialized = true;
  }

  return gsap;
}

export { gsap };
