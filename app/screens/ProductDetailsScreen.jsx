import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
  Text,
  Alert,
  Image,
} from "react-native";
import * as Yup from "yup";
import productsApi from "../api/products";
import productIntervalsApi from "../api/productIntervals";
import Screen from "../components/Screen";
import useApi from "./../hooks/useApi";
import { useRef, useState, useEffect } from "react";
import AppText from "../components/AppText";
import EndlessLoader from "./../components/EndlessLoader";
import AppButton from "../components/AppButton";
import { animate } from "./../utils/animate";
import { useDimensions } from "@react-native-community/hooks";
import { Image as ImageCached } from "react-native-expo-image-cache";
import colors from "../config/colors";
import PropListItem from "./../components/PropListItem";
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  Fontisto,
  AntDesign,
} from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import AppFormFieldSimple from "./../components/forms/AppFormFieldSimple";
import SubmitButton from "../components/forms/SubmitButton";
import { AppForm } from "../components/forms/AppForm";
import AppFormBooleanField from "../components/forms/AppFormBooleanField";
import AppFormComplexField from "./../components/forms/AppFormComplexField";
import AppFormModalField from "../components/forms/AppFormModalField";

import Collapsible from "react-native-collapsible";
import AppFormDatePickerField from "./../components/forms/AppFormDatePickerField";

import fontNames from "../assets/fonts/fontNames";
import { guestsProductApiId } from "./../config/constants";
import AppModalForm from "../components/forms/AppModalForm";
import ImageInput from "../components/inputs/ImageInput";
import productImagesApi from "../api/productImages";
import transformImageToFormDataField from "../utils/transformImageToFormDataField";
import LoadingButton from "./../components/LoadingButton";

// import ImageView from "../components/ImageView";
import ImageView from "react-native-image-viewing";
import { getUTCDateText } from "./../utils/getDate";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Должно быть заполнено"),
  is_available: Yup.boolean().required("Должна быть заполнена"),
  unit_price: Yup.number()
    .integer()
    .min(0, "Должна быть неотрицательной")
    .required("Должна быть заполнена"),
  time_unit: Yup.string().required("Должен быть указан"),
  min_unit: Yup.number()
    .integer()
    .min(1, "Должен быть больше 0")
    .required("Должен быть заполнен"),
  max_unit: Yup.number()
    .typeError("Должен быть числом")
    .integer()
    .min(1, "Должен быть больше 0")
    .required("Должен быть заполнен"),
  use_hotel_booking_time: Yup.boolean().required("Должно быть заполнено"),
  max_persons: Yup.number()
    .integer()
    .nullable()
    .when("use_hotel_booking_time", {
      is: true,
      then: Yup.number()
        .integer()
        .min(0, "Должно быть неотрицательным")
        .typeError("Введите корректное значение")
        .required("Должно быть заполнено"),
    }),
  required_product: Yup.number().integer().nullable(),
  min_hour: Yup.string()
    .nullable()
    .when("use_hotel_booking_time", {
      is: false,
      then: Yup.string()
        .typeError("Введите корректное значение")
        .required("Должно быть заполнено"),
    }),
  max_hour: Yup.string()
    .nullable()
    .when("use_hotel_booking_time", {
      is: false,
      then: Yup.string()
        .typeError("Введите корректное значение")
        .required("Должно быть заполнено"),
    }),
  description: Yup.string().nullable(),
});

const intervalValidationSchema = Yup.object().shape({
  start_datetime: Yup.string().when("is_weekends", {
    is: true,
    then: Yup.string().nullable().oneOf([null], 'Выбраны "Выходные"'),
    otherwise: Yup.string()
      .typeError("Заполните необходимые поля")
      .required("Должно быть заполнено"),
  }),
  end_datetime: Yup.string()
    .when("is_weekends", {
      is: true,
      then: Yup.string().nullable().oneOf([null], 'Выбраны "Выходные"'),
      otherwise: Yup.string()
        .typeError("Заполните необходимые поля")
        .required("Должно быть заполнено"),
    })
    .test({
      name: "greaterThanStartIfNotWeekends",
      exclusive: false,
      message: "Должен быть больше начала",
      test: function (value) {
        const { start_datetime, is_weekends } = this.parent;
        if (is_weekends) return true;
        return new Date(value).getTime() > new Date(start_datetime).getTime();
      },
    }),
  is_weekends: Yup.boolean()
    .nullable()
    .test({
      name: "nullIfDate",
      exclusive: false,
      message: "Указан интервал",
      test: function (value) {
        const { start_datetime, end_datetime } = this.parent;
        if (start_datetime || end_datetime) return !value;
        return true;
      },
    })
    .test({
      name: "SetIfNotDate",
      exclusive: false,
      message: "Недостаточно данных для валидации формы",
      test: function (value) {
        const { start_datetime, end_datetime } = this.parent;
        if (start_datetime || end_datetime) return true;
        return value;
      },
    }),
  additional_price_per_unit: Yup.number()
    .integer()
    .min(0, "Должна быть неотрицательной")
    .typeError("Заполните необходимые поля")
    .required("Должна быть заполнена"),
});

const getIntervalFormFields = (interval) => [
  {
    component: AppFormBooleanField,
    props: {
      title: "Выходные",
      name: "is_weekends",
      textTrue: "Выбраны",
      textFalse: "Не выбраны",
      settingRules: {
        true: { start_datetime: null, end_datetime: null },
        false: interval.id
          ? {
              start_datetime: interval.start_datetime,
              end_datetime: interval.end_datetime,
            }
          : {},
      },
      collapseRules: {
        true: ["start_datetime", "end_datetime"],
        false: [],
      },
      icon: (
        <MaterialIcons name="weekend" size={24} color={colors.mediumGrey} />
      ),
    },
  },
  {
    component: AppFormDatePickerField,
    props: {
      name: "start_datetime",
      title: "Начало интервала",
      mode: "date",
      deleteButton: true,
      icon: (
        <MaterialCommunityIcons
          name="timeline-clock-outline"
          size={25}
          color={colors.mediumGrey}
        />
      ),
    },
  },
  {
    component: AppFormDatePickerField,
    props: {
      name: "end_datetime",
      title: "Конец интервала",
      mode: "date",
      deleteButton: true,
      icon: (
        <MaterialCommunityIcons
          name="timeline-clock-outline"
          size={25}
          color={colors.mediumGrey}
        />
      ),
    },
  },
  {
    component: AppFormComplexField,
    props: {
      name: "additional_price_per_unit",
      title: "Надбавка",
      icon: <FontAwesome name="dollar" size={22} color={colors.mediumGrey} />,
      extraIcon: (
        <FontAwesome
          style={{ marginLeft: 5 }}
          name="ruble"
          size={20}
          color="black"
        />
      ),
      iconContainerStyle: {
        paddingHorizontal: 5.5,
        paddingVertical: 2,
      },
    },
  },
];

const initialProductValues = {
  use_hotel_booking_time: false,
  is_available: true,
  time_unit: "H",
};

const initialIntervalValues = {
  start_datetime: null,
  end_datetime: null,
  is_weekends: true,
  additional_price_per_unit: null,
};

export default function ProductDetailsScreen({ navigation, route }) {
  const productId = route.params;
  const { user } = useAuth();
  const { screen } = useDimensions();
  const [blockErrors, setBlockErrors] = useState(true);
  const [period, setPeriod] = useState();
  const [isHotelOptions, setIsHotelOptions] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [addedImages, setAddedImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [imagesUpdating, setImagesUpdating] = useState(false);
  const [deletedIntervals, setDeletedIntervals] = useState([]);
  const [intervalsUpdating, setIntervalsUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const form = useRef();
  const flatlist = useRef();

  const {
    data: product,
    loading: getProductLoading,
    error: getProductError,
    request: getProduct,
    setData: setProduct,
  } = useApi(
    productsApi.get,
    (data) => {
      data.required_product = data.required_product?.id;
      return data;
    },
    {}
  );
  const {
    data: products,
    error: getProductsError,
    request: getProducts,
  } = useApi(productsApi.getProducts, (data) => data, []);

  // const {} = useApi(productImagesApi.)

  const refresh = async () => {
    await getProduct(productId);
    setBlockErrors(true);
    setAddedImages([]);
    setDeletedImages([]);
    form.current?.resetForm();
  };

  const handleSubmit = async (values) => {
    setBlockErrors(true);
    setUploading(true);
    if (productId) {
      const response = await productsApi.put(productId, values);
      if (response.ok) {
        refresh();
        Alert.alert("Успех", "Продукт успешно обновлён");
      } else {
        Alert.alert("Ошибка", "Не удалось обновить продукт");
      }
    } else {
      const response = await productsApi.post(values);
      if (response.ok) {
        refresh();
        Alert.alert("Успех", "Продукт успешно создан");
      } else {
        Alert.alert("Ошибка", "Не удалось создать продукт");
      }
    }
    setUploading(false);
  };

  const handleIntervalSubmit = async (id, values) => {
    if (!id) {
      const response = await productIntervalsApi.post(productId, values);
      if (response.ok) {
        const newProduct = JSON.parse(JSON.stringify(product));
        newProduct.product_special_intervals.push({
          id: response.data.id,
          ...values,
        });
        setProduct(newProduct);
      } else {
        Alert.alert("Ошибка сохранения изменений", response.data.message);
      }
    } else {
      const response = await productIntervalsApi.put(productId, id, values);
      if (response.ok) {
        const newProduct = JSON.parse(JSON.stringify(product));
        const index = newProduct.product_special_intervals.findIndex(
          (interval) => interval.id === id
        );
        newProduct.product_special_intervals[index] = values;
        setProduct(newProduct);
      } else {
        Alert.alert("Ошибка сохранения изменений", response.data.message);
      }
    }
  };

  const deleteIntervals = async () => {
    setIntervalsUpdating(true);
    const formData = new FormData();
    deletedIntervals.forEach((id) => formData.append("intervals_ids", id));
    const response = await productIntervalsApi.del(productId, formData);
    if (response.ok) {
      const newProduct = JSON.parse(JSON.stringify(product));
      newProduct.product_special_intervals =
        newProduct.product_special_intervals.filter(
          (interval) => !deletedIntervals.includes(interval.id)
        );
      setProduct(newProduct);
    } else {
      Alert.alert("Ошибка", "Не удалось удалить интервалы");
    }
    setIntervalsUpdating(false);
    setDeletedIntervals([]);
  };

  const getImages = () => {
    const addedImagesObjects = [
      ...addedImages.map((image) => ({
        file_thumbnail: image,
        file: image,
      })),
    ];
    if (product.files)
      return [
        ...product.files.map((fileObj) => {
          fileObj.deleting = deletedImages.includes(fileObj.id);
          return fileObj;
        }),
        ...addedImagesObjects,
      ];
    return [...addedImagesObjects];
  };

  const saveImagesChanges = async () => {
    setImagesUpdating(true);
    if (deletedImages.length !== 0) {
      const formData = new FormData();
      deletedImages.forEach((imageId) => formData.append("files_ids", imageId));
      const response = await productImagesApi.del(productId, formData);
      if (!response.ok) {
        // Alert.alert("Ошибка", "Не удалось удалить фотографии");
        Alert.alert("Ошибка", response.data);
      }
    }
    if (addedImages.length !== 0) {
      const formData = new FormData();
      addedImages.forEach((imageUri) =>
        formData.append("files", transformImageToFormDataField(imageUri))
      );
      const response = await productImagesApi.post(productId, formData);
      if (!response.ok) Alert.alert("Ошибка", "Не удалось добавить фотографии");
    }
    getProduct(productId);
    setAddedImages([]);
    setDeletedImages([]);
    setImagesUpdating(false);
  };

  const updateMainPhoto = async (fileId, index) => {
    const response = await productImagesApi.makePrimary(productId, fileId);
    if (response.ok) {
      const newProduct = JSON.parse(JSON.stringify(product));
      const firstFile = newProduct.files[0];
      const currentFile = newProduct.files[index];
      firstFile.is_primary = false;
      currentFile.is_primary = true;
      newProduct.files[0] = currentFile;
      newProduct.files[index] = firstFile;
      setProduct(newProduct);
    } else {
      Alert.alert("Ошибка", "Не удалось обновить главную фотографию");
    }
  };

  useEffect(() => {
    setPeriod(product.time_unit);
    setIsHotelOptions(product.use_hotel_booking_time);
  }, [product]);

  useEffect(() => {
    if (productId) getProduct(productId);
    else {
      setProduct(initialProductValues);
    }
    getProducts();
  }, []);

  return (
    <Screen>
      {!getProductError || !productId ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refresh} />
          }
        >
          <EndlessLoader
            visible={getProductLoading}
            style={{
              width: 50,
              height: 50,
              alignSelf: "center",
              marginVertical: 30,
            }}
          />
          <ImageView
            images={getImages().map((fileObj) => ({ uri: fileObj.file }))}
            visible={imageViewVisible}
            imageIndex={imageIndex}
            onRequestClose={() => setImageViewVisible(false)}
          />
          <View>
            <FlatList
              ref={flatlist}
              horizontal
              pagingEnabled
              data={getImages()}
              keyExtractor={(fileObj) => fileObj.file_thumbnail}
              renderItem={({ item, index }) => (
                <View>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setImageIndex(index);
                      setImageViewVisible(true);
                    }}
                  >
                    {item.id ? (
                      <ImageCached
                        uri={item.file_thumbnail}
                        style={{ width: screen.width, height: 300 }}
                      />
                    ) : (
                      <Image
                        source={{ uri: item.file_thumbnail }}
                        style={{ width: screen.width, height: 300 }}
                      />
                    )}
                  </TouchableWithoutFeedback>
                  {!item.id && (
                    <View
                      style={{
                        padding: 5,
                        paddingHorizontal: 10,
                        backgroundColor: colors.cyan,
                        position: "absolute",
                        right: 10,
                        top: 10,
                        borderRadius: 15,
                      }}
                    >
                      <AppText style={{ color: "white" }} fontWeight="bold">
                        Загружено в форму
                      </AppText>
                    </View>
                  )}
                  {item.deleting && (
                    <View
                      style={{
                        padding: 5,
                        paddingHorizontal: 10,
                        backgroundColor: colors.primary,
                        position: "absolute",
                        right: 10,
                        top: 10,
                        borderRadius: 15,
                      }}
                    >
                      <AppText style={{ color: "white" }} fontWeight="500">
                        Помечен на удаление
                      </AppText>
                    </View>
                  )}
                  {item.id &&
                    (item.is_primary ? (
                      <View style={styles.mainPhotoIcon}>
                        <MaterialIcons
                          name="star-outline"
                          size={32}
                          color="white"
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={async () => {
                          await updateMainPhoto(item.id, index);
                          flatlist.current?.scrollToOffset({
                            animated: true,
                            offset: 0,
                          });
                        }}
                        style={styles.mainPhotoIcon}
                      >
                        <MaterialCommunityIcons
                          name="checkbox-blank-circle-outline"
                          size={32}
                          color="white"
                        />
                      </TouchableOpacity>
                    ))}
                  <TouchableOpacity
                    onPress={() =>
                      item.id
                        ? !item.deleting
                          ? setDeletedImages([...deletedImages, item.id])
                          : setDeletedImages(
                              deletedImages.filter(
                                (imageId) => imageId !== item.id
                              )
                            )
                        : setAddedImages(
                            addedImages.filter((image) => image !== item.file)
                          )
                    }
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: colors.lessSoftGrey,
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                      bottom: 10,
                      left: 10,
                    }}
                  >
                    {item.deleting ? (
                      <Fontisto
                        name="arrow-return-left"
                        size={24}
                        color={colors.primary}
                      />
                    ) : (
                      <AntDesign
                        name="minus"
                        size={32}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
            {productId && (
              <ImageInput
                icon={
                  getImages().length !== 0 ? (
                    <AntDesign name="plus" size={32} color={colors.cyan} />
                  ) : (
                    <MaterialCommunityIcons
                      name="camera-plus"
                      size={44}
                      color={colors.cyan}
                    />
                  )
                }
                style={
                  getImages().length !== 0
                    ? {
                        position: "absolute",
                        backgroundColor: colors.mediumGrey,
                        bottom: 10,
                        right: 10,
                      }
                    : {
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        alignSelf: "center",
                        backgroundColor: colors.softGrey,
                        marginBottom: 40,
                        marginTop: 60,
                      }
                }
                onAddPhotos={(uris) =>
                  setAddedImages([...addedImages, ...uris])
                }
              />
            )}
          </View>

          {(addedImages.length !== 0 ||
            deletedImages.length !== 0 ||
            imagesUpdating) &&
            user && (
              <LoadingButton
                onPress={saveImagesChanges}
                style={{ margin: 10 }}
                color={colors.primary}
                loadingColor="grey"
                loading={imagesUpdating}
              >
                {imagesUpdating
                  ? "Обновление"
                  : "Сохранить изменения фотографий"}
              </LoadingButton>
            )}
          <AppForm
            ref={form}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            initialValues={product}
          >
            <View
              style={{
                borderRadius: 10,
                borderWidth: 2,
                borderColor: colors.mediumGrey,
                marginHorizontal: 5,
                marginTop: 10,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <View style={{ width: "100%", marginBottom: 10 }}>
                <AppFormFieldSimple
                  blockErrors={blockErrors}
                  containerStyle={{
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  icon={<MaterialIcons name="edit" size={24} color="black" />}
                  name="title"
                  placeholder="Название"
                  style={{ color: "black", fontSize: 22 }}
                  placeholderTextColor="grey"
                />
                <View
                  style={{
                    flex: 1,
                    backgroundColor: colors.mediumGrey,
                    height: 1,
                  }}
                />
              </View>
              <AppFormBooleanField
                onSelect={(value) => setIsAvailable(value)}
                title="Доступность"
                name="is_available"
                blockErrors={blockErrors}
                icon={
                  <FontAwesome
                    name="universal-access"
                    size={25}
                    color={colors.mediumGrey}
                  />
                }
                textTrue="Доступен для гостей"
                textFalse="Недоступен для гостей"
              />
              <Collapsible collapsed={!isAvailable} duration={1000}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <AppFormBooleanField
                    blockErrors={blockErrors}
                    onSelect={setIsHotelOptions}
                    settingRules={{
                      true: {
                        time_unit: "D",
                        min_hour: null,
                        max_hour: null,
                        max_persons: product.max_persons,
                      },
                      false: {
                        time_unit: product.time_unit,
                        max_persons: null,
                        min_hour: product.min_hour,
                        max_hour: product.max_hour,
                      },
                    }}
                    name="use_hotel_booking_time"
                    icon={
                      <Fontisto
                        name="hotel"
                        size={20}
                        color={colors.mediumGrey}
                      />
                    }
                    title="Бронирование без учёта времени"
                    textTrue="Используется"
                    textFalse="Не используется"
                  />
                  <Collapsible collapsed={!isHotelOptions} duration={1000}>
                    <AppFormComplexField
                      name="max_persons"
                      blockErrors={blockErrors}
                      icon={
                        <MaterialIcons
                          name="hotel"
                          size={25}
                          color={colors.mediumGrey}
                        />
                      }
                      title="Количество спальных мест"
                    />
                  </Collapsible>
                  <Collapsible collapsed={isHotelOptions} duration={1000}>
                    <AppFormDatePickerField
                      name="min_hour"
                      title="Время старта услуги"
                      blockErrors={blockErrors}
                      mode="time"
                      icon={
                        <MaterialCommunityIcons
                          name="timeline-clock-outline"
                          size={25}
                          color={colors.mediumGrey}
                        />
                      }
                    />
                    <AppFormDatePickerField
                      name="max_hour"
                      title="Время окончания услуги"
                      blockErrors={blockErrors}
                      mode="time"
                      icon={
                        <MaterialCommunityIcons
                          name="timeline-clock-outline"
                          size={25}
                          color={colors.mediumGrey}
                        />
                      }
                    />
                  </Collapsible>

                  <AppFormModalField
                    onSelect={(button) => setPeriod(button.value)}
                    name="time_unit"
                    title="Период"
                    headerText="Выберите период для товара "
                    headerProductTitle={product.title}
                    buttons={[
                      { label: "Сутки", value: "D" },
                      { label: "Час", value: "H" },
                    ]}
                    blockErrors={blockErrors}
                    icon={
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={25}
                        color={colors.mediumGrey}
                      />
                    }
                  />
                  <AppFormComplexField
                    name="unit_price"
                    blockErrors={blockErrors}
                    icon={
                      <FontAwesome
                        name="dollar"
                        size={22}
                        color={colors.mediumGrey}
                      />
                    }
                    extraIcon={
                      <FontAwesome
                        style={{ marginLeft: 5 }}
                        name="ruble"
                        size={20}
                        color="black"
                      />
                    }
                    iconContainerStyle={{
                      paddingHorizontal: 5.5,
                      paddingVertical: 2,
                    }}
                    title="Цена"
                  />
                  <AppFormComplexField
                    name="min_unit"
                    blockErrors={blockErrors}
                    icon={
                      <MaterialCommunityIcons
                        name="clock-minus-outline"
                        size={25}
                        color={colors.mediumGrey}
                      />
                    }
                    title={`Минимум ${
                      period ? (period === "D" ? "суток" : "часов") : ""
                    } для заказа`}
                  />
                  <AppFormComplexField
                    name="max_unit"
                    blockErrors={blockErrors}
                    isUnlimitedButton
                    icon={
                      <MaterialCommunityIcons
                        name="clock-plus-outline"
                        size={25}
                        color={colors.mediumGrey}
                      />
                    }
                    title={`Максимум ${
                      period ? (period === "D" ? "суток" : "часов") : ""
                    } для заказа`}
                  />
                  <AppFormModalField
                    onPress={getProducts}
                    headerText="Выберите товар-родителя для товара "
                    headerProductTitle={product.title}
                    icon={
                      <MaterialCommunityIcons
                        name="home-outline"
                        size={25}
                        color={colors.mediumGrey}
                      />
                    }
                    blockErrors={blockErrors}
                    buttons={[
                      ...products
                        .filter(
                          (prod) =>
                            prod.id !== product.id &&
                            prod.id !== guestsProductApiId
                        )
                        .map((prod) => ({
                          label: prod.title,
                          value: prod.id,
                        })),
                      { label: "Нет", value: undefined },
                    ]}
                    title="Необходимый товар"
                    name="required_product"
                  />

                  <AppFormComplexField
                    style={{
                      fontFamily: fontNames.Mulish.Mulish500,
                      fontSize: 18,
                    }}
                    keyboardType="default"
                    multiline
                    name="description"
                    title="Описание"
                    icon={
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        size={25}
                        color={colors.mediumGrey}
                      />
                    }
                  />
                  {product.product_special_intervals && (
                    <AppModalForm
                      formFields={getIntervalFormFields(initialIntervalValues)}
                      initialValues={initialIntervalValues}
                      initialCollapsedFields={[
                        "start_datetime",
                        "end_datetime",
                      ]}
                      validationSchema={intervalValidationSchema}
                      onSubmit={(values) => handleIntervalSubmit(null, values)}
                      title="Интервалы"
                      objectLabel="интервал"
                      header={`${product.title}`}
                      note={`*Конечная дата в интервале не учитывается`}
                      icon={
                        <MaterialIcons
                          name="date-range"
                          size={25}
                          color={colors.mediumGrey}
                        />
                      }
                    >
                      <>
                        {product.product_special_intervals?.map((interval) =>
                          interval.is_weekends ? (
                            <AppModalForm
                              formFields={getIntervalFormFields(interval)}
                              initialValues={interval}
                              initialCollapsedFields={[
                                "start_datetime",
                                "end_datetime",
                              ]}
                              validationSchema={intervalValidationSchema}
                              onSubmit={(values) =>
                                handleIntervalSubmit(interval.id, values)
                              }
                              onDeleteButtonPress={() =>
                                setDeletedIntervals([
                                  ...deletedIntervals,
                                  interval.id,
                                ])
                              }
                              onRevertButtonPress={() =>
                                setDeletedIntervals(
                                  deletedIntervals.filter(
                                    (id) => id !== interval.id
                                  )
                                )
                              }
                              isDeleted={deletedIntervals.includes(interval.id)}
                              key="weekends"
                              title="Выходные"
                              objectLabel="интервал"
                              header={`${product.title}`}
                              text={`+${
                                interval.additional_price_per_unit
                              }₽ за ${period === "D" ? "Сутки" : "Час"}`}
                              icon={
                                <MaterialIcons
                                  name="weekend"
                                  size={25}
                                  color={colors.mediumGrey}
                                />
                              }
                            />
                          ) : (
                            <AppModalForm
                              formFields={getIntervalFormFields(interval)}
                              initialValues={interval}
                              initialCollapsedFields={[]}
                              validationSchema={intervalValidationSchema}
                              onSubmit={(values) =>
                                handleIntervalSubmit(interval.id, values)
                              }
                              onDeleteButtonPress={() =>
                                setDeletedIntervals([
                                  ...deletedIntervals,
                                  interval.id,
                                ])
                              }
                              onRevertButtonPress={() =>
                                setDeletedIntervals(
                                  deletedIntervals.filter(
                                    (id) => id !== interval.id
                                  )
                                )
                              }
                              isDeleted={deletedIntervals.includes(interval.id)}
                              key={interval.start_datetime}
                              title={`${getUTCDateText(
                                interval.start_datetime
                              )}\n${getUTCDateText(interval.end_datetime)}`}
                              objectLabel="интервал"
                              header={`${product.title}`}
                              text={`+${
                                interval.additional_price_per_unit
                              }₽ за ${period === "D" ? "Сутки" : "Час"}`}
                              icon={
                                <MaterialIcons
                                  name="celebration"
                                  size={25}
                                  color={colors.mediumGrey}
                                />
                              }
                            />
                          )
                        )}
                        {product.product_special_intervals?.length == 0 && (
                          <AppText style={{ fontSize: 20 }}>
                            Интервалов нет
                          </AppText>
                        )}
                      </>
                    </AppModalForm>
                  )}
                  {(deletedIntervals.length !== 0 || intervalsUpdating) &&
                    user && (
                      <LoadingButton
                        onPress={deleteIntervals}
                        style={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          paddingHorizontal: 30,
                          paddingVertical: 10,
                          marginBottom: 20,
                        }}
                        color={colors.primary}
                        loadingColor={colors.mediumGrey}
                        loading={intervalsUpdating}
                      >
                        {intervalsUpdating ? "Удаление" : "Удалить интервалы"}
                      </LoadingButton>
                    )}
                </View>
              </Collapsible>
            </View>
            {user && (
              <SubmitButton
                blockErrors={blockErrors}
                style={{
                  marginBottom: 250,
                  marginVertical: 10,
                  paddingVertical: 15,
                  marginHorizontal: 10,
                  borderRadius: 25,
                }}
                setBlockErrors={setBlockErrors}
                uploading={uploading}
              >
                {uploading ? "Обновление" : "Сохранить"}
              </SubmitButton>
            )}
          </AppForm>
        </ScrollView>
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <>
            <AppText style={{ marginBottom: 10, fontSize: 18 }}>
              Не удалось загрузить товар
            </AppText>
            <AppButton onPress={() => getProduct(productId)}>
              Попробовать снова
            </AppButton>
          </>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  mainPhotoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.purple,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 10,
    left: 10,
  },
});
