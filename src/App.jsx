import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  const navItems = [
    { label: 'INTRO',      num: '/01' },
    { label: 'ABOUT',      num: '/02' },
    { label: 'STUDIES',    num: '/03' },
    { label: 'EXPERIENCE', num: '/04' },
    { label: 'SKILLS',     num: '/05' },
    { label: 'PROJECTS',   num: '/06' },
    { label: 'RESUME',     num: '/07' },
    { label: 'CONTACT',    num: '/08' },
  ];

  return (
    <>
      <div className="menu">
        <p className="top-left-label">
          <span style={{ color: 'gray' }}>RO LOCAL/</span>
          <b>{date.toLocaleTimeString()}</b>
        </p>
      </div>

      <div className="main-center">
        <div className="freelance-label">
          <h3>//AVAILABLE FOR FREELANCE</h3>
        </div>
        <h1 className="name-title">
          ADRIAN<br />TRIF
        </h1>
      </div>

      <div className="location-label">
        <p>Alba Iulia, Alba, RO</p>
        <p>///BACKEND DEVELOPER <span style={{ color: 'gray' }}>+ FREELANCER</span></p>
      </div>

      <button className="menu-btn" onClick={() => setDrawerOpen(!drawerOpen)}>
        {drawerOpen ? 'CLOSE' : 'MENU'}
      </button>

      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}

      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <nav className="nav">
          {navItems.map((item, i) => (
            <div
              key={i}
              className={`nav-item ${activeItem === i ? 'active' : ''}`}
              onClick={() => setActiveItem(i)}
            >
              <span className="nav-prefix">+</span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-num">{item.num}</span>
            </div>
          ))}
        </nav>

        <div className="drawer-social">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn">INSTAGRAM</a>
          <a href="https://facebook.com"  target="_blank" rel="noreferrer" className="social-btn">FACEBOOK</a>
          <a href="https://linkedin.com"  target="_blank" rel="noreferrer" className="social-btn">LINKEDIN</a>
        </div>
      </div>
    </>
  );
}

export default App;