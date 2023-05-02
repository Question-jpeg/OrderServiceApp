import { View, Alert } from "react-native";
import { useFormikContext } from "formik";
import AppButton from "../AppButton";

import colors from "../../config/colors";
import EndlessLoader from "../EndlessLoader";
import AppText from "../AppText";
import Check from "./../Check";
import LoadingButton from "../LoadingButton";

export default function SubmitButton({
  blockErrors,
  setBlockErrors,
  children,
  uploading,
  style,
  icon,
}) {
  const { handleSubmit, errors } = useFormikContext();
  return (
    <>
      {Object.keys(errors).length !== 0 && !blockErrors && (
        <>
        {/* {Alert.alert('Инфо', JSON.stringify(errors))} */}
          <AppText style={{ alignSelf: "center", marginTop: 20 }}>
            Обнаружены ошибки в заполнении формы
          </AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText>Скрыть ошибки</AppText>
            <Check
              iconSize={22}
              state={blockErrors}
              onPress={() => setBlockErrors(true)}
            />
          </View>
        </>
      )}
      <LoadingButton
        onPress={() => {
          setBlockErrors(false);
          handleSubmit();
        }}
        style={style}
        color={colors.primary}
        loadingColor="grey"
        loading={uploading}
        icon={icon}
      >
        {children}
      </LoadingButton>
    </>
  );
}
