import { createStackNavigator } from "@react-navigation/stack";
import ProductsScreen from "../../screens/ProductsScreen";
import routes from "./routes";
import ProductDetailsScreen from './../../screens/ProductDetailsScreen';

const Stack = createStackNavigator();

export default ProductsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.PRODUCTS} component={ProductsScreen} />
      <Stack.Screen
        name={routes.PRODUCT_DETAILS}
        component={ProductDetailsScreen}
      />
    </Stack.Navigator>
  );
};
