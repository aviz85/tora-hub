import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

// Mock the createClient function
jest.mock('@/utils/supabase-client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: jest.fn(() => ({ 
        data: { 
          subscription: { unsubscribe: jest.fn() } 
        } 
      })),
      signOut: jest.fn(),
    },
  })),
}));

describe('Header Component', () => {
  it('renders logo and navigation links', () => {
    render(<Header />);
    
    // Check logo text
    expect(screen.getByText('תורה האב')).toBeInTheDocument();
    
    // Check navigation links
    expect(screen.getByText('מקורות')).toBeInTheDocument();
    expect(screen.getByText('חידושים')).toBeInTheDocument();
    expect(screen.getByText('התחבר')).toBeInTheDocument();
    expect(screen.getByText('הרשמה')).toBeInTheDocument();
  });
  
  it('toggles mobile menu when button is clicked', () => {
    render(<Header />);
    
    // Mobile menu should be hidden initially
    expect(screen.queryByRole('navigation', { hidden: true })).not.toBeNull();
    // Initially the mobile navigation (with conditional rendering) is not in the document
    expect(screen.queryAllByRole('navigation').length).toBe(1); // Only desktop nav is rendered
    
    // Click the menu button
    const menuButton = screen.getByLabelText('תפריט');
    fireEvent.click(menuButton);
    
    // Now mobile menu should be visible - there should be two navs
    expect(screen.queryAllByRole('navigation').length).toBe(2);
  });
}); 