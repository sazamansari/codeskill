import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

// Mock Next.js routing
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));
import { usePathname } from 'next/navigation';

describe('Footer Component', () => {
  it('renders correctly on normal pages', () => {
    // @ts-ignore
    usePathname.mockReturnValue('/');
    
    render(<Footer />);
    
    // Check for logo text or trademark
    expect(screen.getByText(/© 2026/i)).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  it('hides the footer on workspace/editor pages', () => {
    // @ts-ignore
    usePathname.mockReturnValue('/problems/two-sum');
    
    const { container } = render(<Footer />);
    
    // It should render null (nothing)
    expect(container.firstChild).toBeNull();
  });
});
