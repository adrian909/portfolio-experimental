import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Real projects from trifadrian.ro ─────────────────────────────────────────
const PROJECTS = [
  {
    num: '01',
    name: 'HAUS MARYLU',
    type: 'GUESTHOUSE WEBSITE',
    category: '///HOSPITALITY',
    url: 'https://hausmarylu.at/',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80',
    tech: ['HTML', 'CSS', 'JavaScript'],
    year: '2024',
    desc: 'Modern responsive website built with a strong focus on brand identity and visual storytelling. Delivers a seamless digital experience for guests discovering the guesthouse.',
    accent: '#c0fe03',
  },
  {
    num: '02',
    name: 'CTRL + ART',
    type: 'E-COMMERCE — MOUSEPADS',
    category: '///CREATIVE COMMERCE',
    url: 'https://ctrlplusart.com/',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=80',
    tech: ['Shopify', 'Shopify Apps', 'Liquid'],
    year: '2024',
    desc: 'Designed and launched an online shop specialising in creative, high-quality mousepads. End-to-end e-commerce architecture including product management, app integrations, and brand cohesion.',
    accent: '#a78bfa',
  },
  {
    num: '03',
    name: 'OPHELISSE',
    type: 'SKINCARE BRAND',
    category: '///BEAUTY & WELLNESS',
    url: 'https://ophelisse.com/',
    img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1800&q=80',
    tech: ['Shopify', 'Shopify Apps', 'Liquid'],
    year: '2023',
    desc: 'Luxury skincare e-commerce with hands-on experience in e-commerce operations, visual merchandising, and conversion optimisation for the beauty industry.',
    accent: '#f9a8d4',
  },
  {
    num: '04',
    name: 'FLORINAS ART',
    type: 'FINE ART GALLERY',
    category: '///FINE ART',
    url: 'https://florinasart.com/',
    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1800&q=80',
    tech: ['Shopify', 'Shopify Apps', 'Liquid'],
    year: '2023',
    desc: 'Fine art paintings marketplace handling product listings, curated collections, and visual merchandising. Where authentic human creativity meets digital commerce.',
    accent: '#fb923c',
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
          <span className="proj-meta-num"  style={{ color: project.accent }}>{project.num}</span>
          <span className="proj-meta-cat">{project.category}</span>
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
          style={{ borderColor: project.accent, color: project.accent }}
          whileHover={{ backgroundColor: project.accent, color: '#000', paddingLeft: '2rem' }}
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

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Core horizontal scroll ────────────────────────────────────────────
      // GSAP translates the track by (total width - viewport) as you scroll down.
      const hTween = gsap.to(trackRef.current, {
        x: () => -(trackRef.current.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${trackRef.current.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActive(Math.round(self.progress * (PROJECTS.length - 1)));
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
              start: 'left 75%',
              end:   'left 18%',
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
              end:   'left 5%',
              scrub: 1.2,
            },
          }
        );
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
  );
}
