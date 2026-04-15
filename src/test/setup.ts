import '@testing-library/jest-dom';
import { vi } from 'vitest';

feat/script-studio-ui-16096172312553521028
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  initializeFirestore: vi.fn(),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  Timestamp: {
    now: vi.fn()
  }
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
  onAuthStateChanged: vi.fn((auth, cb) => {
      cb(null);
      return vi.fn();
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: class {
    addScope() {}
  },
  signInWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn()
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  uploadString: vi.fn(),
  deleteObject: vi.fn(),
  listAll: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  logEvent: vi.fn(),
}));
=======
// 1. Mock internal auth service (From your branch)
vi.mock('@/services/authService', () => ({
  authService: {
    onAuthStateChanged: vi.fn((cb) => {
      return () => {};
    }),
    getCurrentUser: vi.fn(() => null)
  }
}));

// 2. Comprehensive Firebase Mocks (From dev)
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
dev
