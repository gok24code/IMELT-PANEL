import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Text, ActivityIndicator, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { theme } from './config/theme';

// This is the root layout of the app that wraps all screens with AuthProvider.
function RootLayoutNav() {
  const { isSignedIn } = useAuth();

  // Show a loading indicator while the authentication state is being determined.
  if (isSignedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  // The navigation logic is now handled by the useEffect in AuthContext.
  // This component just needs to render the navigator.
  return (
    <Stack>
      {/* Configure a screen in the (auth) group to not show the header */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* All other authenticated routes */}
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

// The top-level component that provides the PaperProvider and AuthProvider.
export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </PaperProvider>
  );
}

