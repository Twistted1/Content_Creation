import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApp: vi.fn(),
}));

vi.mock('firebase/auth', () => {
  const GoogleAuthProviderMock = vi.fn();
  GoogleAuthProviderMock.prototype.addScope = vi.fn();

  return {
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    onAuthStateChanged: vi.fn((auth, cb) => {
      if (typeof auth === 'function') {
        auth(null);
      } else if (cb) {
        cb(null);
      }
      return () => {};
    }),
    GoogleAuthProvider: GoogleAuthProviderMock,
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
  };
});

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  initializeFirestore: vi.fn(() => ({})),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  Timestamp: { now: vi.fn() },
  where: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
}));
