import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import MainNavigator from "./app/components/navigators/MainNavigator";
import NavigationTheme from "./app/components/navigators/NavigationTheme";
import useSplashScreenAndLoadApp from "./app/hooks/useSplashScreenAndLoadApp";
import OfflineNotice from "./app/components/OfflineNotice";
import { NavigationContainer } from "@react-navigation/native";
import AuthContext from "./app/auth/context";
import DrawerNavigator from "./app/components/navigators/DrawerNavigator";

LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);

export default function App() {
  const [user, setUser] = useState();
  const appIsReady = useSplashScreenAndLoadApp(setUser);

  if (!appIsReady) return null;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <StatusBar style="dark" />
      <OfflineNotice />
      <NavigationContainer theme={NavigationTheme}>
        <DrawerNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
