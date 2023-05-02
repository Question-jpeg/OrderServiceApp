import { useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import authStorage from "../auth/storage";

import fontNames from "../assets/fonts/fontNames";

export default function useSplashScreenAndLoadApp(setUser) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loaded] = useFonts({
    [fontNames.Mulish.Mulish400]: require('../assets/fonts/Mulish/static/Mulish-Regular.ttf'),
    [fontNames.Mulish.Mulish500]: require('../assets/fonts/Mulish/static/Mulish-Medium.ttf'),
    [fontNames.Mulish.Mulish700]: require('../assets/fonts/Mulish/static/Mulish-Bold.ttf'),
    [fontNames.Mulish.MulishItalic400]: require('../assets/fonts/Mulish/static/Mulish-Italic.ttf'),
    [fontNames.Mulish.MulishItalic500]: require('../assets/fonts/Mulish/static/Mulish-MediumItalic.ttf'),
    [fontNames.Mulish.MulishItalic700]: require('../assets/fonts/Mulish/static/Mulish-BoldItalic.ttf'),
  });

  const finish = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
    setAppIsReady(true)
    SplashScreen.hideAsync()
  }

  useEffect(() => {
    try {
      // Keep the splash screen visible while we fetch resources
      SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      finish()
    }
  }, [loaded])

  return appIsReady
}
