import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { COLORS } from '../constants/theme';
import { BottomNav } from '../components/navigation/BottomNav';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useCustomFonts } from '../hooks/useFonts';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth' || segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'select-banks';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to auth screen if not logged in
      router.replace('/auth');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if already logged in
      router.replace('/');
    }
  }, [isAuthenticated, loading, segments]);

  const showBottomNav = isAuthenticated && !segments.includes('chat-conversation') && !segments.includes('auth') && !segments.includes('login') && !segments.includes('signup') && !segments.includes('select-banks');

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="track" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="select-banks" />
      </Stack>
      {showBottomNav && <BottomNav />}
    </>
  );
}

export default function RootLayout() {
  const { fontsLoaded, fontError } = useCustomFonts();

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Log font error if any (but continue rendering)
  if (fontError) {
    console.warn('Font loading error:', fontError);
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
