import { View, TouchableOpacity } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import colors from "../../config/colors";

export default function RevertButton({ onRevert, visible, style }) {
  if (!visible) return null;
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        ...style,
      }}
      onPress={onRevert}
    >
      <>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.primary,
            marginRight: 10,
          }}
        />

        <Fontisto name="arrow-return-left" size={20} color={colors.cyan} />
      </>
    </TouchableOpacity>
  );
}
