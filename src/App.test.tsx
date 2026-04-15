import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    // App component itself includes a <Router>, so we shouldn't wrap it in another <BrowserRouter>
    render(<App />);
    expect(document.body).toBeTruthy();
  });
});
