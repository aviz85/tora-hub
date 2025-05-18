import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

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
    const mobileNav = screen.queryByRole('navigation', { hidden: true });
    expect(mobileNav).not.toBeVisible();
    
    // Click the menu button
    const menuButton = screen.getByLabelText('תפריט');
    fireEvent.click(menuButton);
    
    // Now mobile menu should be visible
    const mobileNavAfterClick = screen.queryByRole('navigation', { hidden: true });
    expect(mobileNavAfterClick).toBeVisible();
  });
}); 