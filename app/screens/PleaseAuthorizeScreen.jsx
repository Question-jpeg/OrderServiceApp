import { View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import routes from "../components/navigators/routes";

export default function PleaseAuthorizeScreen({ routeName, navigate }) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <AppText style={{ marginBottom: 10, fontSize: 18 }}>
        Вы не авторизованы
      </AppText>
      <AppButton onPress={() => navigate(routes.ADMIN)}>
        Перейти к авторизации
      </AppButton>
    </View>
  );
}
