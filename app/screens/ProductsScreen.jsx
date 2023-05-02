import { View, FlatList } from "react-native";
import { useEffect, useRef } from "react";
import useApi from "./../hooks/useApi";
import productsApi from "../api/products";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import routes from "../components/navigators/routes";
import EndlessLoader from "../components/EndlessLoader";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import useAuth from "../hooks/useAuth";

import { useScrollToTop } from '@react-navigation/native';
import { guestsProductApiId } from './../config/constants';

export default function ProductsScreen({ navigation }) {
  const { user } = useAuth();
  const flatlist = useRef()
  const {
    data: products,
    error: getProductsError,
    loading: getProductsLoading,
    request: getProducts,
  } = useApi(productsApi.getProducts, (data) => {
    const index = data.findIndex((product) => product.id === guestsProductApiId)
    if (index !== -1) {
    const product = data[index];
    data.splice(index, 1)
    data.push(product)
    }
    return data
  }
  );
  useScrollToTop(flatlist)
  useEffect(() => {
    getProducts();
  }, []);

  

  return (
    <Screen>
      {getProductsError ? (
        <AppText>Не удалось получить список продуктов</AppText>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppText
              style={{ alignSelf: "center", marginTop: 10, marginBottom: 10 }}
              fontWeight="500"
            >
              Обзор товаров
            </AppText>
            {user && (
              <AppButton
                color={colors.primary}
                style={{
                  marginHorizontal: 10,
                  paddingHorizontal: 7.5,
                  paddingVertical: 5,
                  position: "absolute",
                  right: 20,
                }}
                textStyle={{ fontSize: 12 }}
                onPress={() => navigation.navigate(routes.PRODUCT_DETAILS)}
              >
                Добавить
              </AppButton>
            )}
          </View>
          <EndlessLoader
            visible={getProductsLoading}
            style={{ width: 50, height: 50, alignSelf: "center" }}
          />
          <FlatList
            ref={flatlist}
            contentContainerStyle={{ padding: 10 }}
            data={products}
            keyExtractor={(product) => product.id.toString()}
            renderItem={({ item }) => (
              <ListItem
                is_available={item.is_available}
                imageUrl={item.files[0]?.file_thumbnail}
                title={item.title}
                description={item.description}
                price={item.unit_price}
                time_unit={item.time_unit}
                max_persons={item.max_persons}
                onPress={() =>
                  navigation.navigate(routes.PRODUCT_DETAILS, item.id)
                }
              />
            )}
            refreshing={false}
            onRefresh={getProducts}
            ItemSeparatorComponent={() => (
              <View style={{ marginVertical: 5 }} />
            )}
          />
        </>
      )}
    </Screen>
  );
}
