import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { auth, storage, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { showToast } from '@/utils/toast';
import { useTheme } from '@/hooks/useTheme';

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [bio, setBio] = useState('');
  const { theme: globalTheme, setTheme: setGlobalTheme } = useTheme();
  const [themePreference, setThemePreference] = useState(globalTheme);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    setThemePreference(globalTheme);
  }, [globalTheme]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        setDisplayName(u.displayName || '');
        setPhotoURL(u.photoURL || '');
        
        // Load additional profile data from Firestore
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBio(data.bio || '');
            // We can optionally sync the firestore theme preference to global theme here
            if (data.theme && (data.theme === 'light' || data.theme === 'dark')) {
               setGlobalTheme(data.theme);
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // 1. Update Auth Profile (Display Name & Photo)
      await updateProfile(user, {
        displayName,
        photoURL
      });

      // 2. Update Firestore Profile (Bio, Theme, etc.)
      await setDoc(doc(db, 'users', user.uid), {
        bio,
        theme: themePreference,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 3. Apply Theme Globally
      if (themePreference === 'light' || themePreference === 'dark') {
        setGlobalTheme(themePreference as 'light' | 'dark');
      }

      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `avatars/${user.uid}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setPhotoURL(url);
        // Auto-save photo update
        if (user) {
          await updateProfile(user, { photoURL: url });
          showToast('Avatar updated!', 'success');
        }
      } catch (error) {
        console.error("Avatar upload failed", error);
        showToast('Failed to upload avatar', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans pt-24 pb-8 transition-colors duration-200">
      <TopNav />
      
      <main className="max-w-4xl mx-auto px-4 fade-in">
        <h1 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">👤 User Profile</h1>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 bg-gray-200 dark:bg-gray-600 relative group shadow-lg">
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <i className="fas fa-camera text-white text-2xl"></i>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Click to change avatar</p>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-gray-900 dark:text-white transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 min-h-[100px] text-gray-900 dark:text-white transition-colors"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Theme Preference</label>
                <select 
                  value={themePreference}
                  onChange={(e) => setThemePreference(e.target.value as 'light' | 'dark')}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/20"
                >
                  {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
