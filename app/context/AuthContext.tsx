import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useSegments } from 'expo-router';

interface AuthContextType {
  isSignedIn: boolean | null;
  signIn: (teacherName: string) => Promise<void>; // Token removed
  signOut: () => Promise<void>;
  teacherName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const segments = useSegments();
  const inAuthGroup = segments[0] === '(auth)';

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        // Now only rely on teacherName for local login status
        const storedTeacherName = await AsyncStorage.getItem('teacherName');
        setIsSignedIn(!!storedTeacherName);
        setTeacherName(storedTeacherName);
      } catch (e) {
        console.error('Failed to load auth data:', e);
        setIsSignedIn(false);
        setTeacherName(null);
      }
    };
    loadAuthData();
  }, []);

  useEffect(() => {
    if (isSignedIn === null) return;

    if (isSignedIn && !inAuthGroup) {
      router.replace('/');
    } else if (!isSignedIn && inAuthGroup) {
      // Stay on auth screens if not signed in
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/login');
    }
  }, [isSignedIn, inAuthGroup]);

  const signIn = async (name: string) => { // Token parameter removed
    await AsyncStorage.setItem('teacherName', name);
    setIsSignedIn(true);
    setTeacherName(name);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('teacherName'); // Only remove teacherName
    setIsSignedIn(false);
    setTeacherName(null);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, teacherName }}>
      {children}
    </AuthContext.Provider>
  );
}

