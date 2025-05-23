import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from '@/app/signup/page';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe('Signup Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost' },
      writable: true
    });
    
    // Reset the mocks
    global.mockSignUp.mockReset();
    global.mockSignUp.mockResolvedValue({ data: {}, error: null });
  });

  it('renders signup form', () => {
    render(<Signup />);
    
    // Check heading
    expect(screen.getByRole('heading', { name: /הרשמה/i })).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByLabelText(/דואר אלקטרוני/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/סיסמה/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/אימות סיסמה/i)).toBeInTheDocument();
    
    // Check submit button
    expect(screen.getByRole('button', { name: /הרשם/i })).toBeInTheDocument();
    
    // Check link to login
    expect(screen.getByText(/התחבר כאן/i)).toBeInTheDocument();
  });
  
  it('validates password confirmation', async () => {
    const user = userEvent.setup();
    render(<Signup />);
    
    // Fill form with non-matching passwords
    await user.type(screen.getByLabelText(/דואר אלקטרוני/i), 'test@example.com');
    await user.type(screen.getAllByLabelText(/סיסמה/i)[0], 'password123');
    await user.type(screen.getByLabelText(/אימות סיסמה/i), 'different');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /הרשם/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/הסיסמאות אינן תואמות/i)).toBeInTheDocument();
    });
    
    // Verify Supabase signUp wasn't called
    expect(global.mockSignUp).not.toHaveBeenCalled();
  });
  
  it('validates password length', async () => {
    const user = userEvent.setup();
    render(<Signup />);
    
    // Fill form with short password
    await user.type(screen.getByLabelText(/דואר אלקטרוני/i), 'test@example.com');
    await user.type(screen.getAllByLabelText(/סיסמה/i)[0], 'short');
    await user.type(screen.getByLabelText(/אימות סיסמה/i), 'short');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /הרשם/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/הסיסמה חייבת להכיל לפחות 8 תווים/i)).toBeInTheDocument();
    });
    
    // Verify Supabase signUp wasn't called
    expect(global.mockSignUp).not.toHaveBeenCalled();
  });
  
  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<Signup />);
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/דואר אלקטרוני/i), 'test@example.com');
    await user.type(screen.getAllByLabelText(/סיסמה/i)[0], 'password123');
    await user.type(screen.getByLabelText(/אימות סיסמה/i), 'password123');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /הרשם/i }));
    
    // Check if Supabase signUp was called with correct data
    await waitFor(() => {
      expect(global.mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: 'http://localhost/auth/callback',
        },
      });
    });
    
    // Check success message
    await waitFor(() => {
      expect(screen.getByText(/נשלח אליך מייל לאימות החשבון/i)).toBeInTheDocument();
    });
  });
}); 