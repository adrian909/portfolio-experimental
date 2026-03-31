import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = '', label }) {
  const numRef = useRef(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 }, {
          val: end,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          },
        });
      },
    });
    return () => st.kill();
  }, [end, suffix]);

  return (
    <div className="vision-stat">
      <span ref={numRef} className="vision-stat-num">0{suffix}</span>
      <span className="vision-stat-label">{label}</span>
    </div>
  );
}

// ─── Staggered word reveal ────────────────────────────────────────────────────
// Each word block is wrapped in overflow:hidden so the yPercent slide is masked.
function WordReveal({ lines, className = '', baseDelay = 0 }) {
  return (
    <h2 className={className}>
      {lines.map((line, li) => (
        <span key={li} className="vision-line-outer">
          <motion.span
            className="vision-line-inner"
            initial={{ yPercent: 108 }}
            whileInView={{ yPercent: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{
              duration: 0.85,
              delay: baseDelay + li * 0.14,
              ease: [0.16, 1, 0.3, 1],   // custom fast-in, soft-settle
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

// ─── Floating background particles (pure CSS + GSAP) ─────────────────────────
const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x:  Math.random() * 100,
  y:  Math.random() * 100,
  s:  0.8 + Math.random() * 2.4,
  o:  0.15 + Math.random() * 0.35,
}));

export default function VisionSection() {
  const sectionRef = useRef(null);
  const flashRef   = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      // ── Letterbox bars slide away as section enters ───────────────────────
      gsap.fromTo(['.vision-bar-t', '.vision-bar-b'],
        { scaleY: 1 },
        {
          scaleY: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            end:   'top 30%',
            scrub: 1.1,
          },
        }
      );
      gsap.set('.vision-bar-t', { transformOrigin: 'top center' });
      gsap.set('.vision-bar-b', { transformOrigin: 'bottom center' });

      // ── Camera-flash entrance ─────────────────────────────────────────────
      // The section goes white for 40ms then dark — like a film flash.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.timeline()
            .set(flashRef.current,  { opacity: 1 })
            .to(flashRef.current,   { opacity: 0, duration: 0.55, ease: 'power2.out' }, 0.04);
        },
      });

      // ── Ambient glow pulse ────────────────────────────────────────────────
      gsap.to('.vision-glow', {
        opacity: 0.6,
        scale: 1.18,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // ── Floating particles drift upward, fade out, repeat ─────────────────
      document.querySelectorAll('.vision-particle').forEach((p) => {
        gsap.to(p, {
          y:       -(55 + Math.random() * 90),
          x:       (Math.random() - 0.5) * 45,
          opacity: 0,
          duration: 3.5 + Math.random() * 4.5,
          delay:    Math.random() * 6,
          ease:     'none',
          repeat:   -1,
          repeatDelay: Math.random() * 3,
        });
      });

      // ── Divider line grows from center ────────────────────────────────────
      gsap.fromTo('.vision-rule',
        { width: 0 },
        {
          width: '160px',
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
          scrollTrigger: {
            trigger: '.vision-rule',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="vision" ref={sectionRef} className="cinematic-section vision-section">

      {/* ── Camera-flash overlay ───────────────────────────────────────────── */}
      <div ref={flashRef} className="vision-flash" aria-hidden="true" />

      {/* ── Cinematic letterbox bars ──────────────────────────────────────── */}
      <div className="vision-bar-t" aria-hidden="true" />
      <div className="vision-bar-b" aria-hidden="true" />

      {/* ── Radial background glow ────────────────────────────────────────── */}
      <div className="vision-glow" aria-hidden="true" />

      {/* ── Scanline overlay ──────────────────────────────────────────────── */}
      <div className="vision-scanlines" aria-hidden="true" />

      {/* ── Floating accent particles ─────────────────────────────────────── */}
      <div className="vision-particles" aria-hidden="true">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="vision-particle"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.s}px`, height: `${p.s}px`, opacity: p.o }}
          />
        ))}
      </div>

      {/* ── Ambient decoratives ────────────────────────────────────────────── */}
      <span className="deco deco-rot     deco-light" style={{ top: '6%',    right: '3%' }}>VISION/</span>
      <span className="deco deco-code    deco-light" style={{ bottom: '8%', left:  '2%' }}>SYS<br />2026+</span>
      <span className="deco deco-checker deco-light" style={{ top: '14%',   left:  '1%' }}>▚▞</span>
      <span className="deco deco-rot     deco-light" style={{ bottom: '22%', right: '2%' }}>FUTURE/</span>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="vision-content">

        {/* Section marker */}
        <motion.span
          className="cin-label vision-label"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          [ 07 / 09 ] — VISION
        </motion.span>

        {/* Big manifesto — word-by-word clip reveal */}
        <WordReveal
          lines={['I BUILD THE', 'INVISIBLE', 'INFRASTRUCTURE']}
          className="vision-headline"
          baseDelay={0.1}
        />

        {/* Sub-line */}
        <motion.p
          className="vision-sub"
          initial={{ opacity: 0, letterSpacing: '0.38em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.18em' }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.65, ease: 'easeOut' }}
        >
          THAT POWERS YOUR EXPERIENCE
        </motion.p>

        {/* Accent rule */}
        <div className="vision-rule" />

        {/* ── Animated stats — real data from trifadrian.ro ─────────────── */}
        <div className="vision-stats">
          <Counter end={4}   suffix="+"  label="YEARS OF EXPERIENCE" />
          <Counter end={10}  suffix="+"  label="PROJECTS COMPLETED"  />
          <Counter end={18}  suffix=""   label="TECHNOLOGIES MASTERED" />
          <Counter end={3}   suffix=""   label="EMPLOYERS" />
        </div>

        {/* ── Statement ─────────────────────────────────────────────────── */}
        <motion.p
          className="vision-statement"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Scalable systems. Clean architecture. Purpose-built APIs.<br />
          Every line of code is a decision that shapes what&apos;s possible.
        </motion.p>

        {/* ── Call to action ─────────────────────────────────────────────── */}
        <motion.div
          className="vision-cta-row"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <motion.a
            href="mailto:adiitrif14@gmail.com"
            className="vision-cta-primary"
            whileHover={{ scale: 1.04, boxShadow: '0 0 42px rgba(192,254,3,0.5)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
          >
            START A PROJECT ↗
          </motion.a>

          <motion.a
            href="https://trifadrian.ro/Adrian_Trif_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="vision-cta-secondary"
            whileHover={{ borderColor: '#c0fe03', color: '#c0fe03' }}
            transition={{ duration: 0.16 }}
          >
            VIEW RESUME
          </motion.a>
        </motion.div>

        {/* ── Social links ───────────────────────────────────────────────── */}
        <motion.div
          className="vision-socials"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { label: 'GITHUB',    href: 'https://github.com/adrian909' },
            { label: 'LINKEDIN',  href: 'https://www.linkedin.com/in/adrian-trif-458968187' },
            { label: 'INSTAGRAM', href: 'https://www.instagram.com/trifadii' },
          ].map(({ label, href }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="vision-social-link"
              whileHover={{ color: '#c0fe03', x: 5 }}
              transition={{ duration: 0.14 }}
            >
              {label} ↗
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
