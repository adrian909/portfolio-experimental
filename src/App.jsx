import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Datepicker from 'react-tailwindcss-datepicker'
import React, { useEffect } from "react";

function App() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <div className='menu'>
        <p className='top-left-label'>
          RO LOCAL/<b>{date.toLocaleTimeString()}</b>
        </p>
      </div>
      <div className="main-center">
        <div className="freelance-label">
          <h3>//AVAILABLE FOR FREELANCE</h3>
        </div>
        <div>
          <h1 className="name-title">
            ADRIAN
            <br />
            TRIF
          </h1>
        </div>
      </div>
      <div className="location-label">
        <p>Alba Iulia, Alba, RO</p>
        <p>//BACKEND DEVELOPER <span style={{ color: 'gray' }}>+ FREELANCER</span></p>
      </div>
    </>
  );
}

export default App;
