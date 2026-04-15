import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';
feature/publishing-hub-15296582739251248990
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

describe('App', () => {
  it('renders without crashing', () => {
Preview-14058922509981430571
    // App component itself includes a <Router>, so we shouldn't wrap it in another <BrowserRouter>
    render(<App />);
    
    render(
jules-idea-generation-ui-6103607865090958462
      <App />

feat/script-studio-ui-16096172312553521028
        <App />

      <App />
dev
dev
    );
dev
    expect(document.body).toBeTruthy();
  });
});