'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase-client';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const supabase = createClient();
    
    // Check active session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            תורה האב
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="תפריט"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/sources" className="hover:text-blue-200">
              מקורות
            </Link>
            <Link href="/insights" className="hover:text-blue-200">
              חידושים
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="hover:text-blue-200">
                  פרופיל
                </Link>
                <button 
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                  }}
                  className="hover:text-blue-200"
                >
                  התנתק
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200">
                  התחבר
                </Link>
                <Link href="/signup" className="hover:text-blue-200">
                  הרשמה
                </Link>
              </>
            )}
          </nav>
        </div>
        
        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden flex flex-col space-y-4">
            <Link href="/sources" className="hover:text-blue-200">
              מקורות
            </Link>
            <Link href="/insights" className="hover:text-blue-200">
              חידושים
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="hover:text-blue-200">
                  פרופיל
                </Link>
                <button 
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                  }}
                  className="hover:text-blue-200 text-right"
                >
                  התנתק
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200">
                  התחבר
                </Link>
                <Link href="/signup" className="hover:text-blue-200">
                  הרשמה
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 