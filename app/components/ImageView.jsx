import { FlatList, Modal, ScrollView, RefreshControl, Dimensions } from "react-native";
import { useRef, useEffect } from "react";

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function ImageView({
  visible,
  onRequestClose,
  imageIndex,
  imageComponents,
}) {

  const getItemLayout = (data, index) => (
    {length: WIDTH, offset: WIDTH * index, index}
  )

  return (
    <Modal visible={visible} animationType="fade">
      <ScrollView
        style={{backgroundColor: 'black'}}
        contentContainerStyle={{backgroundColor: 'white', flex: 1}}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRequestClose} />
        }
      >
        <FlatList
          initialScrollIndex={imageIndex}
          contentContainerStyle={{marginTop: '50%'}}
          getItemLayout={getItemLayout}
          horizontal
          pagingEnabled
          keyExtractor={(componentObj) => componentObj.key}
          data={imageComponents}
          renderItem={({item}) => item.component}
        />
      </ScrollView>
    </Modal>
  );
}
