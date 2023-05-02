import {
  ScrollView,
  Modal,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { AppTextInput } from "../inputs/AppTextInput";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import PropListItem from "../PropListItem";
import { FontAwesome5, Octicons } from "@expo/vector-icons";

import AppText from "../AppText";

import colors from "../../config/colors";
import AppButton from "../AppButton";
import { AppForm } from "./AppForm";
import SubmitButton from "./SubmitButton";
import Screen from "../Screen";

import Collapsible from "react-native-collapsible";
import useAuth from "../../hooks/useAuth";

export default function AppModalForm({
  icon,
  iconContainerStyle,
  title,
  header,
  footerFunction,
  objectLabel,
  text,
  note,
  onPress,
  onDeleteButtonPress,
  onRevertButtonPress,
  isDeleted,
  formFields,
  initialValues,
  validationSchema,
  onSubmit,
  onClose,
  initialCollapsedFields,
  children,
}) {
  const { user } = useAuth();
  const [isModalVisible, setModalVisibility] = useState(false);
  const textProperty = text ? { text } : { textComponent: children };
  const [collapsedFields, setCollapsedFields] = useState(
    initialCollapsedFields
  );
  const [blockErrors, setBlockErrors] = useState(true);
  const form = useRef();

  const handleSubmit = (values) => {
    onSubmit(values);
    setBlockErrors(true);
    setModalVisibility(false);
    if (onClose) onClose();
  };

  const collapseFields = (condition, collapseRules) => {
    setCollapsedFields(collapseRules[condition]);
  };

  return (
    <>
      <PropListItem
        onPress={() => {
          if (onPress) onPress();
          setModalVisibility(true);
          setCollapsedFields(initialCollapsedFields);
        }}
        {...textProperty}
        note={note}
        icon={icon}
        iconContainerStyle={iconContainerStyle}
        title={title}
        onDeleteButtonPress={onDeleteButtonPress}
        isDeleted={isDeleted}
        onRevertButtonPress={onRevertButtonPress}
      />
      <Modal transparent visible={isModalVisible} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <Screen style={{ padding: 10, paddingTop: 30 }}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <AppText
                style={{ fontSize: 18, textAlign: "center" }}
                fontWeight="500"
              >
                {initialValues.id
                  ? `Изменить ${objectLabel} для `
                  : `Добавить ${objectLabel} для `}
                <AppText style={{ fontSize: 18 }} fontWeight="bold">
                  {header}
                </AppText>
              </AppText>
              <AppForm
                ref={form}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                <View
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderRadius: 10,
                    borderColor: colors.mediumGrey,
                    marginHorizontal: 10,
                    marginTop: 20,
                    marginBottom: 10,
                    // paddingRight: 20,
                    paddingTop: 20,
                  }}
                >
                  {formFields.map((field) => (
                    <Collapsible
                      key={field.props.name}
                      collapsed={collapsedFields.includes(field.props.name)}
                      duration={1000}
                    >
                      <field.component
                        {...field.props}
                        blockErrors={blockErrors}
                        onSelect={(value) => {
                          field.props.collapseRules &&
                            collapseFields(value, field.props.collapseRules);
                          field.props.onSelect && field.props.onSelect(value);
                        }}
                      />
                    </Collapsible>
                  ))}
                </View>
                {footerFunction &&
                  footerFunction(
                    form.current?.getValues,
                    form.current?.getErrors
                  )}

                {user && (
                  <SubmitButton
                    blockErrors={blockErrors}
                    setBlockErrors={setBlockErrors}
                    style={{
                      paddingVertical: 15,
                      borderRadius: 25,
                      marginTop: 10,
                    }}
                  >
                    Сохранить
                  </SubmitButton>
                )}
              </AppForm>
              <AppButton
                style={{
                  backgroundColor: colors.lessSoftGrey,
                  marginTop: 10,
                  marginBottom: 250,
                }}
                onPress={() => {
                  setModalVisibility(false);
                  setBlockErrors(true);
                  if (onClose) onClose();
                }}
              >
                Отмена
              </AppButton>
            </ScrollView>
          </Screen>
        </View>
      </Modal>
    </>
  );
}
