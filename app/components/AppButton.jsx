import { View, Text, TouchableOpacity } from "react-native";

import AppText from "./AppText";

export default function AppButton({ style, children, color, onPress, disabled, icon, textStyle }) {
  return (
    <TouchableOpacity
      style={{
        // backgroundColor: color,
        borderColor: color,
        borderWidth: 3,
        borderRadius: 25,
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        ...style,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText
        fontWeight="bold"
        style={{
          color: color,
          fontSize: 16,
          textTransform: "uppercase",
          ...textStyle
        }}
      >
        {children}
      </AppText>
      {icon}
    </TouchableOpacity>
  );
}
