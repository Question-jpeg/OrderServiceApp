import { View } from "react-native";
import Constants from "expo-constants";
import { useNetInfo } from "@react-native-community/netinfo";
import AppText from "./AppText";

import colors from "../config/colors";

export default function OfflineNotice() {
  const netInfo = useNetInfo();

  if (!(netInfo.isInternetReachable === false && netInfo.type !== "unknown"))
    return null;
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: Constants.statusBarHeight,
        padding: 10,
        backgroundColor: colors.primary,
      }}
    >
      <AppText style={{ color: "white", fontSize: 16 }}>
        No Internet Connection
      </AppText>
    </View>
  );
}
