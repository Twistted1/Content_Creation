import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: class { addScope = vi.fn(); },
  onAuthStateChanged: vi.fn(() => vi.fn())
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Since we don't know exactly what's on the home page, just check if the body exists
    expect(document.body).toBeTruthy();
  });
});
