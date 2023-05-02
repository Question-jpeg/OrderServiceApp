import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

export default function Check({ onPress, iconSize, state, style }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>
        {state ? (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={iconSize}
            color={colors.mediumGrey}
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={iconSize}
            color={colors.mediumGrey}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
