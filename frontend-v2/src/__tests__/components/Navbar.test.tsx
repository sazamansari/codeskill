import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';

// Mock Next.js routing
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useScroll: jest.fn(() => ({ scrollY: { get: () => 0 } })),
  useMotionValueEvent: jest.fn(),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Auth Context
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from '@/context/AuthContext';

describe('Navbar Component', () => {
  it('renders sign in button when user is logged out', () => {
    // @ts-ignore
    useAuth.mockReturnValue({ user: null, logout: jest.fn() });

    render(<Navbar />);
    
    // CodeSkill logo should be present
    expect(screen.getByText('CodeSkill')).toBeInTheDocument();
    
    // Login button should be present
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('renders dashboard button when user is logged in', () => {
    // @ts-ignore
    useAuth.mockReturnValue({ 
      user: { name: 'Test User', email: 'test@example.com' }, 
      logout: jest.fn() 
    });

    render(<Navbar />);
    
    expect(screen.queryByText('Log in')).not.toBeInTheDocument();
  });
});
