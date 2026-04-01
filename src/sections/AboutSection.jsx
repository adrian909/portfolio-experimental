import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BIO = [
  {
    tag: 'BACKGROUND',
    text: (
      <>
        Master's graduate specialized in <span className="about-kw">backend development</span>,
        with solid experience in <span className="about-kw">.NET</span> technologies,{' '}
        <span className="about-kw">API design</span>, and{' '}
        <span className="about-kw">database management</span>.
      </>
    ),
  },
  {
    tag: 'APPROACH',
    text: (
      <>
        Skilled in building <span className="about-kw">scalable</span> and reliable server-side
        solutions, optimizing data flows, and integrating{' '}
        <span className="about-kw">modern architectures</span>.
      </>
    ),
  },
  {
    tag: 'DRIVE',
    text: (
      <>
        Passionate about solving complex problems, eager to learn new technologies, and motivated
        to contribute to collaborative, high-impact{' '}
        <span className="about-kw">software engineering</span> projects.
      </>
    ),
  },
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      // Title split
      gsap.fromTo('.about-title-l',
        { x: '-6vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none none' } }
      );
      gsap.fromTo('.about-title-r',
        { x: '6vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none none' } }
      );

      // Bio blocks stagger in
      gsap.fromTo('.about-bio-block',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, stagger: 0.14, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-body', start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // Terminal slides in from right
      gsap.fromTo('.about-terminal-wrap',
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-body', start: 'top 78%', toggleActions: 'play none none none' },
        }
      );

      // Rule draws in
      gsap.fromTo('.about-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.1, ease: 'power4.inOut',
          scrollTrigger: { trigger: '.about-rule', start: 'top 84%', toggleActions: 'play none none none' },
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="cinematic-section about-section">

      <span className="deco deco-rot     deco-light" style={{ top: '5%',    right: '3%' }}>PORTFOLIO/</span>
      <span className="deco deco-code    deco-light" style={{ bottom: '8%', right: '5%' }}>VER 2.0<br />BUILD OK</span>
      <span className="deco deco-checker deco-light" style={{ top: '50%',   left:  '2%' }}>▚▞▚</span>
      <span className="deco deco-rot     deco-light" style={{ bottom: '20%', left: '1%' }}>BACKEND/</span>
      <span className="deco deco-code    deco-light" style={{ top: '35%',   right: '1%' }}>FREQ<br />440HZ</span>

      <div className="about-inner">

        {/* Header */}
        <span className="cin-label">[ 02 / 08 ] — ABOUT</span>
        <h2 className="about-title-display" aria-label="ABOUT">
          <span className="about-title-l">AB</span><span className="about-title-r">OUT</span>
        </h2>
        <p className="cin-sub">BACKEND DEVELOPER — ALBA IULIA, ROMANIA</p>

        <div className="about-rule" />

        {/* Two-column body */}
        <div className="about-body">

          {/* Left — bio */}
          <div className="about-bio-col">
            {BIO.map(({ tag, text }) => (
              <div key={tag} className="about-bio-block">
                <span className="about-bio-tag">{tag}</span>
                <p className="about-bio-text">{text}</p>
              </div>
            ))}
          </div>

          {/* Right — terminal */}
          <div className="about-terminal-wrap">
            <div className="about-terminal">
              <div className="about-terminal-header">
                <span className="about-terminal-dot" style={{ background: '#ff5f56' }} />
                <span className="about-terminal-dot" style={{ background: '#ffbd2e' }} />
                <span className="about-terminal-dot" style={{ background: '#27c93f' }} />
                <span className="about-terminal-title">sys.profile</span>
              </div>
              <div className="about-terminal-body">
                <p><span className="abt-prompt">&gt;</span> <span className="abt-cmd">whois</span> adrian.trif</p>
                <br />
                <p><span className="abt-key">NAME</span>     <span className="abt-val">Adrian Trif</span></p>
                <p><span className="abt-key">ROLE</span>     <span className="abt-val">Backend Developer</span></p>
                <p><span className="abt-key">LOCATION</span> <span className="abt-val">Alba Iulia, Romania</span></p>
                <p><span className="abt-key">STACK</span>    <span className="abt-val">.NET / C# / SQL</span></p>
                <p><span className="abt-key">FOCUS</span>    <span className="abt-val">APIs &amp; Scalable Systems</span></p>
                <p><span className="abt-key">DEGREE</span>   <span className="abt-val">M.Sc Advanced Programming</span></p>
                <p><span className="abt-key">STATUS</span>   <span className="abt-val abt-status">&#x25CF; AVAILABLE</span></p>
                <br />
                <p><span className="abt-prompt">&gt;</span> <span className="abt-blink">_</span></p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
