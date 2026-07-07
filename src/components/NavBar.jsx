import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthUser(null);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-brand-600 bg-brand-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200'
      : 'text-stone-600 hover:text-brand-600 hover:bg-brand-50/60 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center gap-2 group">
            <motion.span
              className="font-display text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.02 }}
            >
              Verse
            </motion.span>
          </NavLink>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className={`${isOpen ? 'flex' : 'hidden'} sm:flex absolute sm:relative top-16 sm:top-0 left-0 right-0 sm:left-auto flex-col sm:flex-row items-start sm:items-center gap-1 p-4 sm:p-0 bg-white sm:bg-transparent border-t sm:border-t-0 border-stone-100 shadow-lg sm:shadow-none`}>
            <NavLink to="/" className={navLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
            {user && (
              <>
                <NavLink to="/profile" className={navLinkClass} onClick={() => setIsOpen(false)}>Profile</NavLink>
                {user.isAdmin && (
                  <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                )}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn-ghost text-sm">
                  Logout
                </button>
              </>
            )}
            {!user && (
              <NavLink to="/login" className="btn-primary text-sm !py-2 !px-4" onClick={() => setIsOpen(false)}>Login</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
