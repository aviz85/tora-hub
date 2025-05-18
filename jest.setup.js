// Import jest-dom to add custom jest matchers for asserting on DOM nodes
import '@testing-library/jest-dom';

// Create mocks for the most commonly used functions
global.mockSignInWithPassword = jest.fn(() => Promise.resolve({ data: {}, error: null }));
global.mockSignUp = jest.fn(() => Promise.resolve({ data: {}, error: null }));
global.mockSignOut = jest.fn(() => Promise.resolve({ error: null }));
global.mockSessionGetter = jest.fn(() => Promise.resolve({ data: { session: null } }));
global.mockStateChange = jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } }));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useParams() {
    return {};
  },
  usePathname() {
    return '';
  },
}));

// Mock Supabase
jest.mock('@/utils/supabase-client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: global.mockSessionGetter,
      signInWithPassword: global.mockSignInWithPassword,
      signUp: global.mockSignUp,
      signOut: global.mockSignOut,
      onAuthStateChange: global.mockStateChange,
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://example.com/avatar.png' }, error: null })),
      })),
    },
  })),
  ToraUser: {},
  Source: {},
  Insight: {},
  Comment: {},
})); 