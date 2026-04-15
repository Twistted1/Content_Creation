import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
Preview-14058922509981430571
    // App component itself includes a <Router>, so we shouldn't wrap it in another <BrowserRouter>
    render(<App />);
    
    render(
feat/script-studio-ui-16096172312553521028
        <App />

      <App />
dev
    );
dev
    expect(document.body).toBeTruthy();
  });
});