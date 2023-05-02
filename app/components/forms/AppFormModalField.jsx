import { Modal, View, TouchableWithoutFeedback } from "react-native";
import { useRef, useState } from "react";
import { AppTextInput } from "../inputs/AppTextInput";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import PropListItem from "../PropListItem";
import { FontAwesome5, Octicons } from "@expo/vector-icons";

import AppText from "../AppText";

import colors from "../../config/colors";
import { animate } from "../../utils/animate";
import AppButton from "../AppButton";

export default function AppFormModalField({
  blockErrors,
  name,
  icon,
  iconContainerStyle,
  title,
  headerText,
  headerProductTitle,
  buttons,
  onPress,
  onSelect,
}) {
  const { initialValues, values, setFieldValue, errors } = useFormikContext();
  const [isModalVisible, setModalVisibility] = useState(false);

  return (
    <>
      <PropListItem
        notice={initialValues[name] !== values[name]}
        onRevert={() => {
          setFieldValue(name, initialValues[name]);
          const button = buttons.find((button) => button.value === initialValues[name])
          if (onSelect && button) onSelect(button);
        }}
        onPress={() => {
          if (onPress) onPress();
          setModalVisibility(true);
        }}
        error={!blockErrors && errors[name]}
        text={buttons.find((button) => button.value === values[name])?.label}
        icon={icon}
        iconContainerStyle={iconContainerStyle}
        title={title}
      />
      <Modal transparent visible={isModalVisible} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisibility(false)}>
            <View style={{ width: "100%", flex: 1 }} />
          </TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <AppText
              style={{
                fontSize: 18,
                alignSelf: "center",
                marginTop: 20,
                textAlign: "center",
              }}
            >
              {headerText}
              <AppText style={{ fontSize: 20 }} fontWeight="bold">
                {headerProductTitle}
              </AppText>
            </AppText>
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: colors.mediumGrey,
                marginBottom: 20,
              }}
            />
            {buttons.map((button) => (
              <AppButton
                key={button.label}
                style={{
                  width: "100%",
                  borderRadius: 15,
                  marginBottom: 5,
                  borderWidth: 2,
                  backgroundColor: colors.softGrey,
                }}
                onPress={() => {
                  setFieldValue(name, button.value);
                  setModalVisibility(false);
                  if (onSelect) onSelect(button);
                  
                }}
              >
                {button.label}
              </AppButton>
            ))}

            <AppButton
              style={{
                width: "100%",
                marginVertical: 20,
                backgroundColor: colors.lessSoftGrey,
              }}
              onPress={() => setModalVisibility(false)}
            >
              Отмена
            </AppButton>
          </View>
        </View>
      </Modal>
    </>
  );
}
