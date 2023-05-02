import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "./AppText";

export default function ListItem({
  imageUrl,
  title,
  description,
  price,
  time_unit,
  max_persons,
  onPress,
  is_available,
}) {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Image uri={imageUrl} style={styles.image} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontSize: 18 }} fontWeight="500">
              {title}
            </AppText>
            <View style={styles.stripe} />
          </View>
          <AppText numberOfLines={5} style={{ marginTop: 3 }}>
            {description}
          </AppText>
          <View
            style={{
              flexDirection: "row",
              marginTop: "auto",
            }}
          >
            {time_unit === "D" ? (
              <View style={{ flexDirection: "row", width: "100%" }}>
                {max_persons > 0 && (
                  <>
                    <AppText fontWeight="500" style={{ fontSize: 16 }}>
                      {max_persons}
                    </AppText>
                    <MaterialIcons
                      style={{ marginLeft: 5 }}
                      name="hotel"
                      color={colors.mediumGrey}
                      size={25}
                    />
                  </>
                )}
                <View style={styles.badge}>
                  <AppText style={{ color: "white" }} fontWeight="bold">
                    Сутки
                  </AppText>
                </View>
              </View>
            ) : (
              <View style={styles.badge}>
                <AppText style={{ color: "white" }} fontWeight="bold">
                  Час
                </AppText>
              </View>
            )}
            <AppText
              style={{
                color: colors.cyan,
                fontSize: 18,
                marginLeft: "auto",
                marginRight: 10,
              }}
              fontWeight="bold"
            >
              {price}₽
            </AppText>
          </View>
        </View>
        {!is_available && (
          <View
            style={{
              position: "absolute",
              backgroundColor: colors.primary,
              marginLeft: 100,
              top: "50%",
              paddingHorizontal: 20,
              paddingVertical: 2,
              borderWidth: 2,
              borderColor: colors.mediumGrey,
            }}
          >
            <AppText style={{ color: "white", fontSize: 22 }} fontWeight="bold">
              Недоступен
            </AppText>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "grey",
    padding: 10,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 7,
    position: "absolute",
    right: -15,
    bottom: -20,
    shadowColor: "grey",
    shadowOffset: { height: 5, width: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 15,
  },
  stripe: {
    backgroundColor: colors.mediumGrey,
    height: 1.5,
    alignSelf: "center",
    marginLeft: "auto",
    flex: 1,
    maxWidth: "50%",
  },
});
