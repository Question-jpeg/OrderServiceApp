import { TextInput } from "react-native";
import { useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import fontNames from "../../assets/fonts/fontNames";
import { useDimensions } from "@react-native-community/hooks";

export const AppTextInput = forwardRef(({ style, value, ...other }, ref) => {
  const textInput = useRef();

  const { screen } = useDimensions()

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (textInput.current) textInput.current.focus();
    },
  }));

  return (
    <TextInput
      ref={textInput}
      value={value}
      style={{
        fontFamily: value
          ? fontNames.Mulish.Mulish700
          : fontNames.Mulish.MulishItalic400,

        fontSize: 20,
        maxWidth: screen.width * 0.65,
        ...style,
      }}
      {...other}
    />
  );
});
