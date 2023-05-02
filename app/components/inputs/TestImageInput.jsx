import { View, TouchableOpacity } from 'react-native'
import * as ImagePicker from "expo-image-picker";

export default function TestImageInput() {

  const getImage = async () => {
    const response = await ImagePicker.launchImageLibraryAsync()
    console.log(response.uri)
  }

  return (
    <TouchableOpacity onPress={getImage}>
        <View style={{width: 50, height: 50, backgroundColor: 'black'}} />
    </TouchableOpacity>
  )
}
