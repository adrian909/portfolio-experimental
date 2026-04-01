import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Real content from trifadrian.ro ──────────────────────────────────────────
const JOBS = [
  {
    num: '01',
    period: '2022 — PRESENT',
    role: 'PROGRAMMER',
    company: 'TOLUNA ROMANIA',
    location: 'Timisoara, Romania',
    summary: 'Enterprise-scale backend engineering at a global survey intelligence company.',
    desc: [
      'Developed and maintained scalable backend systems using .NET technologies.',
      'Designed and integrated RESTful APIs to enhance application functionality.',
      'Collaborated with cross-functional teams to implement effective database management solutions.',
      'Conducted code reviews and implemented best practices to ensure code quality.',
      'Optimized existing code for performance improvements and bug fixes.',
    ],
    stack: ['.NET', 'C#', 'AWS', 'Terraform'],
    year: '2022',
  },
  {
    num: '02',
    period: '2021 — 2021',
    role: 'BACKEND DEVELOPER INTERN',
    company: 'IBM ROMANIA',
    location: 'Timisoara, Romania',
    summary: 'Enterprise-grade engineering at one of the world\'s largest technology companies.',
    desc: [
      'Built a web application using Angular and SpringBoot, enhancing user experience and interface design.',
      'Developed robust Java-based backend services, ensuring optimal performance and scalability.',
      'Implemented API integrations to streamline communication between front-end and back-end systems.',
    ],
    stack: ['Angular', 'SpringBoot', 'Java', 'JavaScript'],
    year: '2021',
  },
  {
    num: '03',
    period: '2020 — 2020',
    role: 'JUNIOR PROGRAMMER ANALYST',
    company: 'SC IPEC SA',
    location: 'Alba Iulia, Romania',
    summary: 'Industrial automation and full-stack development in manufacturing.',
    desc: [
      'Assisted in industrial robot programming and automation.',
      'Performed database operations for manufacturing processes.',
      'Contributed to full-stack web development tasks.',
    ],
    stack: ['MySQL', 'HTML', 'CSS', 'JavaScript'],
    year: '2020',
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      // ── Section title — letters split into two halves that "close" together ──
      // The word EXPERIENCE is split: "EXPERI" from left, "ENCE" from right
      gsap.fromTo('.exp-title-left',
        { x: '-8vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.exp-head', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo('.exp-title-right',
        { x: '8vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.exp-head', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo('.exp-head-meta',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, delay: 0.3,
          scrollTrigger: { trigger: '.exp-head', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // ── Vertical timeline bar — scrub grows as you scroll through section ──
      gsap.fromTo('.exp-vbar',
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: '.exp-timeline',
            start: 'top 65%',
            end: 'bottom 55%',
            scrub: 1,
          },
        }
      );

      // Each entry dot fades in as bar passes it
      document.querySelectorAll('.exp-entry-dot').forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot.closest('.exp-entry'),
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // ── Each job entry: staggered 3-D perspective reveal ──────────────────
      // rotateX pulls the entry back/forward for a cinematic "card flipping into view" feel
      document.querySelectorAll('.exp-entry').forEach((entry) => {

        // The horizontal divider line draws left-to-right (scaleX 0→1)
        gsap.fromTo(entry.querySelector('.exp-rule'),
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1, duration: 1.2, ease: 'power4.inOut',
            scrollTrigger: {
              trigger: entry,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Giant background year fades in from the right
        gsap.fromTo(entry.querySelector('.exp-bg-year'),
          { opacity: 0, x: 80 },
          {
            opacity: 1, x: 0, duration: 1.4, ease: 'power3.out',
            scrollTrigger: {
              trigger: entry, start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Role title — clips upward from an overflow:hidden mask
        gsap.fromTo(entry.querySelector('.exp-role'),
          { yPercent: 108 },
          {
            yPercent: 0, duration: 1.0, ease: 'power4.out',
            scrollTrigger: {
              trigger: entry, start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Company + location slide in from right
        gsap.fromTo(entry.querySelector('.exp-co-wrap'),
          { opacity: 0, x: 36 },
          {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: entry, start: 'top 72%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Summary tagline
        gsap.fromTo(entry.querySelector('.exp-summary'),
          { opacity: 0, y: 14 },
          {
            opacity: 1, y: 0, duration: 0.7, delay: 0.12,
            scrollTrigger: {
              trigger: entry, start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Description paragraph
        gsap.fromTo(entry.querySelector('.exp-desc'),
          { opacity: 0, y: 14 },
          {
            opacity: 1, y: 0, duration: 0.7, delay: 0.22,
            scrollTrigger: {
              trigger: entry, start: 'top 68%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Stack tags stagger in from below
        gsap.fromTo(entry.querySelectorAll('.cin-tag'),
          { opacity: 0, y: 20, scale: 0.88 },
          {
            opacity: 1, y: 0, scale: 1,
            stagger: 0.055, duration: 0.45, ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: entry, start: 'top 65%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="cinematic-section exp-section">

      {/* Ambient decoratives — matching site brutalist style */}
      <span className="deco deco-rot   deco-light" style={{ top: '4%',  right: '3%' }}>CAREER/</span>
      <span className="deco deco-code  deco-light" style={{ bottom: '6%', left: '2%' }}>EXP<br />03.YRS</span>
      <span className="deco deco-checker deco-light" style={{ top: '50%', left: '1%' }}>▚▞▚</span>
      <span className="deco deco-code  deco-light" style={{ top: '5%',  left: '6%'  }}>SYS<br />WORK<br />++</span>
      <span className="deco deco-rot   deco-light" style={{ bottom: '18%', right: '1%' }}>RUNTIME/</span>

      {/* ── Section heading ─────────────────────────────────────────────── */}
      <div className="exp-head">
        <div className="exp-head-meta">
          <span className="cin-label">[ 03 / 09 ] — CAREER TIMELINE</span>
          <p className="cin-sub">BUILDING AT SCALE SINCE 2020</p>
        </div>
        <h2 className="exp-title-display" aria-label="EXPERIENCE">
          <span className="exp-title-left">EXPERI</span><span className="exp-title-right">ENCE</span>
        </h2>
      </div>

      {/* ── Timeline entries ─────────────────────────────────────────────── */}
      <div className="exp-timeline">

        {/* Vertical bar — GSAP scrub animates scaleY */}
        <div className="exp-vbar" aria-hidden="true" />

        {JOBS.map((job, i) => (
          <article key={i} className={`exp-entry exp-entry-${i}`}>
            {/* Dot on the timeline bar */}
            <div className="exp-entry-dot" aria-hidden="true" />

            {/* Faint giant year behind the content */}
            <div className="exp-bg-year" aria-hidden="true">{job.year}</div>

            {/* Horizontal rule — GSAP-animated scaleX */}
            <div className="exp-rule" aria-hidden="true" />

            <div className="exp-entry-grid">

              {/* Left column — index + date */}
              <div className="exp-entry-left">
                <span className="exp-entry-num">{job.num}</span>
                <span className="exp-entry-period">{job.period}</span>
                <span className="exp-entry-loc">{job.location}</span>
              </div>

              {/* Right column — content */}
              <div className="exp-entry-right">

                {/* Role title — wrapped for clip-mask reveal */}
                <div className="exp-role-mask">
                  <h3 className="exp-role">{job.role}</h3>
                </div>

                {/* Company */}
                <div className="exp-co-wrap">
                  <span className="exp-company">{job.company}</span>
                </div>

                {/* Tagline */}
                <p className="exp-summary">{job.summary}</p>

                {/* Full description */}
                <ul className="exp-desc">
                  {job.desc.map((point, k) => (
                    <li key={k}>{point}</li>
                  ))}
                </ul>

                {/* Tech stack — Framer Motion hover on each tag */}
                <div className="exp-stack">
                  {job.stack.map((tag, j) => (
                    <motion.span
                      key={j}
                      className="cin-tag"
                      whileHover={{ backgroundColor: '#c0fe03', color: '#000', borderColor: '#c0fe03' }}
                      transition={{ duration: 0.11 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

              </div>
            </div>

          </article>
        ))}
      </div>

    </section>
  );
}
