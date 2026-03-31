import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Thin scroll-progress bar fixed at the very top of the viewport.
 * Driven by GSAP ScrollTrigger for buttery-smooth updates.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      scrub: 0.3,
      onUpdate: (self) => {
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div className="scroll-progress-track">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  );
}
