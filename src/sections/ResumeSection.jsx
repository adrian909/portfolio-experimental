import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ResumeSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Title: "RE" from left, "SUME" from right — same split trick as Experience
      gsap.fromTo('.resume-title-l',
        { x: '-6vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo('.resume-title-r',
        { x: '6vw', opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // Horizontal rule draws in
      gsap.fromTo('.resume-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.1, ease: 'power4.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // Stats stagger in
      gsap.fromTo('.resume-stat',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.resume-stats', start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // Body text
      gsap.fromTo('.resume-body',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: '.resume-body', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // Glow pulse on the download button
      gsap.to('.resume-dl-btn', {
        boxShadow: '0 0 36px rgba(192,254,3,0.45)',
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play pause resume pause' },
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="resume" ref={sectionRef} className="cinematic-section resume-section">

      {/* Decoratives */}
      <span className="deco deco-rot     deco-light" style={{ top: '8%',    right: '3%' }}>DOWNLOAD/</span>
      <span className="deco deco-code    deco-light" style={{ bottom: '8%', left:  '3%' }}>FILE<br />PDF<br />2.4MB</span>
      <span className="deco deco-checker deco-light" style={{ top: '15%',   left:  '2%' }}>▚▞▚</span>
      <span className="deco deco-rot     deco-light" style={{ bottom: '25%', right: '2%' }}>EXPORT/</span>
      <span className="deco deco-code    deco-light" style={{ top: '35%',   right: '1%' }}>CERT<br />VALID</span>

      <div className="resume-inner">

        {/* Label */}
        <span className="cin-label">[ 08 / 09 ] — RESUME</span>

        {/* Split title */}
        <h2 className="resume-title" aria-label="RESUME">
          <span className="resume-title-l">RE</span><span className="resume-title-r">SUME</span>
        </h2>

        {/* Accent rule */}
        <div className="resume-rule" />

        {/* Mini stats row — reinforces credibility */}
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

        {/* Description */}
        <p className="resume-body">
          Master's graduate in Advanced Programming and Databases.<br />
          4+ years of backend engineering across enterprise environments.<br />
          Available for full-time roles and freelance projects.
        </p>

        {/* CTA buttons */}
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
