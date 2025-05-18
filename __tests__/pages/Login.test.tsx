import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/app/login/page';

// Mock Next.js router
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    refresh: mockRefresh,
  })),
}));

describe('Login Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    global.mockSignInWithPassword.mockReset();
    global.mockSignInWithPassword.mockResolvedValue({ data: {}, error: null });
  });

  it('renders login form', () => {
    render(<Login />);
    
    // Check heading
    expect(screen.getByRole('heading', { name: /התחברות/i })).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByLabelText(/דואר אלקטרוני/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/סיסמה/i)).toBeInTheDocument();
    
    // Check submit button
    expect(screen.getByRole('button', { name: /התחבר/i })).toBeInTheDocument();
    
    // Check links
    expect(screen.getByText(/שכחת סיסמה/i)).toBeInTheDocument();
    expect(screen.getByText(/הירשם כאן/i)).toBeInTheDocument();
  });
  
  it('submits form with user credentials', async () => {
    const user = userEvent.setup();
    render(<Login />);
    
    // Fill form
    const emailInput = screen.getByLabelText(/דואר אלקטרוני/i);
    const passwordInput = screen.getByLabelText(/סיסמה/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /התחבר/i });
    await user.click(submitButton);
    
    // Check if Supabase auth method was called with correct credentials
    await waitFor(() => {
      expect(global.mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
  
  it('shows error message when login fails', async () => {
    // Set up the mock to return an error for this test only
    global.mockSignInWithPassword.mockResolvedValueOnce({ 
      data: {}, 
      error: { message: 'Invalid login credentials' }
    });
    
    const user = userEvent.setup();
    render(<Login />);
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/דואר אלקטרוני/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/סיסמה/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /התחבר/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
    });
  });
}); 