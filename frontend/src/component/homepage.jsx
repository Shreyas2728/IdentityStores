import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col items-center justify-center flex-grow w-full min-h-screen overflow-hidden select-none pt-20 pb-10"
      style={{ background: '#0a0a0a' }}
    >

      {/* ── Moving Clothing Container ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%',
          animation: 'panContainer 40s linear infinite alternate'
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url("/clothing_grid_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1, 
            filter: 'contrast(1.15) saturate(1.2)'
          }}
        />
        
        {/* Floating inserted images */}
        <div className="absolute top-[30%] left-[15%] w-[250px] h-[350px] rounded-2xl overflow-hidden shadow-2xl transform -rotate-12 border border-white/10 opacity-90">
           <img src="/skull_design.jpg" alt="Skull Design" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-[25%] right-[20%] w-[280px] h-[380px] rounded-2xl overflow-hidden shadow-2xl transform rotate-6 border border-white/10 opacity-90">
           <img src="/spider_design.jpg" alt="Spider Design" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-[10%] right-[30%] w-[200px] h-[280px] rounded-2xl overflow-hidden shadow-2xl transform rotate-12 border border-white/10 opacity-80">
           <img src="/skull_design.jpg" alt="Skull Design" className="w-full h-full object-cover filter grayscale" />
        </div>
      </div>

      {/* ── Extremely subtle vignette so the edges aren't harsh, but keeping background 100% visible ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* ── Main hero content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl w-full">

        {/* Top badge */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-10 text-[10px] uppercase tracking-[0.28em] font-semibold"
          style={{
            background: 'rgba(220,18,30,0.10)',
            border: '1px solid rgba(220,18,30,0.38)',
            color: '#ff5566',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Pulsing dot via CSS animation */}
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#E01E2E',
              boxShadow: '0 0 8px #E01E2E',
              animation: 'badgePulse 2s ease-in-out infinite',
            }}
          />
          Premium Apparel Platform
        </div>

        {/* ── LOGO — blending seamlessly into the background ── */}
        <div 
          className="mb-7"
          style={{
            filter: 'drop-shadow(0 0 35px rgba(220,18,30,0.45)) drop-shadow(0 0 70px rgba(180,10,20,0.25))'
          }}
        >
          <img
            src="/is_logo_perfect.png"
            alt="Identity Stores Logo"
            className="object-contain mx-auto mix-blend-screen"
            style={{ width: '220px', height: 'auto', mixBlendMode: 'screen' }}
          />
        </div>

        {/* Brand heading */}
        <h1
          className="font-black uppercase leading-none mb-2"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 5rem)',
            letterSpacing: '0.20em',
            background: 'linear-gradient(180deg, #ffffff 0%, #e8e8e8 55%, #aaaaaa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          IDENTITY
        </h1>
        <p
          className="font-bold uppercase tracking-[0.65em] mb-8"
          style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1rem)', color: '#E01E2E', letterSpacing: '0.65em' }}
        >
          STORES
        </p>

        {/* Red rule divider */}
        <div className="flex items-center gap-3 mb-8 w-full max-w-xs mx-auto">
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(220,18,30,0.6))' }}
          />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <polygon points="7,1 13,13 1,13" fill="none" stroke="#E01E2E" strokeWidth="1.5"/>
          </svg>
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to left, transparent, rgba(220,18,30,0.6))' }}
          />
        </div>

        {/* Tagline */}
        <p
          className="text-sm md:text-base font-light leading-relaxed max-w-md mb-11"
          style={{ color: 'rgba(220,210,210,0.60)', letterSpacing: '0.035em' }}
        >
          Redefine your identity through premium apparel.
          <br className="hidden md:block" />
          Custom designs crafted for those who stand apart.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">

          {/* Primary */}
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative px-9 py-3.5 font-bold text-xs uppercase tracking-[0.18em] text-white cursor-pointer flex items-center gap-3 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #B80F1E 0%, #E01E2E 55%, #FF3344 100%)',
              boxShadow: '0 0 0 1px rgba(220,18,30,0.45), 0 6px 28px rgba(220,18,30,0.40)',
              borderRadius: '2px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow =
                '0 0 0 1px rgba(220,18,30,0.75), 0 10px 44px rgba(220,18,30,0.60)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow =
                '0 0 0 1px rgba(220,18,30,0.45), 0 6px 28px rgba(220,18,30,0.40)';
            }}
          >
            {/* shimmer */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
            />
            <span>Launch Design Studio</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Ghost */}
          <button
            onClick={() => navigate('/dashboard')}
            className="px-9 py-3.5 font-semibold text-xs uppercase tracking-[0.18em] cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            style={{
              color: 'rgba(255,255,255,0.70)',
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
              borderRadius: '2px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(220,18,30,0.55)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(220,18,30,0.09)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.70)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
          >
            Explore Collections
          </button>
        </div>



      </div>

      {/* ── Bottom tagline strip ── */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center z-10 pointer-events-none">
        <p
          className="text-[9px] uppercase tracking-[0.40em] font-mono"
          style={{ color: 'rgba(200,200,200,0.22)' }}
        >
          Premium · Authentic · Identity
        </p>
      </div>

      {/* ── CSS Keyframes injected inline ── */}
      <style>{`
        @keyframes badgePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #E01E2E; }
          50%       { opacity: 0.4; box-shadow: 0 0 18px #E01E2E; }
        }
        @keyframes panContainer {
          0%   { transform: translate(12%, 0); }
          50%  { transform: translate(-12%, 0); }
          100% { transform: translate(12%, 0); }
        }
      `}</style>

    </div>
  );
};

export default Homepage;
