import LottieView from "lottie-react-native";
import { Animated, View } from "react-native";
import { useEffect, useRef } from "react";
import { animate } from "../utils/animate";

export default function EndlessLoader({ visible = false, style }) {
  if (!visible) return null;

  const animatedProgressValue = useRef(new Animated.Value(0)).current;

  const startLoadingAnimation = () => {
    animatedProgressValue.setValue(0.01);
    animate(animatedProgressValue, 1, 750, startLoadingAnimation);
  };

  useEffect(() => {
    startLoadingAnimation();
  }, []);

  return (
    <View style={{...style, justifyContent: 'center', alignItems: 'center'}}>
      <LottieView
        source={require("../assets/animations/progressCircle.json")}
        progress={animatedProgressValue}
      />
    </View>
  );
}
