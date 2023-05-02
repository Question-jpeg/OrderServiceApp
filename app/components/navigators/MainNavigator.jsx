import { TouchableOpacity } from "react-native";
import { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import colors from "../../config/colors";
import routes from "./routes";
import AppText from "../AppText";

import {
  FontAwesome5,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import ProductsScreen from "./../../screens/ProductsScreen";
import OrdersScreen from "./../../screens/OrdersScreen";
import TimelineScreen from "./../../screens/TimelineScreen";
import fontNames from "../../assets/fonts/fontNames";
import AuthContext from "./../../auth/context";
import ProductsNavigator from "./ProductsNavigator";
import PleaseAuthorizeScreen from "./../../screens/PleaseAuthorizeScreen";
import Test from "../../screens/Test";
import OrdersNavigator from './OrdersNavigator';

const iconSize = 28;

const Tab = createBottomTabNavigator();
export default MainNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <TouchableOpacity {...props} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "grey",
        tabBarStyle: { height: 50 },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: fontNames.Mulish.Mulish400,
        },
        tabBarItemStyle: { paddingBottom: 3 },
      }}
    >
      <Tab.Screen
        name={routes.PRODUCTS_NAVIGATOR}
        component={ProductsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu-book" size={iconSize} color={color} />
          ),
        }}
      />
      {user && (
        <>
          <Tab.Screen
            name={routes.ORDERS_NAVIGATOR}
            component={OrdersNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <FontAwesome name="dollar" size={iconSize - 5} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name={routes.TIMELINE}
            component={TimelineScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={iconSize}
                  color={color}
                />
              ),
            }}
          />
        </>
      )}
      <Tab.Screen name={routes.TESTS} component={Test} />
    </Tab.Navigator>
  );
};
