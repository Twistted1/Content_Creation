import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(
feat/script-studio-ui-16096172312553521028
        <App />

      <App />
dev
    );
    expect(document.body).toBeTruthy();
  });
});
