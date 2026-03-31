import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Skill categories ─────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key:   'core',
    label: 'CORE',
    color: '#c0fe03',
    ghost: '01',
    skills: [
      { name: '.NET',  level: 95 },
      { name: 'C#',    level: 92 },
      { name: 'SQL',   level: 88 },
      { name: 'Git',   level: 90 },
      { name: 'AWS',   level: 75 },
    ],
  },
  {
    key:   'extended',
    label: 'EXTENDED',
    color: '#88ff22',
    ghost: '02',
    skills: [
      { name: 'Java',       level: 78 },
      { name: 'MySQL',      level: 82 },
      { name: 'Docker',     level: 80 },
      { name: 'SpringBoot', level: 72 },
      { name: 'REST APIs',  level: 93 },
      { name: 'Azure',      level: 68 },
    ],
  },
  {
    key:   'ecosystem',
    label: 'ECOSYSTEM',
    color: '#44bb00',
    ghost: '03',
    skills: [
      { name: 'Terraform', level: 65 },
      { name: 'Firebase',  level: 70 },
      { name: 'Flutter',   level: 60 },
      { name: 'Shopify',   level: 72 },
      { name: 'Liquid',    level: 70 },
      { name: 'Aurora',    level: 65 },
    ],
  },
];

export default function TechnologySection() {
  const sectionRef = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      // Title split — left / right slide
      gsap.fromTo('.tech-title-l',
        { x: '-6vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo('.tech-title-r',
        { x: '6vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // Accent rule scales in
      gsap.fromTo('.tech-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.1, ease: 'power4.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // Category headers stagger in
      gsap.fromTo('.tech-cat-header',
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.tech-grid', start: 'top 78%', toggleActions: 'play none none none' },
        }
      );

      // Skill bars — fill left-to-right with stagger per category
      document.querySelectorAll('.tech-cat').forEach((cat) => {
        const bars = cat.querySelectorAll('.tech-bar-fill');
        const pcts = cat.querySelectorAll('.tech-bar-pct');

        gsap.fromTo(bars,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            stagger: 0.09,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cat,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Percentage counters count up
        pcts.forEach((pct) => {
          const target = parseInt(pct.dataset.val, 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              pct.textContent = Math.round(obj.val) + '%';
            },
            scrollTrigger: {
              trigger: cat,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          });
        });
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="technology" ref={sectionRef} className="cinematic-section tech-section">

      {/* Decoratives */}
      <span className="deco deco-rot     deco-light" style={{ top: '6%',    right: '3%' }}>TECHNICAL/</span>
      <span className="deco deco-code    deco-light" style={{ bottom: '8%', left:  '2%' }}>STACK<br />2026</span>
      <span className="deco deco-checker deco-light" style={{ top: '45%',   left:  '1%' }}>▚▞▚▞</span>

      <div className="tech-inner">

        {/* Section label + split title */}
        <span className="cin-label">[ 06 / 09 ] — TECHNICAL</span>
        <h2 className="tech-title-display" aria-label="TECHNOLOGY">
          <span className="tech-title-l">TECH</span><span className="tech-title-r">NOLOGY</span>
        </h2>
        <p className="cin-sub">THE STACK THAT POWERS THE WORK</p>

        {/* Accent rule */}
        <div className="tech-rule" />

        {/* Skill grid — 3 categories side-by-side */}
        <div className="tech-grid">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="tech-cat">

              {/* Ghost number */}
              <span className="tech-cat-ghost" aria-hidden="true">{cat.ghost}</span>

              {/* Category header */}
              <div className="tech-cat-header">
                <span className="tech-cat-dot" style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}88` }} />
                <span className="tech-cat-label" style={{ color: cat.color }}>{cat.label}</span>
                <span className="tech-cat-count">{cat.skills.length} SKILLS</span>
              </div>

              {/* Skill rows */}
              <div className="tech-skill-list">
                {cat.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    className="tech-skill-row"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.14 }}
                  >
                    <div className="tech-skill-meta">
                      <span className="tech-skill-name">{skill.name}</span>
                      <span
                        className="tech-bar-pct"
                        data-val={skill.level}
                      >0%</span>
                    </div>
                    <div className="tech-bar-track">
                      <div
                        className="tech-bar-fill"
                        style={{
                          width: `${skill.level}%`,
                          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}99)`,
                          boxShadow: `0 0 8px ${cat.color}55`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
