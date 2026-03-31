import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Education data ──────────────────────────────────────────────────────────
const DEGREES = [
  {
    num:        '01',
    period:     '2020 — 2022',
    degree:     'MASTER OF SCIENCE',
    field:      'ADVANCED PROGRAMMING & DATABASES',
    university: 'POLYTECHNIC UNIVERSITY OF TIMISOARA',
    location:   'Timisoara, Romania',
    summary:    'Graduate studies in distributed systems, advanced database architecture, and scalable software engineering.',
    desc:       'Deepened expertise in database optimization, advanced programming paradigms, and enterprise software design patterns. Research-oriented curriculum with a strong emphasis on practical application in real-world backend systems.',
    tags:       ['Distributed Systems', 'Advanced SQL', 'Software Architecture', 'Research', 'C#', 'Java'],
    year:       '2022',
  },
  {
    num:        '02',
    period:     '2016 — 2020',
    degree:     'BACHELOR OF SCIENCE',
    field:      'COMPUTER SCIENCE',
    university: '1 DECEMBRIE 1918 UNIVERSITY',
    location:   'Alba Iulia, Romania',
    summary:    'Foundational education in computer science, algorithms, and full-stack software development.',
    desc:       'Built comprehensive skills across programming fundamentals, data structures, database systems, and web development. Graduated with a strong applied focus, working on real projects throughout the program.',
    tags:       ['Algorithms', 'Data Structures', 'OOP', 'Databases', 'Web Dev', 'Networks'],
    year:       '2020',
  },
];

export default function StudiesSection() {
  const sectionRef = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      // Title split — "STU" from left, "DIES" from right
      gsap.fromTo('.studies-title-l',
        { x: '-8vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: '.studies-head', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo('.studies-title-r',
        { x: '8vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: '.studies-head', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo('.studies-head-meta',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, delay: 0.3,
          scrollTrigger: { trigger: '.studies-head', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // Vertical bar — scrub grows as section scrolls into view
      gsap.fromTo('.studies-vbar',
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: '.studies-timeline',
            start: 'top 65%',
            end:   'bottom 55%',
            scrub: 1,
          },
        }
      );

      // Entry dots pop in
      document.querySelectorAll('.studies-entry-dot').forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot.closest('.studies-entry'),
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Per-entry animations
      document.querySelectorAll('.studies-entry').forEach((entry) => {

        gsap.fromTo(entry.querySelector('.studies-rule'),
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1, duration: 1.2, ease: 'power4.inOut',
            scrollTrigger: { trigger: entry, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );

        gsap.fromTo(entry.querySelector('.studies-bg-year'),
          { opacity: 0, x: 80 },
          {
            opacity: 1, x: 0, duration: 1.4, ease: 'power3.out',
            scrollTrigger: { trigger: entry, start: 'top 78%', toggleActions: 'play none none none' },
          }
        );

        gsap.fromTo(entry.querySelector('.studies-degree'),
          { yPercent: 108 },
          {
            yPercent: 0, duration: 1.0, ease: 'power4.out',
            scrollTrigger: { trigger: entry, start: 'top 75%', toggleActions: 'play none none none' },
          }
        );

        gsap.fromTo(entry.querySelector('.studies-uni-wrap'),
          { opacity: 0, x: 36 },
          {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: entry, start: 'top 72%', toggleActions: 'play none none none' },
          }
        );

        gsap.fromTo(entry.querySelector('.studies-summary'),
          { opacity: 0, y: 14 },
          {
            opacity: 1, y: 0, duration: 0.7, delay: 0.12,
            scrollTrigger: { trigger: entry, start: 'top 70%', toggleActions: 'play none none none' },
          }
        );

        gsap.fromTo(entry.querySelector('.studies-desc'),
          { opacity: 0, y: 14 },
          {
            opacity: 1, y: 0, duration: 0.7, delay: 0.22,
            scrollTrigger: { trigger: entry, start: 'top 68%', toggleActions: 'play none none none' },
          }
        );

        gsap.fromTo(entry.querySelectorAll('.cin-tag'),
          { opacity: 0, y: 20, scale: 0.88 },
          {
            opacity: 1, y: 0, scale: 1,
            stagger: 0.055, duration: 0.45, ease: 'back.out(1.6)',
            scrollTrigger: { trigger: entry, start: 'top 65%', toggleActions: 'play none none none' },
          }
        );
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="studies" ref={sectionRef} className="cinematic-section studies-section">

      {/* Decoratives */}
      <span className="deco deco-rot   deco-light" style={{ top: '4%',    right: '3%' }}>ACADEMIC/</span>
      <span className="deco deco-code  deco-light" style={{ bottom: '6%', left:  '2%' }}>EDU<br />M.SC<br />BSC</span>
      <span className="deco deco-checker deco-light" style={{ top: '50%', left: '1%'  }}>▚▞▚</span>
      <span className="deco deco-rot   deco-light" style={{ bottom: '18%', right: '1%' }}>DEGREE/</span>

      {/* ── Section heading ─────────────────────────────────────────────── */}
      <div className="studies-head">
        <div className="studies-head-meta">
          <span className="cin-label">[ 04 / 09 ] — EDUCATION</span>
          <p className="cin-sub">ACADEMIC BACKGROUND & DEGREES</p>
        </div>
        <h2 className="studies-title-display" aria-label="STUDIES">
          <span className="studies-title-l">STU</span><span className="studies-title-r">DIES</span>
        </h2>
      </div>

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      <div className="studies-timeline">

        {/* Vertical bar */}
        <div className="studies-vbar" aria-hidden="true" />

        {DEGREES.map((deg, i) => (
          <article key={i} className="studies-entry">

            {/* Dot on timeline bar */}
            <div className="studies-entry-dot" aria-hidden="true" />

            {/* Background year */}
            <div className="studies-bg-year" aria-hidden="true">{deg.year}</div>

            {/* Horizontal rule */}
            <div className="studies-rule" aria-hidden="true" />

            <div className="studies-entry-grid">

              {/* Left column */}
              <div className="studies-entry-left">
                <span className="studies-entry-num">{deg.num}</span>
                <span className="studies-entry-period">{deg.period}</span>
                <span className="studies-entry-loc">{deg.location}</span>
              </div>

              {/* Right column */}
              <div className="studies-entry-right">

                {/* Degree level */}
                <div className="studies-degree-mask">
                  <h3 className="studies-degree">{deg.degree}</h3>
                </div>

                {/* University */}
                <div className="studies-uni-wrap">
                  <span className="studies-field">{deg.field}</span>
                  <span className="studies-uni">{deg.university}</span>
                </div>

                <p className="studies-summary">{deg.summary}</p>
                <p className="studies-desc">{deg.desc}</p>

                <div className="studies-tags">
                  {deg.tags.map((tag, j) => (
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
