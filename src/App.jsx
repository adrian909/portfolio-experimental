import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import './App.css'
import './cinematic.css'

// Lazy-load the heavy cinematic sections so Three.js only ships when needed
const AboutSection      = lazy(() => import('./sections/AboutSection'));
const ExperienceSection = lazy(() => import('./sections/ExperienceSection'));
const StudiesSection    = lazy(() => import('./sections/StudiesSection'));
const ProjectsSection   = lazy(() => import('./sections/ProjectsSection'));
const TechnologySection = lazy(() => import('./sections/TechnologySection'));
const ResumeSection     = lazy(() => import('./sections/ResumeSection'));
const ContactSection    = lazy(() => import('./sections/ContactSection'));

import CustomCursor   from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';

function App() {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    let windowReady = document.readyState === 'complete';
    let videoReady = isMobile; // skip video wait on mobile

    const tryFinish = () => {
      if (windowReady && videoReady) {
        setTimeout(() => setLoading(false), 300);
      }
    };

    const onWindowLoad = () => { windowReady = true; tryFinish(); };
    const onVideoReady = () => { videoReady = true; tryFinish(); };

    if (!windowReady) {
      window.addEventListener('load', onWindowLoad);
    }

    if (!isMobile) {
      const vid = videoRef.current;
      if (vid) {
        if (vid.readyState >= 4) {
          videoReady = true;
        } else {
          vid.addEventListener('canplaythrough', onVideoReady);
        }
      }
    }

    // Fallback: if video takes too long, show site after 6s
    const fallback = setTimeout(() => {
      videoReady = true;
      windowReady = true;
      tryFinish();
    }, 6000);

    tryFinish();

    return () => {
      window.removeEventListener('load', onWindowLoad);
      const vid = videoRef.current;
      if (vid) vid.removeEventListener('canplaythrough', onVideoReady);
      clearTimeout(fallback);
    };
  }, []);

  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [dividerVisible, setDividerVisible] = useState(false);
  const [headerDark, setHeaderDark] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setDividerVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 50) {
        setHeaderVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        setHeaderVisible(false);
      } else if (currentY < lastScrollY.current - 5) {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect if header is over dark content (not intro)
  useEffect(() => {
    const introEl = document.getElementById('intro');
    if (!introEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderDark(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(introEl);
    return () => observer.disconnect();
  }, [loading]);

  const navItems = [
    { label: 'INTRO',      num: '/01', id: 'intro' },
    { label: 'ABOUT',      num: '/02', id: 'about' },
    { label: 'EXPERIENCE', num: '/03', id: 'experience' },
    { label: 'STUDIES',    num: '/04', id: 'studies' },
    { label: 'PROJECTS',   num: '/05', id: 'projects' },
    { label: 'TECHNOLOGY', num: '/06', id: 'technology' },
    { label: 'RESUME',     num: '/07', id: 'resume' },
    { label: 'CONTACT',    num: '/08', id: 'contact' },
  ];

  // Auto-detect active section on scroll
  useEffect(() => {
    const ids = navItems.map(item => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id);
            if (idx !== -1) setActiveItem(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll reveal animations
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, [loading]);

  const smoothScroll = (targetY, duration = 1600) => {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    let start;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, startY + diff * ease);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const scrollToSection = (id, index) => {
    setActiveItem(index);
    setDrawerOpen(false);
    setTimeout(() => {
      if (id === 'intro') {
        smoothScroll(0);
      } else {
        const el = document.getElementById(id);
        if (el) smoothScroll(el.getBoundingClientRect().top + window.pageYOffset);
      }
    }, 350);
  };

  return (
    <>
      {/* GLOBAL UI OVERLAYS */}
      <CustomCursor />
      <ScrollProgress />

      {/* â•â•â• LOADING SCREEN â•â•â• */}
      <div className={`loader-screen${loading ? '' : ' loaded'}`}>
        <div className="loader-content">
          <span className="loader-code">SYS.INIT</span>
          <div className="loader-bar-track">
            <div className="loader-bar-fill"></div>
          </div>
          <span className="loader-status">LOADING ASSETS<span className="loader-dots">...</span></span>
        </div>
      </div>

      <div className="menu">
        <p className={`top-left-label${headerDark ? ' header-light' : ''}${!headerVisible ? ' header-hidden' : ''}`}>
          <span style={{ color: 'gray' }}>RO LOCAL/</span>
          <b>{date.toLocaleTimeString()}</b>
        </p>
      </div>

      <button className={`menu-btn${headerDark ? ' header-light' : ''}${!headerVisible ? ' header-hidden' : ''}`} onClick={() => setDrawerOpen(!drawerOpen)}>
        {drawerOpen ? 'CLOSE' : 'MENU'}
      </button>

      <div id="intro" className="main-center">
        <span className="deco deco-rot" style={{top:'15%',left:'5%'}}>EXPLORATION/</span>
        <span className="deco deco-rot" style={{top:'40%',right:'4%'}}>DEVELOPMENT/</span>
        <span className="deco deco-code" style={{bottom:'18%',left:'6%'}}>00.01.RO</span>
        <span className="deco deco-checker" style={{top:'20%',right:'8%'}}>▚▞▚▞</span>
        <span className="deco deco-code" style={{top:'12%',right:'20%'}}>REF#2026</span>
        <span className="deco deco-rot" style={{bottom:'30%',left:'2%'}}>SYSTEMS/</span>
        <span className="deco deco-code" style={{top:'8%',left:'15%'}}>NODE_03<br/>ACTIVE</span>
        <span className="deco deco-checker" style={{bottom:'25%',right:'15%'}}>▚▞▚</span>
        <span className="deco deco-code" style={{bottom:'20%',right:'5%'}}>LAT 46.07<br/>LNG 23.58</span>
        <span className="deco deco-rot" style={{top:'60%',left:'8%'}}>DIGITAL/</span>
        <div className="freelance-label reveal reveal-fade-down" style={{transitionDelay:'0.2s'}}>
          <h3>//AVAILABLE FOR FREELANCE</h3>
        </div>
        <h1 className="name-title reveal reveal-scale">
          ADRIAN<br />TRIF
        </h1>
        <div className="location-label reveal reveal-fade-up" style={{transitionDelay:'0.4s'}}>
          <p>Alba Iulia, Alba, RO</p>
          <p>///BACKEND DEVELOPER <span style={{ color: 'gray' }}>+ FREELANCER</span></p>
        </div>
      </div>

      {/* â•â•â• PARALLAX DIVIDER â•â•â• */}
      <div className="parallax-divider-wrapper" ref={wrapperRef}>
        <div className={`parallax-divider${dividerVisible ? ' visible' : ''}`}>
          {isMobile ? (
            <img
              src="/divider-poster.jpg"
              alt=""
              className="divider-img"
            />
          ) : (
            <video
              ref={videoRef}
              src="/divider-bg.mp4"
              poster="/divider-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          )}
          <div className="divider-dark-overlay"></div>
          <div className="divider-grain"></div>
        </div>
      </div>

      {/* â•â•â• SECTIONS â•â•â• */}
      {/* ─── CINEMATIC SECTIONS (GSAP + Three.js + Framer Motion) ─── */}
      <Suspense fallback={null}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={null}>
        <ExperienceSection />
      </Suspense>

      <Suspense fallback={null}>
        <StudiesSection />
      </Suspense>

      <Suspense fallback={null}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={null}>
        <TechnologySection />
      </Suspense>

      <Suspense fallback={null}>
        <ResumeSection />
      </Suspense>

      <Suspense fallback={null}>
        <ContactSection />
      </Suspense>

      <footer className="cin-footer">
        <span className="deco deco-rot   deco-light" style={{top:'15%',left:'3%'}}>END/</span>
        <span className="deco deco-checker deco-light" style={{top:'20%',right:'5%'}}>▚▞▚▞</span>
        <span className="deco deco-code  deco-light" style={{bottom:'15%',left:'8%'}}>EXIT<br/>CODE 0</span>
        <span className="deco deco-rot   deco-light" style={{bottom:'15%',right:'3%'}}>TERMINATE/</span>
        <div className="cin-footer-inner">
          <span className="cin-footer-copy">© {date.getFullYear()} — ADRIAN TRIF</span>
          <span className="cin-footer-loc">ALBA IULIA, ROMANIA</span>
          <span className="cin-footer-stack">BUILT WITH REACT + GSAP + THREE.JS</span>
        </div>
      </footer>

      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}

      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <nav className="nav">
          {navItems.map((item, i) => (
            <div
              key={i}
              className={`nav-item ${activeItem === i ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id, i)}
            >
              <span className="nav-prefix">+</span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-num">{item.num}</span>
            </div>
          ))}
        </nav>

        <div className="drawer-social">
          <a href="https://www.instagram.com/trifadii" target="_blank" rel="noreferrer" className="social-btn">INSTAGRAM</a>
          <a href="https://github.com/adrian909" target="_blank" rel="noreferrer" className="social-btn">GITHUB</a>
          <a href="https://www.linkedin.com/in/adrian-trif-458968187" target="_blank" rel="noreferrer" className="social-btn">LINKEDIN</a>
        </div>
      </div>
    </>
  );
}

export default App;