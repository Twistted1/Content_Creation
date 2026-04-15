import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock internal auth service
vi.mock('@/services/authService', () => ({
  authService: {
    onAuthStateChanged: vi.fn((cb) => {
      cb(null);
      return () => {};
    }),
    getCurrentUser: vi.fn(() => null)
  }
}));

// Comprehensive Firebase App Mock
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

// Comprehensive Firestore Mock
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  initializeFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  collection: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ toMillis: () => Date.now() }))
  }
}));

// Comprehensive Auth Mock
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
  onAuthStateChanged: vi.fn((auth, cb) => { 
    cb(null); 
    return () => {}; 
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: class {
    addScope() {}
  },
}));

// Comprehensive Storage Mock
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  uploadString: vi.fn(),
  getDownloadURL: vi.fn(() => Promise.resolve('mock-url')),
  deleteObject: vi.fn(),
  listAll: vi.fn(),
}));

// Comprehensive Analytics Mock
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  logEvent: vi.fn(),
}));