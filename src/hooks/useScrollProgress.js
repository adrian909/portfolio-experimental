import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook that returns a ref to attach to a section for scroll-based progress.
 * Calls onProgress(0..1) as the user scrolls through the trigger element.
 */
export function useSectionProgress(onProgress, { start = 'top top', end = '+=100%' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      scrub: true,
      onUpdate: (self) => onProgress(self.progress),
    });
    return () => st.kill();
  }, []);

  return ref;
}
