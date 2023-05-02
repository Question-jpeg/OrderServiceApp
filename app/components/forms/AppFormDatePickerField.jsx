import { TouchableHighlight, View, Animated } from "react-native";
import { useRef, useEffect, useState } from "react";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useFormikContext } from "formik";
import PropListItem from "../PropListItem";
import {
  getUTCDate,
  getUTCDateText,
  getUTCDateTimeText,
  getLocaleUTCString,
  getDateFromTimeString,
  getTimeTextFromTimeString,
} from "../../utils/getDate";
import AppCalendar from "../AppCalendar";

export default function AppFormDatePickerField({
  blockErrors,
  name,
  icon,
  iconContainerStyle,
  deleteButton,
  title,
  mode,
  onConfirm,
}) {
  const { initialValues, values, setFieldValue, errors } = useFormikContext();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleConfirm = (dat) => {
    const date = new Date(dat);
    mode === "time"
      ? setFieldValue(
          name,
          `${("0" + date.getHours()).slice(-2)}:${(
            "0" + date.getMinutes()
          ).slice(-2)}:00`
        )
      : setFieldValue(name, getLocaleUTCString(date));
    setDatePickerVisibility(false);
    if (onConfirm) onConfirm();
  };

  return (
    <>
      <PropListItem
        error={!blockErrors && errors[name]}
        notice={`${initialValues[name]}` !== `${values[name]}`}
        onRevert={() => setFieldValue(name, initialValues[name])}
        onPress={() => setDatePickerVisibility(true)}
        onDeleteButtonPress={
          deleteButton && values[name] && (() => setFieldValue(name, null))
        }
        text={
          values[name] &&
          (mode === "time"
            ? getTimeTextFromTimeString(values[name])
            : mode === "date"
            ? getUTCDateText(values[name])
            : getUTCDateTimeText(values[name]))
        }
        icon={icon}
        iconContainerStyle={iconContainerStyle}
        title={title}
      />
      <AppCalendar visible={isDatePickerVisible} />
    </>
  );
}
