import { TouchableHighlight, View, Animated } from "react-native";
import { useRef, useState } from "react";
import { AppTextInput } from "../inputs/AppTextInput";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import PropListItem from "../PropListItem";
import { FontAwesome5, Octicons } from "@expo/vector-icons";

import AppText from "../AppText";

import colors from "../../config/colors";
import { animate } from "../../utils/animate";

export default function AppFormBooleanField({
  blockErrors,
  name,
  icon,
  iconContainerStyle,
  title,
  textTrue,
  textFalse,
  settingRules,
  onSelect,
}) {
  const { initialValues, values, setFieldValue, errors } = useFormikContext();
  const animatedTextTrueHeightValue = useRef(new Animated.Value(0)).current;
  const animatedTextFalseHeightValue = useRef(new Animated.Value(0)).current;

  const renderBooleanTextComponent = (condition, textTrue, textFalse) => {
    animatedTextFalseHeightValue.stopAnimation();
    animatedTextTrueHeightValue.stopAnimation();
    if (condition) {
      animate(animatedTextFalseHeightValue, 0, 200);
      animate(animatedTextTrueHeightValue, 25, 200);
    } else {
      animate(animatedTextTrueHeightValue, 0, 200);
      animate(animatedTextFalseHeightValue, 25, 200);
    }
    return (
      <View
        style={{
          paddingTop: 10,
          maxWidth: "100%",
        }}
      >
        <Animated.View
          style={{
            height: animatedTextTrueHeightValue,
            flexDirection: "row",
          }}
        >
          <FontAwesome5
            name="check-circle"
            size={25}
            color={colors.mediumGrey}
          />
          <AppText style={{ marginLeft: 5, fontSize: 18 }} fontWeight="bold">
            {textTrue}
          </AppText>
        </Animated.View>

        <Animated.View
          style={{
            height: animatedTextFalseHeightValue,
            flexDirection: "row",
          }}
        >
          <Octicons name="x-circle" size={25} color={colors.mediumGrey} />
          <AppText style={{ marginLeft: 5, fontSize: 18 }} fontWeight="bold">
            {textFalse}
          </AppText>
        </Animated.View>
      </View>
    );
  };

  const setFieldValues = (condition) => {
    if (settingRules) {
      Object.entries(settingRules[condition]).forEach(
        ([key, value]) => setFieldValue(key, value)
      );
    }
  };

  return (
    <PropListItem
      notice={initialValues[name] !== values[name]}
      onRevert={() => {
        setFieldValues(initialValues[name] || false);
        if (onSelect) onSelect(initialValues[name]);
        setFieldValue(name, initialValues[name]);
      }}
      error={!blockErrors && errors[name]}
      onPress={() => {
        setFieldValues(!values[name])
        if (onSelect) onSelect(!values[name]);
        setFieldValue(name, !values[name]);
      }}
      textComponent={renderBooleanTextComponent(
        values[name],
        textTrue,
        textFalse
      )}
      icon={icon}
      iconContainerStyle={iconContainerStyle}
      title={title}
    />
  );
}
