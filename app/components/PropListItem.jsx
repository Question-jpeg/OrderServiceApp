import { View, TouchableHighlight, TouchableOpacity } from "react-native";
import { useState } from "react";
import colors from "../config/colors";
import AppText from "./AppText";
import { MaterialCommunityIcons, MaterialIcons, Fontisto } from "@expo/vector-icons";
import RevertButton from "./forms/RevertButton";

import Check from "./Check";
import AppButton from "./AppButton";

export default function PropListItem({
  title,
  text,
  note,
  textComponent,
  icon,
  iconContainerStyle,
  textFontWeight = "bold",
  notice = false,
  checkButton,
  checkState,
  onCheckPress,
  onDeleteButtonPress,
  onRevertButtonPress,
  onPress,
  onRevert,
  error,
  isDeleted,
}) {
  const renderButtons = () => (
    <View style={{ flexDirection: "row" }}>
      {checkButton && (
        <View style={{ flexDirection: "row" }}>
          <Check
            style={{ alignSelf: "flex-end" }}
            iconSize={24}
            onPress={onCheckPress}
            state={checkState}
          />
          <MaterialCommunityIcons name="infinity" size={24} color="black" />
        </View>
      )}
      <RevertButton onRevert={onRevert} visible={notice} />
    </View>
  );

  const renderError = () =>
    error && (
      <>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "red",
            marginVertical: 5,
          }}
        />
        <AppText style={{ color: "red" }}>{error}</AppText>
      </>
    );

  const renderContent = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {text ? (
        <View>
          <AppText
            style={{ fontSize: 20, marginTop: 5 }}
            fontWeight={textFontWeight}
          >
            {text}
          </AppText>
        </View>
      ) : (
        <View style={{marginVertical: 10}}>
          {note && <AppText style={{marginBottom: 10}}>{note}</AppText>}
          {textComponent}
        </View>
      )}
      {renderButtons()}
    </View>
  );

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={colors.lessSoftGrey}
      style={{
        marginBottom: 15,
        marginLeft: 20,
        flexDirection: "row",
        backgroundColor: colors.softGrey,
        borderRadius: 10,
        paddingVertical: 10,
        paddingLeft: 5,
        paddingRight: 10,
        // maxWidth: "90%",
      }}
    >
      <>
        <View
          style={{
            height: "100%",
            width: 4,
            backgroundColor: colors.mediumGrey,
            marginRight: 10,
            borderRadius: 5,
          }}
        />
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                borderColor: colors.mediumGrey,
                borderWidth: 2,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                ...iconContainerStyle,
              }}
            >
              {icon}
            </View>
            <View>
              <AppText
                style={{ marginLeft: 5, fontSize: 16 }}
                fontWeight="bold"
              >
                {title}
              </AppText>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.mediumGrey,
                }}
              />
            </View>
          </View>
          {isDeleted ? (
            <View style={{backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 1, marginTop: 10}}>
              <AppText style={{color: 'white', fontSize: 16}} fontWeight='bold'>Помечен на удаление</AppText>
            </View>
          ) : renderContent()}
          {renderError()}
        </View>

        {onDeleteButtonPress && (
          <AppButton
            color={colors.primary}
            // textStyle={{ fontSize: 12, color: isDeleted ? 'white' : colors.primary }}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 0,
              height: 35,
              marginLeft: 'auto',
              // backgroundColor: isDeleted ? colors.primary : 'white'
            }}
            onPress={isDeleted ? onRevertButtonPress : onDeleteButtonPress}
          >
            {isDeleted ? <Fontisto name="arrow-return-left" size={20} color={colors.cyan} /> : <MaterialIcons name="delete" size={20} color={colors.primary} />}
          </AppButton>
        )}
      </>
    </TouchableHighlight>
  );
}
