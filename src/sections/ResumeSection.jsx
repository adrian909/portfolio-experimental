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
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
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
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

// ─── Floating background particles ───────────────────────────────────────────
const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x:  Math.random() * 100,
  y:  Math.random() * 100,
  s:  0.8 + Math.random() * 2.4,
  o:  0.15 + Math.random() * 0.35,
}));

export default function ResumeSection() {
  const sectionRef = useRef(null);
  const flashRef   = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      // ── Vision: Letterbox bars slide away ─────────────────────────────────
      gsap.set('.vision-bar-t', { transformOrigin: 'top center' });
      gsap.set('.vision-bar-b', { transformOrigin: 'bottom center' });
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

      // ── Vision: Camera-flash entrance ─────────────────────────────────────
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

      // ── Vision: Ambient glow pulse ─────────────────────────────────────────
      gsap.to('.vision-glow', {
        opacity: 0.6,
        scale: 1.18,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // ── Vision: Floating particles drift upward ────────────────────────────
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

      // ── Vision: Divider line grows ─────────────────────────────────────────
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

      // ── Resume: Title split slides in ─────────────────────────────────────
      gsap.fromTo('.resume-title-l',
        { x: '-6vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: '.resume-inner', start: 'top 80%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo('.resume-title-r',
        { x: '6vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: '.resume-inner', start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // ── Resume: Horizontal rule draws in ──────────────────────────────────
      gsap.fromTo('.resume-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.1, ease: 'power4.inOut',
          scrollTrigger: { trigger: '.resume-inner', start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // ── Resume: Stats stagger in ───────────────────────────────────────────
      gsap.fromTo('.resume-stat',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.resume-stats', start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // ── Resume: Body text ─────────────────────────────────────────────────
      gsap.fromTo('.resume-body',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: '.resume-body', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // ── Resume: Glow pulse on download button ─────────────────────────────
      gsap.to('.resume-dl-btn', {
        boxShadow: '0 0 36px rgba(192,254,3,0.45)',
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        scrollTrigger: { trigger: '.resume-inner', start: 'top 60%', toggleActions: 'play pause resume pause' },
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="resume" ref={sectionRef} className="cinematic-section resume-section">

      {/* ── Camera-flash overlay ────────────────────────────────────────────── */}
      <div ref={flashRef} className="vision-flash" aria-hidden="true" />

      {/* ── Cinematic letterbox bars ─────────────────────────────────────────── */}
      <div className="vision-bar-t" aria-hidden="true" />
      <div className="vision-bar-b" aria-hidden="true" />

      {/* ── Radial background glow ───────────────────────────────────────────── */}
      <div className="vision-glow" aria-hidden="true" />

      {/* ── Scanline overlay ─────────────────────────────────────────────────── */}
      <div className="vision-scanlines" aria-hidden="true" />

      {/* ── Floating accent particles ────────────────────────────────────────── */}
      <div className="vision-particles" aria-hidden="true">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="vision-particle"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.s}px`, height: `${p.s}px`, opacity: p.o }}
          />
        ))}
      </div>

      {/* ── Decoratives ─────────────────────────────────────────────────────── */}
      <span className="deco deco-rot     deco-light" style={{ top: '6%',    right: '3%' }}>VISION/</span>
      <span className="deco deco-code    deco-light" style={{ bottom: '8%', left:  '3%' }}>FILE<br />PDF<br />2.4MB</span>
      <span className="deco deco-checker deco-light" style={{ top: '15%',   left:  '2%' }}>▚▞▚</span>
      <span className="deco deco-rot     deco-light" style={{ bottom: '25%', right: '2%' }}>EXPORT/</span>
      <span className="deco deco-code    deco-light" style={{ top: '35%',   right: '1%' }}>CERT<br />VALID</span>

      {/* ── Vision content ──────────────────────────────────────────────────── */}
      <div className="vision-content">

        <motion.span
          className="cin-label vision-label"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          [ 07 / 08 ] — RESUME
        </motion.span>

        <WordReveal
          lines={['I BUILD THE', 'INVISIBLE', 'INFRASTRUCTURE']}
          className="vision-headline"
          baseDelay={0.1}
        />

        <motion.p
          className="vision-sub"
          initial={{ opacity: 0, letterSpacing: '0.38em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.18em' }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.65, ease: 'easeOut' }}
        >
          THAT POWERS YOUR EXPERIENCE
        </motion.p>

        <div className="vision-rule" />

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

      </div>

      {/* ── Resume download block ────────────────────────────────────────────── */}
      <div className="resume-inner">

        <h2 className="resume-title" aria-label="RESUME">
          <span className="resume-title-l">RE</span><span className="resume-title-r">SUME</span>
        </h2>

        <div className="resume-rule" />

        <div className="resume-stats">
          {[
            { val: '4+',   label: 'YRS EXP' },
            { val: '10+',  label: 'PROJECTS' },
            { val: 'M.SC', label: 'DEGREE' },
            { val: 'RO',   label: 'LOCATION' },
          ].map(({ val, label }) => (
            <div key={label} className="resume-stat">
              <span className="resume-stat-val">{val}</span>
              <span className="resume-stat-label">{label}</span>
            </div>
          ))}
        </div>

        <p className="resume-body">
          Master's graduate in Advanced Programming and Databases.<br />
          4+ years of backend engineering across enterprise environments.<br />
          Available for full-time roles and freelance projects.
        </p>

        <motion.div
          className="resume-ctas"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <motion.a
            href="https://trifadrian.ro/Adrian_Trif_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="resume-dl-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
          >
            DOWNLOAD CV ↗
          </motion.a>

          <motion.a
            href="mailto:adiitrif14@gmail.com"
            className="resume-contact-btn"
            whileHover={{ borderColor: '#c0fe03', color: '#c0fe03' }}
            transition={{ duration: 0.16 }}
          >
            GET IN TOUCH
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}
