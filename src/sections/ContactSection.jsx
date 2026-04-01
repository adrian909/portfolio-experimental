import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { label: 'GITHUB',    href: 'https://github.com/adrian909',                        tag: '@adrian909'    },
  { label: 'LINKEDIN',  href: 'https://www.linkedin.com/in/adrian-trif-458968187',   tag: '/in/adrian-trif' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/trifadii',                  tag: '@trifadii'     },
];

export default function ContactSection() {
  const sectionRef = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = form;
    if (!name || !email || !message) return;
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:adiitrif14@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      gsap.fromTo('.contact-title-word',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.08, duration: 1.0, ease: 'power4.out',
          scrollTrigger: { trigger: '.contact-head', start: 'top 80%', toggleActions: 'play none none none' } }
      );
      gsap.fromTo('.contact-tagline',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7,
          scrollTrigger: { trigger: '.contact-head', start: 'top 75%', toggleActions: 'play none none none' } }
      );
      gsap.fromTo('.contact-rule',
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 1.1, ease: 'power4.inOut',
          scrollTrigger: { trigger: '.contact-rule', start: 'top 82%', toggleActions: 'play none none none' } }
      );
      gsap.fromTo('.contact-info-col',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-body', start: 'top 78%', toggleActions: 'play none none none' } }
      );
      gsap.fromTo('.contact-form-col',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-body', start: 'top 78%', toggleActions: 'play none none none' } }
      );
      gsap.fromTo('.contact-social',
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: '.contact-socials', start: 'top 82%', toggleActions: 'play none none none' } }
      );
      gsap.to('.contact-beacon',
        { opacity: 0.2, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="cinematic-section contact-section">

      <span className="deco deco-rot     deco-light" style={{ top: '8%',    left:  '3%' }}>CONNECT/</span>
      <span className="deco deco-checker deco-light" style={{ bottom: '12%', right: '5%' }}>▚▞▚▞</span>
      <span className="deco deco-code    deco-light" style={{ top: '20%',   right: '8%' }}>INBOX<br />MSG#01</span>
      <span className="deco deco-checker deco-light" style={{ top: '42%',   left:   '1%' }}>▚▞▚</span>

      {/* ── Head ────────────────────────────────────────────────── */}
      <div className="contact-head">
        <span className="cin-label">[ 08 / 08 ] — CONTACT</span>
        <h2 className="contact-title">
          {["LET'S", 'WORK', 'TOGETHER'].map((word, i) => (
            <span key={i} className="contact-title-outer">
              <span className="contact-title-word">{word}</span>
            </span>
          ))}
        </h2>
        <p className="contact-tagline cin-sub">
          AVAILABLE FOR FREELANCE & FULL-TIME — ALBA IULIA, ROMANIA
        </p>
      </div>

      <div className="contact-rule" />

      {/* ── Two-column body ─────────────────────────────────────── */}
      <div className="contact-body">

        {/* LEFT — info */}
        <div className="contact-info-col">

          <div className="contact-grid">
            <motion.div className="contact-item">
              <span className="contact-item-label">EMAIL</span>
              <motion.a href="mailto:adiitrif14@gmail.com" className="contact-item-value"
                whileHover={{ color: '#c0fe03', x: 6 }} transition={{ duration: 0.15 }}>
                adiitrif14@gmail.com ↗
              </motion.a>
            </motion.div>

            <motion.div className="contact-item">
              <span className="contact-item-label">PHONE</span>
              <motion.a href="tel:+40732166568" className="contact-item-value"
                whileHover={{ color: '#c0fe03', x: 6 }} transition={{ duration: 0.15 }}>
                +40 732 166 568 ↗
              </motion.a>
            </motion.div>

            <div className="contact-item">
              <span className="contact-item-label">LOCATION</span>
              <span className="contact-item-value">Alba Iulia, Romania</span>
            </div>

            <div className="contact-item">
              <span className="contact-item-label">STATUS</span>
              <span className="contact-item-value contact-available">
                <span className="contact-beacon" />
                AVAILABLE
              </span>
            </div>
          </div>

          <div className="contact-socials">
            {SOCIALS.map(({ label, href, tag }) => (
              <motion.a key={label} href={href} target="_blank" rel="noreferrer"
                className="contact-social"
                whileHover={{ borderColor: '#c0fe03', color: '#c0fe03', y: -3 }}
                transition={{ duration: 0.16 }}>
                <span className="contact-social-label">{label}</span>
                <span className="contact-social-tag">{tag}</span>
              </motion.a>
            ))}
          </div>

        </div>

        {/* RIGHT — form */}
        <div className="contact-form-col">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>

            <div className={`cf-field ${focused === 'name' ? 'cf-field--focus' : ''}`}>
              <label className="cf-label" htmlFor="cf-name">NAME</label>
              <input
                id="cf-name" name="name" type="text"
                className="cf-input" placeholder="Your name"
                value={form.name} onChange={handleChange}
                onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                autoComplete="name"
              />
              <span className="cf-line" />
            </div>

            <div className={`cf-field ${focused === 'email' ? 'cf-field--focus' : ''}`}>
              <label className="cf-label" htmlFor="cf-email">EMAIL</label>
              <input
                id="cf-email" name="email" type="email"
                className="cf-input" placeholder="your@email.com"
                value={form.email} onChange={handleChange}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                autoComplete="email"
              />
              <span className="cf-line" />
            </div>

            <div className={`cf-field cf-field--textarea ${focused === 'message' ? 'cf-field--focus' : ''}`}>
              <label className="cf-label" htmlFor="cf-message">MESSAGE</label>
              <textarea
                id="cf-message" name="message"
                className="cf-input cf-textarea" placeholder="Tell me about your project..."
                rows={5} value={form.message} onChange={handleChange}
                onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
              />
              <span className="cf-line" />
            </div>

            <motion.button
              type="submit"
              className={`cf-submit ${sent ? 'cf-submit--sent' : ''}`}
              whileHover={!sent ? { scale: 1.03, boxShadow: '0 0 36px rgba(192,254,3,0.4)' } : {}}
              whileTap={!sent ? { scale: 0.97 } : {}}
              transition={{ type: 'spring', stiffness: 340, damping: 22 }}
            >
              {sent ? 'MESSAGE SENT ✓' : 'SEND MESSAGE ↗'}
            </motion.button>

          </form>
        </div>

      </div>

    </section>
  );
}
