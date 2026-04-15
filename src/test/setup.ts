import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase config
vi.mock('@/lib/firebase', () => ({
  db: {},
  storage: {},
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  analytics: {},
  default: {}
}));

vi.mock('@/services/authService', () => ({
  authService: {
    onAuthStateChanged: vi.fn((cb) => {
      // return a mock unsubscribe function
      return () => {};
    }),
    getCurrentUser: vi.fn(() => null)
  }
}));
