import { Text } from "react-native";

import fontNames from "../assets/fonts/fontNames";

const customFonts = {
  400: {
    false: fontNames.Mulish.Mulish400,
    true: fontNames.Mulish.MulishItalic400,
  },
  500: {
    false: fontNames.Mulish.Mulish500,
    true: fontNames.Mulish.MulishItalic500,
  },
  bold: {
    false: fontNames.Mulish.Mulish700,
    true: fontNames.Mulish.MulishItalic700,
  },
};

export default function AppText({
  style,
  children,
  fontWeight = "400",
  italic = false,

  ...other
}) {
  return (
    <Text style={{ fontFamily: customFonts[fontWeight][italic], ...style }} {...other}>
      {children}
    </Text>
  );
}
