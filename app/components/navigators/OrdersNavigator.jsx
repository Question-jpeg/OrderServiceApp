import { createStackNavigator } from "@react-navigation/stack";
import routes from "./routes";
import OrderDetailsScreen from "../../screens/OrderDetailsScreen";
import OrdersScreen from './../../screens/OrdersScreen';

const Stack = createStackNavigator();

export default OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.ORDERS} component={OrdersScreen} />
      <Stack.Screen
        name={routes.ORDER_DETAILS}
        component={OrderDetailsScreen}
      />
    </Stack.Navigator>
  );
};
