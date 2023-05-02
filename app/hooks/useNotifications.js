import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import expoPushTokensApi from "../api/notifications";
import { Alert } from "react-native";
import useApi from "./useApi";

export default useNotifications = (notificationListener) => {
  const {
    data: isToken,
    loading: isTokenLoading,
    request: getIsToken,
    error: getIsTokenError,
    setError: setIsTokenError
  } = useApi(expoPushTokensApi.isToken, (isToken) => isToken);
  const {
    loading: setTokenLoading,
    request: setToken,
    error: setTokenError,
    setError: setSetTokenError,
  } = useApi(expoPushTokensApi.setToken, (data) => data);
  const {
    loading: deleteTokenLoading,
    request: deleteToken,
    error: deleteTokenError,
    setError: setDeleteTokenError
  } = useApi(expoPushTokensApi.deleteToken, (data) => data);

  useEffect(() => {
    if (!setTokenLoading && !deleteTokenLoading) getIsToken();
  }, [setTokenLoading, deleteTokenLoading]);

  const clearErrors = () => {
    setIsTokenError(false)
    setDeleteTokenError(false)
    setSetTokenError(false)
  }

  const registerForPushNotifications = async () => {
    try {
      const permission = await Notifications.getPermissionsAsync();
      if (!permission.granted)
        return Alert.alert(
          "Ошибка разрешения",
          'Разрешите получение "push" уведомлений для удобной дальнейшей работы'
        );

      const token = await Notifications.getExpoPushTokenAsync();
      setToken(token.data);
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };

  const register = () => {
    clearErrors()
    registerForPushNotifications();

    if (notificationListener)
      Notifications.addNotificationResponseReceivedListener(
        notificationListener
      );
    // Notifications.addNotificationReceivedListener(() =>
    //   console.log("Получено")
    // );
  };
  const unregister = () => {
    clearErrors()
    deleteToken();
  };

  return {
    isToken,
    isTokenLoading,
    setTokenLoading,
    getIsTokenError,
    setTokenError,
    deleteTokenLoading,
    deleteTokenError,
    register,
    unregister,
  };
};
