import { View, FlatList } from "react-native";
import { useEffect, useRef } from "react";
import useApi from "./../hooks/useApi";
import ordersApi from "../api/orders";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import routes from "../components/navigators/routes";
import EndlessLoader from "../components/EndlessLoader";
import OrderListItem from "../components/OrderListItem";
import notificationsApi from "../api/notifications";
import { guestsProductApiId } from "./../config/constants";
import { useScrollToTop } from '@react-navigation/native';

export default function OrdersScreen({ navigation }) {
  const flatlist = useRef()

  useScrollToTop(flatlist)

  const {
    data: orders,
    error: getOrdersError,
    loading: getOrdersLoading,
    request: getOrders,
  } = useApi(ordersApi.getOrders, (data) => {
    data = data.results;
    data.sort(
      (order1, order2) =>
        new Date(order2.created_at).getTime() -
        new Date(order1.created_at).getTime()
    );

    return data.map((order) => ({
      ...order,
      total_price: order.items.reduce((accumulator, {total_price}) => accumulator + total_price, 0),
    }));
  });
  const { data: isToken, request: getIsToken } = useApi(
    notificationsApi.isToken,
    (data) => data
  );

  const getGuests = (order) => {
    const items = order.items.filter(
      (item) => item.product.id === guestsProductApiId
    );
    let guests = 0;
    items.forEach((item) => (guests += item.quantity));
    return guests ? guests : null;
  };

  const refresh = () => {
    getOrders();
    getIsToken();
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Screen>
      {getOrdersError ? (
        <AppText>Не удалось получить список заказов</AppText>
      ) : (
        <>
          <AppText
            style={{ alignSelf: "center", marginVertical: 10 }}
            fontWeight="500"
          >
            Обзор заказов
          </AppText>
          {!isToken && (
            <AppText style={{ alignSelf: "center", marginBottom: 10 }}>
              Уведомления не подключены
            </AppText>
          )}
          <EndlessLoader
            visible={getOrdersLoading}
            style={{ width: 50, height: 50, alignSelf: "center" }}
          />
          <FlatList
            ref={flatlist}
            contentContainerStyle={{ padding: 10 }}
            data={orders}
            keyExtractor={(order) => order.id.toString()}
            renderItem={({ item: order }) => (
              <OrderListItem
                phone={order.phone}
                name={order.name}
                persons={order.persons}
                guests={getGuests(order)}
                total_price={order.total_price}
                status={order.status}
                attention={order.status === 'W' && ((Date.now() + 600000) > (new Date(order.created_at).getTime()))}
                created_at={order.created_at}
                onPress={() =>
                  navigation.navigate(routes.ORDER_DETAILS, order.id)
                }
              />
            )}
            refreshing={false}
            onRefresh={refresh}
            ItemSeparatorComponent={() => (
              <View style={{ marginVertical: 5 }} />
            )}
          />
        </>
      )}
    </Screen>
  );
}
