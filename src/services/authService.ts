import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '@/lib/firebase';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/youtube.upload');
googleProvider.addScope('https://www.googleapis.com/auth/youtube.readonly');

export const authService = {
  // Sign in with Google
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  },

  // Sign Up with Email/Password
  signupWithEmail: async (email: string, pass: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  },

  // Login with Email/Password
  loginWithEmail: async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },

  // Auth State Observer
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    // Firebase's onAuthStateChanged fires synchronously on first call if a user
    // is already cached. Do NOT pre-call here — it causes double invocations and
    // state flicker (AuthContext would render twice on load).
    return onAuthStateChanged(auth, callback);
  },

  // Get Current User
  getCurrentUser: () => {
    return auth.currentUser;
  }
};
