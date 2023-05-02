import { TouchableHighlight, View, Animated } from "react-native";
import { useRef, useEffect, useState } from "react";
import { AppTextInput } from "../inputs/AppTextInput";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import PropListItem from "../PropListItem";
import {
  FontAwesome,
  Octicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import colors from "../../config/colors";
import Check from "../Check";
import AppText from "../AppText";

export default function AppFormComplexField({
  blockErrors,
  name,
  icon,
  extraIcon,
  isUnlimitedButton,
  iconContainerStyle,
  title,
  keyboardType='number-pad',
  ...other
}) {
  const { initialValues, values, setFieldValue, errors } = useFormikContext();
  const textInput = useRef();

  const isUnlimited = isUnlimitedButton && `${values[name]}` === '999';

  return (
    <>
      <PropListItem
        error={!blockErrors && errors[name]}
        checkButton={isUnlimitedButton}
        checkState={isUnlimited}
        onCheckPress={
          !isUnlimited
            ? () => setFieldValue(name, '999')
            : () => setFieldValue(name, null)
        }
        notice={`${initialValues[name]}` !== `${values[name]}`}
        onRevert={() => setFieldValue(name, initialValues[name])}
        onPress={() => {
          if (isUnlimited) {
            setFieldValue(name, '');
          }
          textInput.current?.focus();
        }}
        textComponent={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            
            {!isUnlimited && (
              <>
                <AppTextInput
                  ref={textInput}
                  value={values[name]?.toString()}
                  onChangeText={(text) => setFieldValue(name, text)}
                  keyboardType={keyboardType}
                  {...other}
                />

                <View style={{ marginRight: "auto" }}>
                  {(blockErrors || !errors[name]) && extraIcon}
                </View>
              </>
            )}
            {isUnlimited && (
              <AppText style={{ fontSize: 20 }} fontWeight="bold">
                Неограничено
              </AppText>
            )}
          </View>
        }
        icon={icon}
        iconContainerStyle={iconContainerStyle}
        title={title}
      />
    </>
  );
}
