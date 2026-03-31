import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { label: 'GITHUB',    href: 'https://github.com/adrian909',                          tag: '@adrian909' },
  { label: 'LINKEDIN',  href: 'https://www.linkedin.com/in/adrian-trif-458968187',     tag: '/in/adrian-trif' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/trifadii',                    tag: '@trifadii' },
];

export default function ContactSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Section title — clip-up reveal
      gsap.fromTo('.contact-title-word',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0, opacity: 1,
          stagger: 0.08, duration: 1.0, ease: 'power4.out',
          scrollTrigger: { trigger: '.contact-head', start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // Tagline
      gsap.fromTo('.contact-tagline',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.7,
          scrollTrigger: { trigger: '.contact-head', start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // Horizontal rule
      gsap.fromTo('.contact-rule',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1, duration: 1.1, ease: 'power4.inOut',
          scrollTrigger: { trigger: '.contact-rule', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // Contact items stagger in from bottom
      gsap.fromTo('.contact-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.12, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-grid', start: 'top 78%', toggleActions: 'play none none none' },
        }
      );

      // Socials stagger
      gsap.fromTo('.contact-social',
        { opacity: 0, x: -18 },
        {
          opacity: 1, x: 0,
          stagger: 0.1, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: '.contact-socials', start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // Availability beacon blink
      gsap.to('.contact-beacon',
        { opacity: 0.2, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="cinematic-section contact-section">

      {/* Decoratives */}
      <span className="deco deco-rot     deco-light" style={{ top: '8%',    left:  '3%' }}>CONNECT/</span>
      <span className="deco deco-checker deco-light" style={{ bottom: '12%', right: '5%' }}>▚▞▚▞</span>
      <span className="deco deco-code    deco-light" style={{ top: '20%',   right: '8%' }}>INBOX<br />MSG#01</span>
      <span className="deco deco-rot     deco-light" style={{ bottom: '8%', right:  '2%' }}>SIGNAL/</span>
      <span className="deco deco-code    deco-light" style={{ bottom: '5%', left:   '8%' }}>PING<br />200<br />OK</span>
      <span className="deco deco-checker deco-light" style={{ top: '42%',   left:   '1%' }}>▚▞▚</span>

      {/* ── Section head ──────────────────────────────────────────── */}
      <div className="contact-head">
        <span className="cin-label">[ 09 / 09 ] — CONTACT</span>

        {/* Title words each in their own clip-mask */}
        <h2 className="contact-title">
          {['LET\'S', 'WORK', 'TOGETHER'].map((word, i) => (
            <span key={i} className="contact-title-outer">
              <span className="contact-title-word">{word}</span>
            </span>
          ))}
        </h2>

        <p className="contact-tagline cin-sub">
          AVAILABLE FOR FREELANCE & FULL-TIME — ALBA IULIA, ROMANIA
        </p>
      </div>

      {/* Accent rule */}
      <div className="contact-rule" />

      {/* ── Contact grid ──────────────────────────────────────────── */}
      <div className="contact-grid">

        {/* Email */}
        <motion.div className="contact-item contact-item--email">
          <span className="contact-item-label">EMAIL</span>
          <motion.a
            href="mailto:adiitrif14@gmail.com"
            className="contact-item-value"
            whileHover={{ color: '#c0fe03', x: 6 }}
            transition={{ duration: 0.15 }}
          >
            adiitrif14@gmail.com ↗
          </motion.a>
        </motion.div>

        {/* Phone */}
        <motion.div className="contact-item contact-item--phone">
          <span className="contact-item-label">PHONE</span>
          <motion.a
            href="tel:+40732166568"
            className="contact-item-value"
            whileHover={{ color: '#c0fe03', x: 6 }}
            transition={{ duration: 0.15 }}
          >
            +40 732 166 568 ↗
          </motion.a>
        </motion.div>

        {/* Location */}
        <div className="contact-item contact-item--loc">
          <span className="contact-item-label">LOCATION</span>
          <span className="contact-item-value">Alba Iulia, Romania</span>
        </div>

        {/* Availability */}
        <div className="contact-item contact-item--status">
          <span className="contact-item-label">STATUS</span>
          <span className="contact-item-value contact-available">
            <span className="contact-beacon" />
            AVAILABLE FOR HIRE
          </span>
        </div>

      </div>

      {/* ── Social links ────────────────────────────────────────────── */}
      <div className="contact-socials">
        {SOCIALS.map(({ label, href, tag }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="contact-social"
            whileHover={{ borderColor: '#c0fe03', color: '#c0fe03', y: -3 }}
            transition={{ duration: 0.16 }}
          >
            <span className="contact-social-label">{label}</span>
            <span className="contact-social-tag">{tag}</span>
          </motion.a>
        ))}
      </div>

      {/* ── Primary CTA ─────────────────────────────────────────────── */}
      <motion.div
        className="contact-cta-wrap"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.a
          href="mailto:adiitrif14@gmail.com"
          className="contact-cta"
          whileHover={{ scale: 1.04, boxShadow: '0 0 42px rgba(192,254,3,0.45)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 22 }}
        >
          SEND A MESSAGE ↗
        </motion.a>
      </motion.div>

    </section>
  );
}
