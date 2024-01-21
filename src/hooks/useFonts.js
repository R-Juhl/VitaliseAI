import * as Font from "expo-font";
import { Platform } from "react-native";

const fontPath = Platform.OS === 'ios'
  ? require('../../assets/fonts/Inter-Regular.ttf')
  : 'Inter';  // On Android, Expo handles the default fonts

export default useFonts = async () =>
  await Font.loadAsync({
    'Inter': fontPath,
  });