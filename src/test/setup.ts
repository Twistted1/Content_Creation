import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  initializeFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  collection: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
}));

vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return () => {}; }),
    GoogleAuthProvider: class {
      addScope() {}
    },
    signInWithPopup: vi.fn(),
    signOut: vi.fn()
  };
});

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({}))
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({}))
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({}))
}));
