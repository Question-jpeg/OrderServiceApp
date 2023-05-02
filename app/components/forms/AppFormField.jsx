import { View, TouchableHighlight } from "react-native";
import { AppTextInput } from "../inputs/AppTextInput";
import { useRef } from "react";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import colors from "../../config/colors";

export default function AppFormField({
  blockErrors,
  name,
  icon,
  iconStyle,
  ...otherProps
}) {
  const { values, setFieldValue, errors } = useFormikContext();
  const textInput = useRef();

  return (
    <>
      <TouchableHighlight
        onPress={textInput.current?.focus}
        underlayColor={colors.lessSoftGrey}
        style={{
          backgroundColor: colors.softGrey,
          width: "80%",
          padding: 10,
          borderRadius: 15,
          marginBottom: 5,
          marginTop: 5
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 10, ...iconStyle }}>{icon}</View>
          <AppTextInput
            ref={textInput}
            onChangeText={(text) => setFieldValue(name, text)}
            value={values[name]}
            {...otherProps}
          />
        </View>
      </TouchableHighlight>
      <ErrorMessage error={!blockErrors && errors[name]} />
    </>
  );
}
