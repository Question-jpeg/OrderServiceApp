import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "./AppText";

export default function OrderListItem({
  phone,
  name,
  total_price,
  persons,
  guests,
  status,
  created_at,
  onPress,
  attention,
}) {
  const getBadgeColor = () => {
    if (status === "C") return colors.cyan;
    if (status === "P") return colors.green;
    if (status === "W") return colors.orange;
    if (status === "F") return colors.primary;
  };
  const getStatusLabel = () => {
    if (status === "C") return "Завершён";
    if (status === "P") return "Действует";
    if (status === "W") return "Ожидает код";
    if (status === "F") return "Отменён";
  };

  const getFormattedDate = () => {
    const date = new Date(created_at);
    return `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth()+1)).slice(
      -2
    )}.${date.getFullYear()}   ${("0" + date.getHours()).slice(-2)}:${(
      "0" + date.getMinutes()
    ).slice(-2)}`;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.personsCircle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText style={{ fontSize: 24 }}>{persons}</AppText>
          {guests && <AppText>+{guests}</AppText>}
        </View>
      </View>
      <View style={{ marginLeft: 10, flex: 1 }}>
        {attention && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.primary,
              paddingHorizontal: 10,
              paddingLeft: 20,
              borderRadius: 15,
              marginBottom: 5,
            }}
          >
            <MaterialIcons
              style={{ marginRight: 5 }}
              name="warning"
              size={24}
              color="black"
            />
            <AppText style={{ color: "white" }} fontWeight="bold">
              Не подтверждён
            </AppText>
          </View>
        )}
        <View style={{ flexDirection: "row" }}>
          <AppText style={{ fontSize: 18 }} fontWeight="500">
            {phone}
          </AppText>
          {/* <View style={styles.stripe} /> */}
          <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
            <AppText style={{ color: "white" }} fontWeight="bold">
              {getStatusLabel()}
            </AppText>
          </View>
        </View>
        <AppText numberOfLines={5} style={{ marginTop: 3 }}>
          {name}
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <AppText>{getFormattedDate()}</AppText>
          <AppText
            style={{
              color: colors.cyan,
              fontSize: 18,
              marginLeft: "auto",
              marginRight: 10,
            }}
            fontWeight="bold"
          >
            {total_price}₽
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "grey",
    padding: 10,
  },
  badge: {
    borderRadius: 15,
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  outOfTimeBadge: {},
  personsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.lessSoftGrey,
    justifyContent: "center",
    alignItems: "center",
  },
});
