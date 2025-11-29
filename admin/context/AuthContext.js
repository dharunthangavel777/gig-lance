import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, database } from '../lib/firebase';
import { ref, get } from 'firebase/database';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the current user is an admin
  const checkAdminStatus = async (uid) => {
    try {
      const adminRef = ref(database, `admins/${uid}`);
      const snapshot = await get(adminRef);
      return snapshot.exists();
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  // Sign in with email and password (admin only)
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const isUserAdmin = await checkAdminStatus(userCredential.user.uid);
    
    if (!isUserAdmin) {
      await signOut(auth);
      throw new Error("Access denied. Admins only.");
    }
    
    return userCredential;
  };

  // Sign in with Google (admin only)
  const signInWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const isUserAdmin = await checkAdminStatus(userCredential.user.uid);
    
    if (!isUserAdmin) {
      await signOut(auth);
      throw new Error("Access denied. Admins only.");
    }
    
    return userCredential;
  };

  // Logout
  const logout = async () => {
    setUser(null);
    setIsAdmin(false);
    await signOut(auth);
  };

  // Subscribe to user on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isUserAdmin = await checkAdminStatus(user.uid);
        
        if (!isUserAdmin) {
          setUser(null);
          setIsAdmin(false);
          await signOut(auth);
        } else {
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
          });
          setIsAdmin(true);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin,
        loading, 
        login, 
        logout, 
        signInWithGoogle
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
