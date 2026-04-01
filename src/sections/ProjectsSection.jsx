import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ─── Real projects from trifadrian.ro ─────────────────────────────────────────
const PROJECTS = [
  {
    num: '01',
    name: 'HAUS MARYLU',
    type: 'GUESTHOUSE WEBSITE',
    category: '///HOSPITALITY',
    url: 'https://hausmarylu.at/',
    img: '/Untitled.png',
    tech: ['HTML', 'CSS', 'JavaScript'],
    year: '2025',
    desc: 'Modern responsive website built with a strong focus on brand identity and visual storytelling. Delivers a seamless digital experience for guests discovering the guesthouse.',
    accent: '#c0fe03',
  },
  {
    num: '02',
    name: 'CTRL + ART',
    type: 'E-COMMERCE — MOUSEPADS',
    category: '///CREATIVE COMMERCE',
    url: 'https://ctrlplusart.com/',
    img: '/Untitled1.png',
    tech: ['Shopify', 'Shopify Apps', 'Liquid'],
    year: '2025',
    desc: 'Designed and launched an online shop specialising in creative, high-quality mousepads. End-to-end e-commerce architecture including product management, app integrations, and brand cohesion.',
    accent: '#c0fe03',
  },
  {
    num: '03',
    name: 'OPHELISSE',
    type: 'SKINCARE BRAND',
    category: '///BEAUTY & WELLNESS',
    url: 'https://ophelisse.com/',
    img: '/Untitled2.png',
    tech: ['Shopify', 'Shopify Apps', 'Liquid'],
    year: '2025',
    desc: 'Luxury skincare e-commerce with hands-on experience in e-commerce operations, visual merchandising, and conversion optimisation for the beauty industry.',
    accent: '#c0fe03',
  },
  {
    num: '04',
    name: 'FLORINAS ART',
    type: 'FINE ART GALLERY',
    category: '///FINE ART',
    url: 'https://florinasart.com/',
    img: '/florinasart.png',
    tech: ['Shopify', 'Shopify Apps', 'Liquid'],
    year: '2026',
    desc: 'Fine art paintings marketplace handling product listings, curated collections, and visual merchandising. Where authentic human creativity meets digital commerce.',
    accent: '#c0fe03',
  },
  {
    num: '05',
    name: 'SOLARECO SOLIDAR',
    type: 'ENERGY',
    category: '///ENERGY',
    url: 'https://solarecosolidar.ro/',
    img: '/Untitled3.png',
    tech: ['ReactJs', 'CSS ', 'Vite '],
    year: '2026',
    desc: 'Responsive web presence for a solar energy cooperative, built with React and Vite. Clean, fast, and informative — communicating renewable energy services to local communities across Romania.',
    accent: '#c0fe03',
  },
  {
    num: '06',
    name: 'FORJA COMUNITATII',
    type: 'METAL FORGE',
    category: '///METAL FORGE',
    url: 'https://forjacomunitatii.ro/',
    img: '/Untitled4.png',
    tech: ['ReactJs', 'CSS ', 'Vite '],
    year: '2026',
    desc: 'Modern website for a community metal forge, showcasing craftsmanship, services, and custom metalwork. Built with React and Vite with a focus on industrial character and strong visual identity.',
    accent: '#c0fe03',
  },
  {
    num: '07',
    name: 'PEISART DESIGN',
    type: 'LANDSCAPE',
    category: '///LANDSCAPE',
    url: 'https://peisartdesign.ro/',
    img: '/Untitled5.png',
    tech: ['ReactJs', 'CSS ', 'Vite '],
    year: '2026',
    desc: 'Portfolio and services website for a landscape design studio. Visually led presentation of garden projects, plant selections, and outdoor space transformations — built with React and Vite.',
    accent: '#c0fe03',
  },
  {
    num: '08',
    name: 'STRALUCIM IMPREUNA',
    type: 'CLEANING',
    category: '///CLEANING',
    url: 'https://stralucimimpreuna.ro/',
    img: '/Untitled6.png',
    tech: ['ReactJs', 'CSS ', 'Vite '],
    year: '2026',
    desc: 'Professional website for a cleaning services company, built with React and Vite. Clear service presentation, contact flow, and brand-consistent design to convert local customers.',
    accent: '#c0fe03',
  },
];

// ─── Single project card ───────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const cardRef   = useRef(null);
  const mouseX    = useMotionValue(0);
  const mouseY    = useMotionValue(0);

  // Silky smooth spring — img moves more than text for depth separation
  const springCfg = { stiffness: 55, damping: 16 };
  const sx = useSpring(mouseX, springCfg);
  const sy = useSpring(mouseY, springCfg);

  const imgX  = useTransform(sx, [-1, 1], ['-5%', '5%']);
  const imgY  = useTransform(sy, [-1, 1], ['-5%', '5%']);
  const txtX  = useTransform(sx, [-1, 1], ['1.5%', '-1.5%']);

  const handleMove = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width  * 2 - 1);
    mouseY.set((e.clientY - r.top)  / r.height * 2 - 1);
  };
  const handleLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <div
      ref={cardRef}
      className={`proj-card proj-card-${index}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ '--accent': project.accent }}
    >
      {/* ── Background image layer (mouse parallax) ──────────────────────── */}
      <motion.div className="proj-img-wrap" style={{ x: imgX, y: imgY }}>
        {/* Clip mask — GSAP wipes this open as card enters horizontal view */}
        <div className={`proj-img-clip proj-img-clip-${index}`}>
          <img
            src={project.img}
            alt={project.name}
            className="proj-img"
            loading="lazy"
            draggable={false}
          />
        </div>
        <div className="proj-vignette" />
        <div className="proj-grain"   />
      </motion.div>

      {/* Huge ghost number — depth layer between image and text */}
      <div className={`proj-ghost-num proj-ghost-num-${index}`} aria-hidden="true">
        {project.num}
      </div>

      {/* ── Text content (counter-parallax to image) ─────────────────────── */}
      <motion.div
        className={`proj-content proj-content-${index}`}
        style={{ x: txtX }}
      >
        <div className="proj-meta-row">
          <span className="proj-meta-num"  style={{ color: '#c0fe03' }}>{project.num}</span>
          <span className="proj-meta-cat" style={{ color: '#c0fe03' }}>{project.category}</span>
          <span className="proj-meta-yr">{project.year}</span>
        </div>

        <h3 className={`proj-name proj-name-${index}`}>{project.name}</h3>
        <p  className="proj-type">{project.type}</p>
        <p  className="proj-desc">{project.desc}</p>

        <div className="proj-tech">
          {project.tech.map((t, j) => (
            <motion.span
              key={j}
              className="cin-tag"
              whileHover={{ backgroundColor: project.accent, color: '#000', borderColor: project.accent }}
              transition={{ duration: 0.11 }}
            >
              {t}
            </motion.span>
          ))}
        </div>

        <motion.a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="proj-cta"
          style={{ borderColor: '#c0fe03', color: '#c0fe03' }}
          whileHover={{ backgroundColor: '#c0fe03', color: '#000', paddingLeft: '2rem' }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
        >
          VIEW PROJECT ↗
        </motion.a>
      </motion.div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const [active, setActive] = useState(0);
  const [skipVisible, setSkipVisible] = useState(false);
  const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {

      // ── Core horizontal scroll ────────────────────────────────────────────
      // GSAP translates the track by (total width - viewport) as you scroll down.
      const hTween = gsap.to(trackRef.current, {
        x: () => -(trackRef.current.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${trackRef.current.scrollWidth - window.innerWidth + window.innerWidth * 0.25}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const clamped = Math.min(self.progress, 1);
            setActive(Math.round(clamped * (PROJECTS.length - 1)));
          },
        },
      });

      // ── Per-card: image wipe (clip-path inset 0 100%→0%) ─────────────────
      document.querySelectorAll('.proj-img-clip').forEach((clip) => {
        gsap.fromTo(clip,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'power4.inOut',
            scrollTrigger: {
              containerAnimation: hTween,
              trigger: clip.closest('.proj-card'),
              start: 'left 92%',
              end:   'left 38%',
              scrub: 0.9,
            },
          }
        );
      });

      // ── Per-card: text content rises from blur ────────────────────────────
      document.querySelectorAll('.proj-content').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 52, filter: 'blur(5px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            ease: 'power3.out',
            scrollTrigger: {
              containerAnimation: hTween,
              trigger: el.closest('.proj-card'),
              start: 'left 80%',
              end:   'left 35%',
              scrub: 0.7,
            },
          }
        );
      });

      // ── Per-card: ghost number fades in slowly ────────────────────────────
      document.querySelectorAll('.proj-ghost-num').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.82 },
          {
            opacity: 1, scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              containerAnimation: hTween,
              trigger: el.closest('.proj-card'),
              start: 'left 85%',
              end:   'left 20%',
              scrub: 1.2,
            },
          }
        );
      });

      // ── Skip button: show while pinned, hide otherwise ───────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${trackRef.current.scrollWidth - window.innerWidth + window.innerWidth * 0.25}`,
        onEnter:     () => setSkipVisible(true),
        onLeave:     () => setSkipVisible(false),
        onEnterBack: () => setSkipVisible(true),
        onLeaveBack: () => setSkipVisible(false),
      });

      // ── "Shudder" entrance — a brief micro-shake as section pins ──────────
      // This is the first "unexpected" moment — the page stutters to attention.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        once: true,
        onEnter: () => {
          gsap.timeline()
            .to(sectionRef.current, { x:  6, duration: 0.06, ease: 'none' })
            .to(sectionRef.current, { x: -5, duration: 0.06, ease: 'none' })
            .to(sectionRef.current, { x:  3, duration: 0.05, ease: 'none' })
            .to(sectionRef.current, { x:  0, duration: 0.05, ease: 'none' });
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
    {/* Skip button — outside section so position:fixed works correctly */}
    <button
      className={`proj-skip${skipVisible ? ' proj-skip--visible' : ''}`}
      onClick={() => {
        gsap.to(window, { duration: 4, scrollTo: '#technology', ease: 'power2.inOut' });
      }}
    >
      SKIP ↓
    </button>

    <section id="projects" ref={sectionRef} className="cinematic-section proj-section">

      {/* Ambient decoratives */}
      <span className="deco deco-rot     deco-light" style={{ top: '3%',    right: '2%' }}>SHOWCASE/</span>
      <span className="deco deco-code    deco-light" style={{ bottom: '5%', left:  '2%' }}>GRID<br />4X1</span>
      <span className="deco deco-checker deco-light" style={{ top: '8%',    left:  '4%' }}>▚▞▚▞</span>

      {/* Fixed overlay: label + pill progress indicator + counter */}
      <div className="proj-hud">
        <span className="cin-label">[ 05 / 09 ] — PROJECTS</span>
        <div className="proj-pills">
          {PROJECTS.map((_, i) => (
            <motion.span
              key={i}
              className="proj-pill"
              animate={{
                width: active === i ? 22 : 6,
                backgroundColor: active === i ? '#c0fe03' : 'rgba(255,255,255,0.22)',
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            />
          ))}
        </div>
        <span className="proj-counter">
          <motion.span
            key={active}
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {String(active + 1).padStart(2, '0')}
          </motion.span>
          <span className="proj-counter-total"> / {String(PROJECTS.length).padStart(2, '0')}</span>
        </span>
      </div>

      {/* Horizontal track — GSAP translates this */}
      <div ref={trackRef} className="proj-track">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={i} project={p} index={i} />
        ))}
      </div>

    </section>
    </>
  );
}
