import { Menu, X, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <button onClick={() => scrollToSection('home')} className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity">
              CryptoTrend
            </button>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="https://app.cryptotrend.pl" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan transition-colors no-underline">
                Analizator Rynku
              </a>
              <button onClick={() => scrollToSection('tools')} className="text-gray-300 hover:text-cyan transition-colors no-underline">
                Narzędzia AI
              </button>
              <button onClick={() => scrollToSection('ebook')} className="text-gray-300 hover:text-cyan transition-colors no-underline">
                E-book
              </button>
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-300 hover:text-cyan transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm">{user.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 glassmorphism rounded-lg shadow-xl py-2 z-50">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-gray-300 hover:text-cyan hover:bg-gray-700/50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Moje Konto
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:text-cyan hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Wyloguj
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-cyan transition-colors">
                  Zaloguj się
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-cyan">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glassmorphism">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="https://app.cryptotrend.pl" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-gray-300 hover:text-cyan transition-colors">
              Analizator Rynku
            </a>
            <button onClick={() => scrollToSection('tools')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan transition-colors">
              Narzędzia AI
            </button>
            <button onClick={() => scrollToSection('ebook')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan transition-colors">
              E-book
            </button>
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-cyan">
                  {user.email}
                </div>
                <Link
                  to="/account"
                  className="block px-3 py-2 text-gray-300 hover:text-cyan transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Moje Konto
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan transition-colors"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 text-gray-300 hover:text-cyan transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Zaloguj się
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
