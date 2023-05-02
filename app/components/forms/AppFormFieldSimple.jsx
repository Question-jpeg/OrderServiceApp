import { View, TouchableHighlight } from "react-native";
import { useRef } from "react";
import { AppTextInput } from "../inputs/AppTextInput";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import colors from "../../config/colors";
import RevertButton from "./RevertButton";

export default function AppFormFieldSimple({
  blockErrors,
  name,
  icon,
  containerStyle,
  ...otherProps
}) {
  const { initialValues, values, setFieldValue, errors } = useFormikContext();
  const textInput = useRef();

  return (
    <TouchableHighlight
      style={containerStyle}
      underlayColor={colors.lessSoftGrey}
      onPress={() => {
        if (textInput.current) textInput.current.focus();
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <AppTextInput
            ref={textInput}
            onChangeText={(text) => setFieldValue(name, text)}
            value={values[name]}
            {...otherProps}
          />
          <View style={{ flexDirection: "row" }}>
            <RevertButton
              onRevert={() => setFieldValue(name, initialValues[name])}
              visible={initialValues[name] !== values[name]}
            />
            <View style={{ marginLeft: 10 }}>{icon}</View>
          </View>
        </View>
        <ErrorMessage error={!blockErrors && errors[name]} />
      </View>
    </TouchableHighlight>
  );
}
