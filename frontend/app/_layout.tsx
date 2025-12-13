import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { COLORS } from '../constants/theme';
import { BottomNav } from '../components/navigation/BottomNav';

export default function RootLayout() {
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
      </Stack>
      <BottomNav />
    </>
  );
}
