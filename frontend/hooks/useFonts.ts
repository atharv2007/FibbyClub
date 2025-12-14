import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export function useCustomFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Urbanist': require('../assets/fonts/Urbanist-Regular.ttf'),
          'Urbanist-Medium': require('../assets/fonts/Urbanist-Medium.ttf'),
          'Urbanist-SemiBold': require('../assets/fonts/Urbanist-SemiBold.ttf'),
          'Urbanist-Bold': require('../assets/fonts/Urbanist-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontError(error as Error);
        setFontsLoaded(true); // Still set to true to prevent infinite loading
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, fontError };
}
