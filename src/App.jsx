import { useState, useEffect, useRef } from 'react'
import './App.css'

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
    { label: 'STUDIES',    num: '/03', id: 'studies' },
    { label: 'EXPERIENCE', num: '/04', id: 'experience' },
    { label: 'SKILLS',     num: '/05', id: 'skills' },
    { label: 'PROJECTS',   num: '/06', id: 'projects' },
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
      <section id="about" className="section-dark">
        <span className="deco deco-rot deco-light" style={{top:'5%',right:'3%'}}>PORTFOLIO/</span>
        <span className="deco deco-code deco-light" style={{bottom:'8%',right:'5%'}}>TAU CETI<br/>R U N R<br/>2 8 9 3</span>
        <span className="deco deco-checker deco-light" style={{top:'50%',left:'2%'}}>▚▞▚</span>
        <span className="deco deco-rot deco-light" style={{bottom:'20%',left:'1%'}}>BACKEND/</span>
        <span className="deco deco-code deco-light" style={{top:'5%',left:'8%'}}>VER 2.0<br/>BUILD OK</span>
        <span className="deco deco-checker deco-light" style={{bottom:'30%',right:'8%'}}>▚▞▚▞▚</span>
        <span className="deco deco-code deco-light" style={{top:'35%',right:'1%'}}>FREQ<br/>440HZ</span>
        <h2 className="section-title reveal reveal-fade-right">ABOUT</h2>

        <div className="about-grid">
          <div className="about-bio reveal reveal-fade-up" style={{transitionDelay:'0.15s'}}>
            <span className="about-tag">[ BIO / 01 ]</span>
            <p className="about-bio-text">
              Master's graduate specialized in <span className="kw">backend development</span>, with solid experience in <span className="kw">.NET</span> technologies, <span className="kw">API design</span>, and <span className="kw">database management</span>.
            </p>
            <p className="about-bio-text">
              Skilled in building <span className="kw">scalable</span> and reliable server-side solutions, optimizing data flows, and integrating <span className="kw">modern architectures</span>.
            </p>
            <p className="about-bio-text">
              Passionate about solving complex problems, eager to learn new technologies, and motivated to contribute to collaborative, high-impact <span className="kw">software engineering</span> projects.
            </p>
          </div>

          <div className="about-terminal reveal reveal-scale" style={{transitionDelay:'0.3s'}}>
            <div className="terminal-header">
              <span className="terminal-dot" style={{background:'#ff5f56'}}></span>
              <span className="terminal-dot" style={{background:'#ffbd2e'}}></span>
              <span className="terminal-dot" style={{background:'#27c93f'}}></span>
              <span className="terminal-title">sys.profile</span>
            </div>
            <div className="terminal-body">
              <p><span className="t-prompt">&gt;</span> <span className="t-cmd">whois</span> adrian.trif</p>
              <br/>
              <p><span className="t-key">NAME</span> <span className="t-val">Adrian Trif</span></p>
              <p><span className="t-key">ROLE</span> <span className="t-val">Backend Developer</span></p>
              <p><span className="t-key">LOCATION</span> <span className="t-val">Romania</span></p>
              <p><span className="t-key">STACK</span> <span className="t-val">.NET / C# / SQL</span></p>
              <p><span className="t-key">FOCUS</span> <span className="t-val">APIs &amp; Scalable Systems</span></p>
              <p><span className="t-key">STATUS</span> <span className="t-val t-status">&#x25CF; AVAILABLE</span></p>
              <br/>
              <p><span className="t-prompt">&gt;</span> <span className="t-blink">_</span></p>
            </div>
          </div>
        </div>

        <div className="about-separator reveal reveal-fade-up" style={{transitionDelay:'0.4s'}}></div>

        <div className="freelance-stats reveal reveal-fade-up" style={{transitionDelay:'0.5s'}}>
          <div className="stat-item reveal reveal-fade-up" style={{transitionDelay:'0.2s'}}>
            <span className="stat-number">4+</span>
            <span className="stat-label">YEARS OF<br/>EXPERIENCE</span>
          </div>
          <div className="stat-item reveal reveal-fade-up" style={{transitionDelay:'0.3s'}}>
            <span className="stat-number">10+</span>
            <span className="stat-label">PROJECTS<br/>COMPLETED</span>
          </div>
          <div className="stat-item reveal reveal-fade-up" style={{transitionDelay:'0.4s'}}>
            <span className="stat-number">100%</span>
            <span className="stat-label">CLIENT<br/>SATISFACTION</span>
          </div>
          <div className="stat-item reveal reveal-fade-up" style={{transitionDelay:'0.5s'}}>
            <span className="stat-number">24/7</span>
            <span className="stat-label">SUPPORT &<br/>AVAILABILITY</span>
          </div>
        </div>
      </section>

      <section id="studies" className="section-dark">
        <span className="deco deco-code deco-light" style={{top:'12%',left:'3%'}}>TRESPASS<br/>TRIAL<br/>NR/<br/>00002025</span>
        <span className="deco deco-rot deco-light" style={{bottom:'15%',right:'4%'}}>ACADEMIC/</span>
        <span className="deco deco-checker deco-light" style={{top:'8%',right:'10%'}}>▚▞▚▞</span>
        <span className="deco deco-code deco-light" style={{bottom:'5%',left:'8%'}}>GRAD<br/>SUMMA</span>
        <span className="deco deco-rot deco-light" style={{top:'40%',left:'1%'}}>RESEARCH/</span>
        <h2 className="section-title reveal reveal-fade-right">STUDIES</h2>
        <div className="section-text reveal reveal-fade-up" style={{transitionDelay:'0.15s'}}>
          <p><strong>Master's Degree â€” 2023â€“2025</strong></p>
          <p>"1 Decembrie 1918" University of Alba Iulia â€” Advanced Programming and Databases</p>
          <br />
          <p><strong>Bachelor's Degree â€” 2019â€“2022</strong></p>
          <p>West University of Timisoara â€” Mathematics and Computer Science</p>
          <br />
          <p><strong>Baccalaureate â€” 2015â€“2019</strong></p>
          <p>"Horea, Closca si Crisan" National College, Alba Iulia â€” Mathematics and Computer Science</p>
        </div>
      </section>

      <section id="experience" className="section-dark">
        <span className="deco deco-checker deco-light" style={{top:'8%',right:'6%'}}>▚▞▚▞▚▞</span>
        <span className="deco deco-code deco-light" style={{bottom:'10%',left:'3%'}}>SYS.LOG<br/>ID#77</span>
        <span className="deco deco-rot deco-light" style={{top:'45%',right:'2%'}}>CAREER/</span>
        <span className="deco deco-code deco-light" style={{top:'5%',left:'6%'}}>STACK<br/>OVERFLOW<br/>++</span>
        <span className="deco deco-rot deco-light" style={{bottom:'30%',left:'1%'}}>RUNTIME/</span>
        <span className="deco deco-checker deco-light" style={{bottom:'5%',right:'12%'}}>▚▞▚</span>
        <h2 className="section-title reveal reveal-fade-right">EXPERIENCE</h2>
        <div className="section-text reveal reveal-fade-up" style={{transitionDelay:'0.15s'}}>
          <p><strong>Programmer â€” TOLUNA Romania, Timisoara (2022â€“Present)</strong></p>
          <p>Developed and maintained scalable backend systems using .NET technologies. Designed and integrated RESTful APIs. Collaborated with cross-functional teams. Conducted code reviews and optimized code for performance.</p>
          <br />
          <p><strong>Backend Developer Intern â€” IBM Romania, Timisoara (2021)</strong></p>
          <p>Built a web application using Angular and SpringBoot. Developed robust Java-based backend services. Implemented API integrations between front-end and back-end systems.</p>
          <br />
          <p><strong>Junior Programmer Analyst â€” SC IPEC SA, Alba Iulia (2020)</strong></p>
          <p>Assisted in industrial robot programming and automation. Performed database operations for manufacturing processes. Contributed to full-stack web development tasks.</p>
        </div>
      </section>

      <section id="skills" className="section-dark">
        <span className="deco deco-rot deco-light" style={{top:'15%',left:'2%'}}>TECHNICAL/</span>
        <span className="deco deco-code deco-light" style={{bottom:'12%',right:'4%'}}>SUPER<br/>BOLD<br/>10/26</span>
        <span className="deco deco-checker deco-light" style={{bottom:'40%',left:'4%'}}>▚▞</span>
        <span className="deco deco-code deco-light" style={{top:'8%',right:'8%'}}>DEPLOY<br/>STATUS<br/>OK</span>
        <span className="deco deco-rot deco-light" style={{bottom:'10%',left:'1%'}}>COMPILE/</span>
        <span className="deco deco-checker deco-light" style={{top:'30%',right:'2%'}}>▚▞▚▞</span>
        <h2 className="section-title reveal reveal-fade-right">SKILLS</h2>
        <div className="section-skills reveal reveal-fade-up" style={{transitionDelay:'0.15s'}}>
          <span className="skill-tag">.NET</span>
          <span className="skill-tag">C#</span>
          <span className="skill-tag">Java</span>
          <span className="skill-tag">SpringBoot</span>
          <span className="skill-tag">SQL</span>
          <span className="skill-tag">AWS</span>
          <span className="skill-tag">Docker</span>
          <span className="skill-tag">Terraform</span>
          <span className="skill-tag">Azure</span>
          <span className="skill-tag">Git</span>
          <span className="skill-tag">MySQL</span>
          <span className="skill-tag">Firebase</span>
          <span className="skill-tag">Shopify</span>
          <span className="skill-tag">Flutter</span>
          <span className="skill-tag">Dart</span>
          <span className="skill-tag">Android Studio</span>
        </div>
      </section>

      <section id="projects" className="section-dark">
        <span className="deco deco-rot deco-light" style={{top:'5%',right:'3%'}}>SHOWCASE/</span>
        <span className="deco deco-code deco-light" style={{bottom:'5%',left:'2%'}}>GRID<br/>MODE<br/>4X1</span>
        <span className="deco deco-checker deco-light" style={{top:'3%',left:'5%'}}>▚▞▚▞▚</span>
        <span className="deco deco-rot deco-light" style={{bottom:'20%',right:'1%'}}>RENDER/</span>
        <span className="deco deco-code deco-light" style={{top:'50%',left:'1%'}}>PIXEL<br/>RATIO<br/>2X</span>
        <h2 className="section-title reveal reveal-fade-right">PROJECTS</h2>
        <div className="projects-grid reveal reveal-fade-up" style={{transitionDelay:'0.15s'}}>
          <a href="https://hausmarylu.at/" target="_blank" rel="noreferrer" className="project-card">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" alt="Haus MaryLu" />
            <div className="project-grain"></div>
            <div className="project-info">
              <h3>HAUS MARYLU</h3>
              <p>///GUESTHOUSE</p>
            </div>
          </a>
          <a href="https://ctrlplusart.com/" target="_blank" rel="noreferrer" className="project-card">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" alt="CTRL+ART" />
            <div className="project-grain"></div>
            <div className="project-info">
              <h3>CTRL+ART</h3>
              <p>///E-COMMERCE</p>
            </div>
          </a>
          <a href="https://ophelisse.com/" target="_blank" rel="noreferrer" className="project-card">
            <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80" alt="Ophelisse" />
            <div className="project-grain"></div>
            <div className="project-info">
              <h3>OPHELISSE</h3>
              <p>///SKINCARE</p>
            </div>
          </a>
          <a href="https://florinasart.com/" target="_blank" rel="noreferrer" className="project-card">
            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80" alt="Florinas Art" />
            <div className="project-grain"></div>
            <div className="project-info">
              <h3>FLORINAS ART</h3>
              <p>///PAINTINGS</p>
            </div>
          </a>
        </div>
      </section>

      <section id="resume" className="section-dark">
        <span className="deco deco-rot deco-light" style={{top:'10%',right:'3%'}}>DOWNLOAD/</span>
        <span className="deco deco-code deco-light" style={{bottom:'10%',left:'4%'}}>FILE<br/>PDF<br/>2.4MB</span>
        <span className="deco deco-checker deco-light" style={{top:'15%',left:'2%'}}>▚▞▚</span>
        <h2 className="section-title reveal reveal-fade-right">RESUME</h2>
        <div className="section-text reveal reveal-fade-up" style={{transitionDelay:'0.15s'}}>
          <p>Download my CV or view it online for complete details.</p>
          <a href="https://trifadrian.ro/Adrian_Trif_Resume.pdf" target="_blank" rel="noreferrer" className="resume-btn">DOWNLOAD CV â†—</a>
        </div>
      </section>

      <section id="contact" className="section-dark">
        <span className="deco deco-rot deco-light" style={{top:'10%',left:'3%'}}>CONNECT/</span>
        <span className="deco deco-checker deco-light" style={{bottom:'15%',right:'5%'}}>▚▞▚▞</span>
        <span className="deco deco-code deco-light" style={{top:'20%',right:'8%'}}>INBOX<br/>MSG#01</span>
        <span className="deco deco-rot deco-light" style={{bottom:'10%',right:'2%'}}>SIGNAL/</span>
        <span className="deco deco-code deco-light" style={{bottom:'5%',left:'8%'}}>PING<br/>REPLY<br/>200</span>
        <span className="deco deco-checker deco-light" style={{top:'40%',left:'1%'}}>▚▞▚</span>
        <h2 className="section-title reveal reveal-fade-right">CONTACT</h2>
        <div className="section-text reveal reveal-fade-up" style={{transitionDelay:'0.15s'}}>
          <p>Email: <a href="mailto:adiitrif14@gmail.com" className="section-link">adiitrif14@gmail.com</a></p>
          <p>Phone: <a href="tel:+40732166568" className="section-link">+40 732 166 568</a></p>
          <p>Location: Alba Iulia, Romania</p>
        </div>
      </section>

      <footer className="site-footer">
        <span className="deco deco-rot deco-light" style={{top:'10%',left:'3%'}}>END/</span>
        <span className="deco deco-checker deco-light" style={{top:'15%',right:'5%'}}>▚▞▚▞</span>
        <span className="deco deco-code deco-light" style={{bottom:'10%',left:'8%'}}>EXIT<br/>CODE 0</span>
        <span className="deco deco-rot deco-light" style={{bottom:'10%',right:'3%'}}>TERMINATE/</span>
        <p className="reveal reveal-fade-up">Â© {date.getFullYear()} All rights reserved â€” Adrian Trif</p>
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