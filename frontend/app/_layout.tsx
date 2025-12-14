import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar, View } from 'react-native';
import { useEffect } from 'react';
import { COLORS } from '../constants/theme';
import { BottomNav } from '../components/navigation/BottomNav';
import { AuthProvider, useAuth } from '../context/AuthContext';

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
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
