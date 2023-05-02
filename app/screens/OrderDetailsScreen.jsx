import { RefreshControl, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import PropListItem from "../components/PropListItem";
import Screen from "../components/Screen";
import useApi from "./../hooks/useApi";
import ordersApi from "../api/orders";
import { ScrollView } from "react-native-gesture-handler";
import EndlessLoader from "../components/EndlessLoader";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { guestsProductApiId } from "../config/constants";
import colors from "../config/colors";
import AppText from "../components/AppText";
import * as Linking from "expo-linking";
import AppButton from "../components/AppButton";
import AppModalForm from "../components/forms/AppModalForm";
import * as Yup from "yup";
import AppFormModalField from "./../components/forms/AppFormModalField";
import productsApi from "../api/products";
import AppFormDatePickerField from "./../components/forms/AppFormDatePickerField";
import AppFormComplexField from "./../components/forms/AppFormComplexField";
import LoadingButton from "../components/LoadingButton";
import { getDateTimeText, getUTCDateTimeText } from "../utils/getDate";
import orderItemsApi from "../api/orderItems";

const orderItemValidationSchema = Yup.object().shape({
  product: Yup.number().integer().required("Должен быть заполнен"),
  start_datetime: Yup.string()
    .typeError("Должно быть заполнено")
    .required("Должно быть заполнено"),
  end_datetime: Yup.string()
    .typeError("Должен быть заполнен")
    .required("Должнен быть заполнен")
    .test({
      name: "greaterThanStart",
      exclusive: false,
      message: "Должен быть больше начала",
      test: function (value) {
        const { start_datetime } = this.parent;
        return new Date(value).getTime() > new Date(start_datetime).getTime();
      },
    }),
  quantity: Yup.number()
    .integer()
    .min(1, "Должно быть больше 0")
    .required("Должно быть заполнено"),
  exclude_order_item_id: Yup.number().integer().nullable(),
});

const orderItemInitialValues = {
  quantity: 1,
  start_datetime: null,
  end_datetime: null,
  exclude_order_item_id: null,
};

export default function OrderDetailsScreen({ route }) {
  const orderId = route.params;
  const [deletedOrderItemsIds, setDeletedOrderItemsIds] = useState([]);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const { loading: isOrderItemsDeleting, request: deleteOrderItems } = useApi(
    orderItemsApi.del,
    (data) => data
  );
  const {
    data: priceInfo,
    request: getPrice,
    loading: getPriceLoading,
    error: getPriceError,
    setData: setPriceInfo,
  } = useApi(productsApi.getPrice, (data) => data);
  const {
    data: order,
    loading: getOrderLoading,
    request: getOrder,
    setData: setOrder,
  } = useApi(ordersApi.get, (data) => ({
    ...data,
    total_price: data.items.reduce(
      (accumulator, { total_price }) => accumulator + total_price,
      0
    ),
  }));
  const { data: products, request: getProducts } = useApi(
    productsApi.getProducts,
    (data) => data,
    []
  );

  const getStatusLabel = () => {
    if (order.status === "C") return "Завершён";
    if (order.status === "P") return "Действует";
    if (order.status === "W") return "Ожидает код";
    if (order.status === "F") return "Отменён";
  };

  const getGuests = () => {
    const items = order.items.filter(
      (item) => item.product.id === guestsProductApiId
    );
    let guests = 0;
    items.forEach((item) => (guests += item.quantity));
    return guests ? `+${guests}` : "Нет";
  };

  const getFormattedPhoneNumber = () => {
    const phone = order.phone;
    return `${phone.substring(0, 1)} (${phone.substring(
      1,
      4
    )}) ${phone.substring(4, 7)}-${phone.substring(7, 9)}-${phone.substring(
      9
    )}`;
  };

  const handleOrderItemsDelete = async () => {
    const formData = new FormData();
    deletedOrderItemsIds.forEach((id) => formData.append("order_item_ids", id));
    const response = await deleteOrderItems(orderId, formData);
    if (response.ok) {
      const newOrder = JSON.parse(JSON.stringify(order));
      newOrder.items = newOrder.items.filter(
        (item) => !deletedOrderItemsIds.includes(item.id)
      );
      setOrder(newOrder);
    } else {
      Alert.alert("Ошибка", "Не удалось удалить записи");
    }
    getOrder(orderId)
    setDeletedOrderItemsIds([]);
  };

  const handleOrderItemCreate = async (values) => {
    const response = await orderItemsApi.post(orderId, values);
    if (response.ok) {
      const newOrder = JSON.parse(JSON.stringify(order));
      newOrder.items.push({
        ...response.data,
        product: products.find(
          (product) => product.id === response.data.product
        ),
      });
      console.log(response.data);
      getOrder(orderId)
    } else {
      Alert.alert("Ошибка", response.data?.message);
    }
  };

  const handleOrderItemUpdate = async (id, values) => {
    const response = await orderItemsApi.put(orderId, id, values);
    if (response.ok) {
      const newOrder = JSON.parse(JSON.stringify(order));
      const index = newOrder.items.findIndex((item) => item.id === id);
      newOrder.items[index] = {
        ...response.data,
        product: products.find(
          (product) => product.id === response.data.product
        ),
      };
      getOrder(orderId)
    } else {
      Alert.alert("Ошибка", response.data?.message);
    }
  };

  useEffect(() => {
    getOrder(orderId);
  }, []);

  useEffect(() => {
    if (getPriceError) Alert.alert("Ошибка", JSON.stringify(getPriceError));
  }, [getPriceError]);

  const orderItemFormFields = [
    {
      component: AppFormModalField,
      props: {
        onPress: getProducts,
        onSelect: (button) => {
          const product = products.find(
            (product) => product.id === button.value
          );
          product?.use_hotel_booking_time
            ? setDatePickerMode("date")
            : setDatePickerMode("datetime");
        },
        headerText: "Выберите товар",
        icon: (
          <MaterialCommunityIcons
            name="home-outline"
            size={25}
            color={colors.mediumGrey}
          />
        ),
        buttons: products.map((prod) => ({
          label: prod.title,
          value: prod.id,
        })),
        title: "Товар",
        name: "product",
      },
    },
    {
      component: AppFormDatePickerField,
      props: {
        name: "start_datetime",
        title: "Начало брони",
        mode: datePickerMode,
        deleteButton: true,
        icon: (
          <MaterialCommunityIcons
            name="timeline-clock-outline"
            size={25}
            color={colors.mediumGrey}
          />
        ),
      },
    },
    {
      component: AppFormDatePickerField,
      props: {
        name: "end_datetime",
        title: "Конец брони",
        mode: datePickerMode,
        deleteButton: true,
        icon: (
          <MaterialCommunityIcons
            name="timeline-clock-outline"
            size={25}
            color={colors.mediumGrey}
          />
        ),
      },
    },
    {
      component: AppFormComplexField,
      props: {
        name: "quantity",
        title: "Количество",
        icon: <Octicons name="number" size={24} color={colors.mediumGrey} />,
        iconContainerStyle: {
          paddingHorizontal: 4,
          paddingVertical: 1,
        },
      },
    },
  ];

  const renderPriceInfo = () =>
    priceInfo && (
      <View
        style={{
          borderWidth: 2,
          borderColor: colors.mediumGrey,
          padding: 5,
          marginHorizontal: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <AppText style={{ fontSize: 18 }}>Цена:</AppText>
          <AppText style={{ fontSize: 18 }}>{priceInfo.normal_price}₽</AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <AppText style={{ fontSize: 18 }}>Интервалы:</AppText>
          <AppText style={{ fontSize: 18 }}>{priceInfo.extra_price}₽</AppText>
        </View>
        <View
          style={{
            marginTop: 5,
            width: "100%",
            height: 2,
            backgroundColor: colors.mediumGrey,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <AppText style={{ fontSize: 18 }} fontWeight="500">
            Итого:
          </AppText>
          <AppText fontWeight="500" style={{ fontSize: 20, marginLeft: 10 }}>
            {priceInfo.total_price}₽
          </AppText>
        </View>
      </View>
    );

  const renderPriceInfoLoadingButton = (getValues, getErrors) => (
    <LoadingButton
      loading={getPriceLoading}
      onPress={() => {
        Object.keys(getErrors()).length === 0 &&
          getPrice(getValues().product, getValues());
      }}
      style={{ marginVertical: 10, marginHorizontal: 10 }}
      color={colors.cyan}
      loadingColor={colors.mediumGrey}
    >
      {getPriceLoading ? "Рассчёт" : "Рассчитать цену"}
    </LoadingButton>
  );

  return (
    <Screen>
      {order ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => getOrder(orderId)}
            />
          }
        >
          <AppText style={{ alignSelf: "center", marginVertical: 10 }}>
            Детали заказа
          </AppText>
          <EndlessLoader
            style={{
              width: 50,
              height: 50,
              alignSelf: "center",
              marginBottom: 10,
            }}
            visible={getOrderLoading}
          />
          <View
            style={{
              flexWrap: "wrap",
              flexDirection: "row",
              borderRadius: 10,
              borderWidth: 2,
              borderColor: colors.mediumGrey,
              marginHorizontal: 10,
              marginTop: 10,
              marginBottom: 150,
              paddingRight: 10,
              paddingTop: 20,
            }}
          >
            <PropListItem
              icon={
                <MaterialCommunityIcons
                  name="list-status"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="Статус"
              text={getStatusLabel()}
            />
            <PropListItem
              icon={
                <FontAwesome
                  name="mobile-phone"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              iconContainerStyle={{ paddingHorizontal: 6 }}
              title="Телефон"
              text={getFormattedPhoneNumber()}
            />
            <PropListItem
              icon={
                <MaterialIcons
                  name="person"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="Имя"
              text={order.name}
            />

            <PropListItem
              icon={
                <FontAwesome name="lock" size={25} color={colors.mediumGrey} />
              }
              iconContainerStyle={{ paddingHorizontal: 6 }}
              title="Код"
              text={order.code}
            />
            <PropListItem
              icon={
                <MaterialCommunityIcons
                  name="lock-minus"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="Попыток ввода кода осталось"
              text={order.attempts_left}
            />
            <PropListItem
              icon={
                <MaterialCommunityIcons
                  name="email-minus"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="СМС отправок осталось"
              text={order.resends_left}
            />

            <PropListItem
              icon={
                <MaterialIcons
                  name="date-range"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="Сформирован"
              text={getDateTimeText(order.created_at)}
            />
            <PropListItem
              icon={
                <FontAwesome
                  name="address-card"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="IP адрес"
              text={order.ip_address}
            />
            <PropListItem
              icon={
                <MaterialCommunityIcons
                  name="account-group"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="Количество человек"
              text={order.persons}
            />
            <PropListItem
              icon={
                <MaterialIcons
                  name="group-add"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="Количество гостей"
              text={getGuests()}
            />
            <PropListItem
              icon={
                <FontAwesome
                  name="dollar"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              iconContainerStyle={{ paddingHorizontal: 6 }}
              title="Счёт"
              text={`${order.total_price}₽`}
            />
            <AppModalForm
              objectLabel="Запись"
              header={`\n${order.phone}  '${order.name}'`}
              onClose={() => setPriceInfo(false)}
              footerFunction={(getValues, getErrors) => (
                <>
                  {renderPriceInfo()}
                  {renderPriceInfoLoadingButton(getValues, getErrors)}
                </>
              )}
              icon={
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={25}
                  color={colors.mediumGrey}
                />
              }
              title="Заказной лист"
              onPress={getProducts}
              initialValues={orderItemInitialValues}
              validationSchema={orderItemValidationSchema}
              formFields={orderItemFormFields}
              initialCollapsedFields={[]}
              onSubmit={handleOrderItemCreate}
            >
              {order.items.map((item) => {
                const getInitialValues = () => {
                  const newItem = JSON.parse(JSON.stringify(item));
                  newItem.product = newItem.product.id;
                  newItem.exclude_order_item_id = item.id;
                  return newItem;
                };
                return (
                  <AppModalForm
                    key={item.id}
                    objectLabel="Запись"
                    header={`\n${order.phone}  '${order.name}'`}
                    onDeleteButtonPress={() =>
                      setDeletedOrderItemsIds([
                        ...deletedOrderItemsIds,
                        item.id,
                      ])
                    }
                    onRevertButtonPress={() =>
                      setDeletedOrderItemsIds(
                        deletedOrderItemsIds.filter((id) => id !== item.id)
                      )
                    }
                    isDeleted={deletedOrderItemsIds.includes(item.id)}
                    onClose={() => setPriceInfo(false)}
                    footerFunction={(getValues, getErrors) => (
                      <>
                        {renderPriceInfo()}
                        {renderPriceInfoLoadingButton(getValues, getErrors)}
                      </>
                    )}
                    icon={
                      <FontAwesome
                        name="dollar"
                        size={24}
                        color={colors.mediumGrey}
                      />
                    }
                    iconContainerStyle={{paddingHorizontal: 5, paddingVertical: 2}}
                    title={
                      <AppText style={{ fontSize: 20 }} fontWeight="bold">
                        {item.product.title}
                        {"  "}
                        <AppText
                          style={{ color: colors.mediumGrey }}
                          fontWeight="bold"
                        >
                          {item.total_price}₽
                        </AppText>
                      </AppText>
                    }
                    text={`${getUTCDateTimeText(
                      item.start_datetime
                    )}\n${getUTCDateTimeText(item.end_datetime)}`}
                    onPress={() => {
                      getProducts();
                      setDatePickerMode(
                        item.product.use_hotel_booking_time
                          ? "date"
                          : "datetime"
                      );
                    }}
                    initialValues={getInitialValues()}
                    validationSchema={orderItemValidationSchema}
                    formFields={orderItemFormFields}
                    initialCollapsedFields={[]}
                    onSubmit={(values) =>
                      handleOrderItemUpdate(item.id, values)
                    }
                  />
                );
              })}
            </AppModalForm>
            {(deletedOrderItemsIds.length !== 0 || isOrderItemsDeleting) && (
              <LoadingButton
                onPress={handleOrderItemsDelete}
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  marginBottom: 20,
                }}
                color={colors.primary}
                loadingColor={colors.mediumGrey}
                loading={isOrderItemsDeleting}
              >
                {isOrderItemsDeleting ? "Удаление" : "Удалить записи"}
              </LoadingButton>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <EndlessLoader visible={true} style={{ width: 50, height: 50 }} />
        </View>
      )}
    </Screen>
  );
}
