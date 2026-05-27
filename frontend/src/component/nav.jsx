import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
    const location = useLocation();

    return (
        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm z-50 relative">
            <div className="flex items-center gap-3">
                <div className="inline-flex justify-center items-center w-8 h-8 bg-white/5 rounded-lg border border-white/10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <Link to="/">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">
                        IdentityStores
                    </h1>
                </Link>
            </div>

            <ul className="flex items-center gap-6">
                <li>
                    <Link
                        to="/"
                        className={`transition-colors font-medium pb-1 ${location.pathname === '/' ? 'text-violet-400 border-b-2 border-violet-500' : 'text-slate-300 hover:text-white'}`}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/dashboard"
                        className={`transition-colors font-medium pb-1 ${location.pathname === '/dashboard' ? 'text-violet-400 border-b-2 border-violet-500' : 'text-slate-300 hover:text-white'}`}
                    >
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Show when="signed-out">
                        <SignInButton />
                    </Show>
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                </li>
            </ul>

        </nav>
    );
};

export default Nav;
