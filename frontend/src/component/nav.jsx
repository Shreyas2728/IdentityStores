import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, UserButton, useAuth } from '@clerk/react';

const Nav = () => {
  const location = useLocation();
  const { isLoaded, userId } = useAuth();
  
  return (
    <nav className="fixed top-0 w-full bg-gradient-to-b from-black/70 to-transparent pt-6 pb-8 px-8 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        {/* Real brand logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/is_logo_perfect.png" 
            alt="Identity Stores" 
            className="w-20 h-20 object-contain mix-blend-screen"
            style={{ mixBlendMode: 'screen' }}
          />
        </Link>
        <Link to="/">
          <h1 className="text-xl font-bold tracking-widest uppercase text-white hover:text-gray-300 transition-colors ml-2 bg-black/30 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md shadow-lg" style={{ letterSpacing: '0.15em' }}>
            Identity<span className="text-[#E01E2E]">Stores</span>
          </h1>
        </Link>
      </div>
      
      <ul className="flex items-center gap-8">
        <li>
          <Link 
            to="/" 
            className={`transition-all duration-300 font-semibold text-xs uppercase tracking-wider pb-1 relative ${
              location.pathname === '/' 
                ? 'text-[#E01E2E]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Home</span>
            {location.pathname === '/' && (
              <span className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-[#E01E2E] shadow-[0_0_8px_rgba(220,30,46,0.6)]" />
            )}
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard" 
            className={`transition-all duration-300 font-semibold text-xs uppercase tracking-wider pb-1 relative ${
              location.pathname === '/dashboard' 
                ? 'text-[#E01E2E]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Dashboard</span>
            {location.pathname === '/dashboard' && (
              <span className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-[#E01E2E] shadow-[0_0_8px_rgba(220,30,46,0.6)]" />
            )}
          </Link>
        </li>
        {isLoaded && !userId && (
          <>
            <li>
              <Link 
                to="/register" 
                className={`transition-all duration-300 font-semibold text-xs uppercase tracking-wider pb-1 relative ${
                  location.pathname === '/register' 
                    ? 'text-[#E01E2E]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>Register</span>
                {location.pathname === '/register' && (
                  <span className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-[#E01E2E] shadow-[0_0_8px_rgba(220,30,46,0.6)]" />
                )}
              </Link>
            </li>
            <li>
              <SignInButton mode="modal">
                <button className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white border border-white/20 rounded-md hover:bg-white/10 transition-colors backdrop-blur-sm cursor-pointer ml-2">
                  Sign In
                </button>
              </SignInButton>
            </li>
          </>
        )}
        {isLoaded && userId && (
          <li>
            <div className="ml-2 hover:scale-105 transition-transform duration-300">
              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-transparent hover:border-[#E01E2E] transition-colors rounded-full" } }} />
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
