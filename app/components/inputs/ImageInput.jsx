import { View, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState } from "react";
import colors from "../../config/colors";
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AssetsSelector } from "expo-images-picker";
import Screen from "../Screen";

const widgetErrors = {
  errorTextColor: "red",
  errorMessages: {
    hasErrorWithPermissions: "Не предоставлено разрешение",
    hasErrorWithLoading: "Не удалось загрузить",
    hasErrorWithResizing: "Не удалось адаптировать",
    hasNoAssets: "Нет файлов",
  },
};
const widgetStyles = {
  margin: 2,
  bgColor: "white",
  spinnerColor: colors.mediumGrey,
  widgetWidth: 99,
  screenStyle: {
    borderRadius: 5,
    overflow: "hidden",
  },
  widgetStyle: {
    margin: 10,
  },
  videoIcon: {
    Component: Ionicons,
    iconName: "ios-videocam",
    color: "white",
    size: 20,
  },
  selectedIcon: {
    Component: Ionicons,
    iconName: "ios-checkmark-circle",
    color: colors.white,
    bg: "transparent",
    size: 36,
  },
};
const widgetResize = {
  // width: 512,
  // compress: 1,
  // base64: false,
  saveTo: 'jpeg',
};

export default function ImageInput({
  style,
  icon,
  onAddPhotos,
  maxSelection = 999,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSuccess = (data) => {
    onAddPhotos(data.map((fileObj) => fileObj.uri));
    setIsModalVisible(false);
  };

  const widgetSettings = {
    getImageMetaData: false,
    initialLoad: 100,
    // assetsType: [MediaType.photo, MediaType.video],
    minSelection: 1,
    maxSelection,
    portraitCols: 3,
    landscapeCols: 4,
  };

  const widgetNavigator = {
    Texts: {
      finish: "Готово",
      back: "Отмена",
      selected: "Выбрано",
    },
    midTextColor: colors.mediumGrey,
    minSelection: 1,
    // maxSelection: 1,
    // buttonTextStyle: ,
    buttonStyle: { backgroundColor: colors.lessSoftGrey, borderRadius: 15 },
    onBack: () => setIsModalVisible(false),
    onSuccess: (data) => handleSuccess(data),
  };

  const checkPermission = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Вы должны разрешить доступ к галерее для загрузки фотографий");
      return;
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 50,
          height: 50,
          borderRadius: 25,
          ...style,
        }}
      >
        {icon}
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide">
        <Screen style={{ paddingTop: 5 }}>
          <AssetsSelector
            Settings={widgetSettings}
            Errors={widgetErrors}
            Styles={widgetStyles}
            Navigator={widgetNavigator}
            Resize={widgetResize}
          />
        </Screen>
      </Modal>
    </>
  );
}
