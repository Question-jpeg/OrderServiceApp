import { TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import AppButton from "./AppButton";
import AppText from "./AppText";
import EndlessLoader from "./EndlessLoader";

export default function LoadingButton({
  children,
  loading,
  onPress,
  style,
  color,
  loadingColor,
  icon
}) {
  return (
    <TouchableOpacity
      style={{
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 3,
          borderColor: loading ? loadingColor : color,
          borderRadius: 20,
          padding: 10,
          ...style,
      }}
      disabled={loading}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppText
          style={{
            fontSize: 16,
            color: loading ? loadingColor : color,
            textAlign: "center",
            textTransform: "uppercase",
          }}
          fontWeight="bold"
        >
          {children}
        </AppText>
        {icon}
        <EndlessLoader
          visible={loading}
          style={{ width: 40, height: 40, marginLeft: 10 }}
        />
      </View>
    </TouchableOpacity>
  );
}
