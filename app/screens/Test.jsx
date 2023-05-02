import { Alert, View, Image } from "react-native";
import { useState, useEffect } from "react";
import Screen from "../components/Screen";
import DateTimePicker from "react-native-modal-datetime-picker";
import AppButton from "../components/AppButton";
import TestImageInput from "../components/inputs/TestImageInput";
import Check from "../components/Check";
import ImageInput from "../components/inputs/ImageInput";
// import { Image } from "react-native-expo-image-cache";
import AppCalendar from './../components/AppCalendar';

export default function Test() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [imageList, setImageList] = useState([])
  const handleConfirm = (date) => {
    console.log(date.getTime())
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    console.log('07:00:02' > '07:00:02')
  }, [])

  return (
    <Screen style={{ justifyContent: "center", alignItems: "center" }}>
      <AppButton onPress={() => setDatePickerVisibility(true)}>Открыть календарь</AppButton>
      <AppCalendar visible={isDatePickerVisible} onRequestClose={() => setDatePickerVisibility(false)} />
    </Screen>
  );
}
