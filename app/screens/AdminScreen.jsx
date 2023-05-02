import { View, ScrollView, Animated } from "react-native";
import { useRef, useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { AppForm } from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import SubmitButton from "../components/forms/SubmitButton";
import { useIsFocused } from "@react-navigation/native";
import useApi from "./../hooks/useApi";
import auth from "../api/auth";

import ErrorMessage from "../components/forms/ErrorMessage";
import useAuth from "./../hooks/useAuth";
import EndlessLoader from "./../components/EndlessLoader";
import AuthContext from "../auth/context";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .transform((_value, originalValue) => String(originalValue.trim()))
    .required("Логин обязателен к заполнению")
    .label("Логин"),
  password: Yup.string()
    .transform((_value, originalValue) => String(originalValue.trim()))
    .required("Пароль обязателен к заполнению")
    .label("Пароль"),
});

export default function AdminScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [blockErrors, setBlockErrors] = useState(true);
  const { logIn, logOut } = useAuth();
  const { error, loading, request, setError } = useApi(
    auth.login,
    (data) => data
  );

  const isFocused = useIsFocused();

  const handleSubmit = async ({ username, password }) => {
    const response = await request({ username, password });
    if (response.ok) {
      logIn(response.data.access, response.data.refresh);
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (!isFocused && !blockErrors) {
      setBlockErrors(true);
      setError(false);
    }
  }, [isFocused]);

  return (
    <Screen style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: 300,
            marginTop: 50,
            alignItems: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.softGrey,
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 20,
            }}
          >
            <MaterialCommunityIcons
              name="circle-edit-outline"
              size={60}
              color={colors.mediumGrey}
            />
          </View>
          {!user ? (
            <>
              <ErrorMessage error={error && "Неверный логин или пароль"} />
              <AppForm
                initialValues={{
                  username: "",
                  password: "",
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                <AppFormField
                  blockErrors={blockErrors}
                  name="username"
                  autoCompleteType="username"
                  textContentType="username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Логин"
                  placeholderTextColor="grey"
                  icon={
                    <MaterialIcons
                      name="person"
                      size={25}
                      color={colors.mediumGrey}
                    />
                  }
                />
                <AppFormField
                  blockErrors={blockErrors}
                  name="password"
                  autoCompleteType="password"
                  textContentType="password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Пароль"
                  placeholderTextColor="grey"
                  icon={
                    <FontAwesome
                      name="lock"
                      size={25}
                      color={colors.mediumGrey}
                    />
                  }
                  iconStyle={{ paddingHorizontal: 5 }}
                />
                <SubmitButton
                  blockErrors={blockErrors}
                  setBlockErrors={setBlockErrors}
                  style={{ marginHorizontal: 20, width: "80%", paddingVertical: 15, marginTop: 10 }}
                  uploading={loading}
                  icon={
                    <>
                      {!loading && (
                        <View style={{ marginLeft: 5 }}>
                          <AntDesign
                            name="login"
                            size={20}
                            color={colors.primary}
                          />
                        </View>
                      )}
                    </>
                  }
                >
                  {!loading ? "Войти" : "Вход"}
                </SubmitButton>
              </AppForm>
            </>
          ) : (
            <>
              <AppText style={{ fontSize: 16 }}>Вход выполнен</AppText>
              <AppButton
                style={{ marginTop: 20, width: "80%" }}
                onPress={() => {
                  logOut();
                }}
              >
                Выход
              </AppButton>
            </>
          )}
        </View>
        <View style={{ height: 300 }} />
      </ScrollView>
    </Screen>
  );
}
