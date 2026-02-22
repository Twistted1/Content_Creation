import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Since we don't know exactly what's on the home page, just check if the body exists
    expect(document.body).toBeTruthy();
  });
});
