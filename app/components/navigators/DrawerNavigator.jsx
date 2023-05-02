import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import routes from "./routes";
import AdminScreen from "./../../screens/AdminScreen";
import MainNavigator from "./MainNavigator";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import AppText from "../AppText";
import fontNames from "../../assets/fonts/fontNames";
import AppButton from "../AppButton";
import useApi from "../../hooks/useApi";
import notificationsApi from "../../api/notifications";
import useNotifications from "./../../hooks/useNotifications";
import useAuth from "../../hooks/useAuth";

const customDrawerContent = (props) => {
  const {
    isTokenLoading,
    isToken,
    getIsTokenError,
    setTokenLoading,
    setTokenError,
    deleteTokenLoading,
    deleteTokenError,
    register,
    unregister,
  } = useNotifications();
  const { user } = useAuth();

  const getNotificationButtonText = () => {
    if (deleteTokenLoading) return "Подписка удаляется";
    if (deleteTokenError) return "Не удалось удалить подписку";
    if (setTokenLoading) return "Подписка оформляется";
    if (setTokenError) return "Не удалось оформить подписку";
    if (isTokenLoading) return "Подписка проверяется";
    if (getIsTokenError) return "Не удалось проверить подписку";
    if (!isToken) return "Не подключены";
    if (isToken) return "Подключены";
  };

  return (
    <>
      <DrawerContentScrollView
        contentContainerStyle={{ paddingTop: 50 }}
        {...props}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.lessSoftGrey,
            marginLeft: "50%",
            transform: [{ translateX: -50 }],
            marginBottom: 20,
          }}
        >
          <MaterialIcons
            name="admin-panel-settings"
            size={50}
            color={colors.mediumGrey}
          />
        </View>
        <DrawerItemList {...props} />
        {user && (
          <>
            <View
              style={{
                width: "90%",
                height: 1,
                backgroundColor: colors.mediumGrey,
                marginTop: 5,
                alignSelf: "center",
              }}
            />

            <AppText
              style={{
                marginBottom: 5,
                marginTop: 15,
                alignSelf: "center",
                fontSize: 15,
              }}
              fontWeight="500"
            >
              Уведомления о заказах
            </AppText>

            <AppButton
              // color={colors.mediumGrey}
              textStyle={{ fontSize: 14 }}
              style={{
                marginHorizontal: 10,
                padding: 10,
                width: "80%",
                alignSelf: "center",
              }}
              onPress={() => {
                if (isToken) {
                  unregister();
                } else register();
              }}
            >
              {getNotificationButtonText()}
            </AppButton>
          </>
        )}
      </DrawerContentScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 1,
            flex: 1,
            backgroundColor: "grey",
            marginHorizontal: 20,
          }}
        />
        <AppText fontWeight="500" style={{ color: colors.mediumGrey }}>
          © Krezer Individual
        </AppText>
      </View>
    </>
  );
};

const Drawer = createDrawerNavigator();

export default DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={customDrawerContent}
      screenOptions={{
        headerShown: false,
        swipeEdgeWidth: 50,
        drawerLabelStyle: {
          fontFamily: fontNames.Mulish.Mulish700,
          fontSize: 14,
        },
        headerTitleStyle: { fontFamily: fontNames.Mulish.Mulish700 },
      }}
    >
      <Drawer.Screen
        name={routes.MAIN}
        component={MainNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="home" size={25} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={routes.ADMIN}
        component={AdminScreen}
        options={{
          headerShown: true,
          drawerIcon: ({ color }) => (
            <MaterialIcons name="edit" size={25} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
