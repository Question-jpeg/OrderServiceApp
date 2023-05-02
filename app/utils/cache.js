import AsyncStorage from "@react-native-async-storage/async-storage";

const prefix = "cache_";
const expiryInMinutes = 5

const store = async (key, value) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (error) {
    console.log(error);
  }
};

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);

    return item?.value

  } catch (error) {
    console.log(error);
  }
};

export default {
  store,
  get,
};