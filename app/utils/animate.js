import { Animated } from 'react-native';

export const animate = (animatedValue, toValue, duration, callBack, easing = null) => {
  const config = {
    toValue,
    duration,
    useNativeDriver: false,
}
if (easing) config['easing'] = easing

    Animated.timing(animatedValue, config ).start(callBack);
};
