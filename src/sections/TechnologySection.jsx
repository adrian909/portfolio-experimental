import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Tech rows — 3 categories, each scrolls at different speed/direction ──────
const ROWS = [
  {
    label: 'Backend',
    color: '#c0fe03',
    dir: 'left',
    duration: 22,
    techs: ['.NET', 'C#', 'Java', 'SpingBoot', 'Aspose', 'OpenXML'],
  },
  {
    label: 'Database',
    color: 'rgba(255,255,255,0.82)',
    dir: 'right',
    duration: 30,
    techs: ['Aurora', 'Redshift', 'MySQL', 'Dynamo', 'Firebase'],
  },
  {
    label: 'Cloud & DevOps',
    color: 'rgba(255,255,255,0.82)',
    dir: 'left',
    duration: 40,
    techs: ['AWS', 'Docker', 'Terraform', 'Azure', 'Git', 'Agile teamwork'],
  },
  {
    label: 'Mobile Development',
    color: 'rgba(255,255,255,0.60)',
    dir: 'right',
    duration: 10,
    techs: ['Android Studio', 'Flutter', 'Dart'],
  },
  {
    label: 'E-commerce',
    color: 'rgba(255,255,255,0.60)',
    dir: 'left',
    duration: 10,
    techs: ['Shopify', 'Shopify Apps' , 'Liquid'],
  },
];

export default function TechnologySection() {
  const sectionRef = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      // Title split slides in
      gsap.fromTo('.tech-title-l',
        { x: '-6vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' } }
      );
      gsap.fromTo('.tech-title-r',
        { x: '6vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' } }
      );

      // Each row fades + slides up on scroll
      gsap.fromTo('.tech-row',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          stagger: 0.15, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.tech-rows', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // Pause marquee when section leaves viewport (perf)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => document.querySelectorAll('.tech-marquee-track').forEach(el => el.style.animationPlayState = 'running'),
        onLeave: () => document.querySelectorAll('.tech-marquee-track').forEach(el => el.style.animationPlayState = 'paused'),
        onEnterBack: () => document.querySelectorAll('.tech-marquee-track').forEach(el => el.style.animationPlayState = 'running'),
        onLeaveBack: () => document.querySelectorAll('.tech-marquee-track').forEach(el => el.style.animationPlayState = 'paused'),
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="technology" ref={sectionRef} className="cinematic-section tech-section">

      <span className="deco deco-rot     deco-light" style={{ top: '6%',    right: '3%' }}>TECHNICAL/</span>
      <span className="deco deco-code    deco-light" style={{ bottom: '8%', left:  '2%' }}>STACK<br />2025</span>
      <span className="deco deco-checker deco-light" style={{ top: '45%',   left:  '1%' }}>▚▞▚▞</span>

      <div className="tech-inner">

        {/* Header */}
        <span className="cin-label">[ 06 / 09 ] — TECHNICAL STACK</span>
        <h2 className="tech-title-display" aria-label="TECHNOLOGY">
          <span className="tech-title-l">TECH</span><span className="tech-title-r">NOLOGY</span>
        </h2>
        <p className="cin-sub">THE STACK THAT POWERS THE WORK</p>

        {/* Marquee rows */}
        <div className="tech-rows">
          {ROWS.map((row) => (
            <div key={row.label} className="tech-row">

              {/* Fixed label on left */}
              <div className="tech-row-label" style={{ color: row.color }}>
                {row.label}
              </div>

              {/* Scrolling ticker */}
              <div className="tech-row-ticker">
                <div
                  className={`tech-marquee-track tech-marquee-${row.dir}`}
                  style={{ animationDuration: `${row.duration}s` }}
                >
                  {/* Duplicate for seamless loop */}
                  {[...row.techs, ...row.techs].map((tech, i) => (
                    <span key={i} className="tech-marquee-item" style={{ color: row.color }}>
                      <span className="tech-marquee-dot" style={{ background: row.color }} />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
