import { View, StyleSheet } from "react-native";

import defaultStyles from '../../config/defaultStyles';
import AppText from './../AppText';

export default function ErrorMessage({ style, error }) {
  if (!error) return null;
  return <AppText style={{color: 'red'}}>{error}</AppText>;
}

const styles = StyleSheet.create({
  text: {
    ...defaultStyles.text,
    color: "red",
  },
});
