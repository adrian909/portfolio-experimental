import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Premium custom cursor using GSAP quickTo for buttery-smooth tracking.
 * quickTo is ~10x more performant than Framer Motion springs for per-frame mouse tasks.
 *
 * States: default → hover (mix-blend: difference) → press (shrink)
 * Magnetic attraction to `.btn-magnetic` elements.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const state   = useRef('default'); // 'default' | 'hover' | 'text'

  useEffect(() => {
    // Touch / stylus devices — no custom cursor
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // ── quickTo: fastest possible GSAP animation for mouse tracking ──────
    // The dot trails almost nothing (0.06s). The ring lags beautifully (0.55s).
    const xDot  = gsap.quickTo(dot,  'x', { duration: 0.06, ease: 'power1.out' });
    const yDot  = gsap.quickTo(dot,  'y', { duration: 0.06, ease: 'power1.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });

    let visible = false;

    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
    };
    const hide = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    // ── Mouse move — the core tracking ───────────────────────────────────
    const onMove = (e) => {
      show();
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    // ── Press — satisfying click feel ────────────────────────────────────
    const onDown = () => {
      gsap.to(dot,  { scale: 0.55, duration: 0.08 });
      gsap.to(ring, { scale: 0.65, duration: 0.1  });
    };
    const onUp = () => {
      gsap.to(dot,  { scale: 1,    duration: 0.18, ease: 'back.out(3)' });
      gsap.to(ring, { scale: 1,    duration: 0.22, ease: 'back.out(2)' });
    };

    // ── Hover detection via event delegation (covers dynamic elements) ───
    const HOVER_SELECTORS = 'a, button, .exp-card, .proj-card, .tech-tab, .vision-cta-primary, .vision-cta-secondary, .proj-link, [data-cursor]';

    const enterHover = () => {
      if (state.current === 'hover') return;
      state.current = 'hover';
      gsap.to(ring, {
        width: 54, height: 54,
        borderColor: 'rgba(192,254,3,1)',
        duration: 0.3, ease: 'power2.out',
      });
      gsap.to(dot, { backgroundColor: '#fff', scale: 1.4, duration: 0.2 });
    };

    const leaveHover = () => {
      if (state.current !== 'hover') return;
      state.current = 'default';
      gsap.to(ring, {
        width: 36, height: 36,
        borderColor: 'rgba(192,254,3,0.65)',
        duration: 0.3, ease: 'power2.out',
      });
      gsap.to(dot, { backgroundColor: '#c0fe03', scale: 1, duration: 0.2 });
    };

    // Single delegated mouseover handles all interactive elements
    const onOver = (e) => {
      if (e.target.closest(HOVER_SELECTORS)) enterHover();
      else if (state.current === 'hover') leaveHover();
    };

    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseover',  onOver,  { passive: true });

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseover',  onOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" style={{ opacity: 0 }} />
    </>
  );
}
