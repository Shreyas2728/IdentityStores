import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
                    </Link>
                </li>
                <li>
                    <Link
                        to="/register"
                        className={`transition-colors font-medium pb-1 ${location.pathname === '/register' ? 'text-violet-400 border-b-2 border-violet-500' : 'text-slate-300 hover:text-white'}`}
                    >
                        Register
                    </Link>
                </li>
                <li>
                    <Show when="signed-out">
                        <SignInButton />
                    </Show>
export default Nav;
