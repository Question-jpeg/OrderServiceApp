import {
  ScrollView,
  Modal,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import colors from "../config/colors";
import AppText from "./AppText";
import { useDimensions } from "@react-native-community/hooks";
import AppButton from "./AppButton";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import DateTimePickerEvent from "@react-native-community/datetimepicker";
import Screen from "./Screen";
import {
  getUTCTimeTextFromDate,
  getUTCDate,
  getTimeTextFromDate,
  getDateFromTimeString,
  getTimeDateFromDate,
} from "./../utils/getDate";

const daysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const range = (size, startAt = 1) => {
  return [...Array(size).keys()].map((i) => i + startAt);
};

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const types = {
  selected: { disabled: false, color: colors.green, name: "selected" },
  selectedUnavailable: { disabled: true, color: colors.green },
  out: { disabled: true, color: "lightgrey" },
  overlay: {
    disabled: true,
    colors: [colors.orange, colors.yellow],
  },
  end: {
    disabled: false,
    colors: [colors.orange, colors.cyan],
    name: "end",
  },
  endUnavailable: {
    disabled: true,
    colors: [colors.orange, "lightgrey"],
  },
  endOut: {
    disabled: true,
    colors: [colors.orange, "lightgrey"],
  },
  busy: {
    disabled: true,
    color: colors.orange,
  },
  secondSelected: {
    disabled: false,
    color: colors.blue,
    name: "secondSelected",
  },
  secondSelectedUnavailable: {
    disabled: true,
    color: colors.blue,
  },
  secondInvalidSelected: {
    disabled: true,
    color: colors.purple,
  },
  today: {
    disabled: false,
    color: colors.lessSoftGrey,
  },
  neutral: {
    disabled: false,
    color: colors.softGrey,
  },
};

export default function AppCalendar({
  visible,
  busyRanges = [
    {
      start_datetime: new Date(2022, 7, 11, 22),
      end_datetime: new Date(2022, 7, 15, 20),
    },
    // {
    //   start_datetime: new Date(2022, 7, 15),
    //   end_datetime: new Date(2022, 7, 20),
    // },
    {
      start_datetime: new Date(2022, 7, 24, 22, 0),
      end_datetime: new Date(2022, 7, 24, 23, 0),
    },
    // {
    //   start_datetime: new Date(2022, 7, 24, 16, 0),
    //   end_datetime: new Date(2022, 7, 24, 20, 0),
    // },
  ],
  allowedRange,
  //  = {
  //   start_datetime: new Date(2022, 7, 13),
  //   end_datetime: new Date(2022, 7, 18),
  // },
  header,
  initialMode = "datetime",
  initialStartDate = new Date(),
  initialEndDate,
  onConfirm,
  onRequestClose,
  minTime = "10:00",
  maxTime = "03:00",
  minHours = 2,
  maxHours = 8,
  calendarSize = 1,
}) {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(
    initialStartDate
      ? initialStartDate
      : allowedRange && getUTCDate(allowedRange.start_datetime)
  );
  const [secondSelectedDate, setSecondSelectedDate] = useState(initialEndDate);
  const [kind, setKind] = useState("start");
  const [mode, setMode] = useState(initialMode);
  const [selectedTime, setSelectedTime] = useState(
    getDateFromTimeString(minTime)
  );
  const [secondSelectedTime, setSecondSelectedTime] = useState(
    new Date(
      getDateFromTimeString(minTime).setHours(
        getDateFromTimeString(minTime).getHours() + minHours
      )
    )
  );
  const [selectedIntervals, setSelectedIntervals] = useState([]);
  const [pages, setPages] = useState([]);
  const flatlist = useRef();

  const [calendarData, setCalendarData] = useState([]);

  const { screen } = useDimensions();

  const scrollToSelected = () => {
    flatlist.current?.scrollToIndex({
      animated: true,
      index: pages.findIndex(
        (date) =>
          date.getFullYear() === selectedDate.getFullYear() &&
          date.getMonth() === selectedDate.getMonth()
      ),
    });
  };

  const getCalendarData = () => {
    const startDate = new Date(
      new Date(currentDate).setMonth(currentDate.getMonth() - 1 - calendarSize)
    );
    const endDate = new Date(
      new Date(currentDate).setMonth(currentDate.getMonth() - 1 + calendarSize)
    );
    const pages = [];
    let loop = new Date(startDate);
    while (loop <= endDate) {
      pages.push(loop);
      const newDate = loop.setMonth(loop.getMonth() + 1);
      loop = new Date(newDate);
    }
    setPages(pages);
    return pages.map((date) => ({
      year: date.getFullYear(),
      month: date.getMonth(),
      days: range(daysInMonth(date.getMonth(), date.getFullYear()), 1),
    }));
  };

  const getIntersectedBusyIntervals = (date) => {
    return busyRanges.filter(
      (range) =>
        date.getTime() >= new Date(range.start_datetime).setHours(0, 0) &&
        date.getTime() <= new Date(range.end_datetime).setHours(0, 0)
    );
  };

  const getSelectedBusyIntervals = (date) => {
    return busyRanges.filter(
      (range) =>
        new Date(range.start_datetime).setHours(0, 0) === date.getTime() ||
        new Date(range.end_datetime).setHours(0, 0) === date.getTime()
    );
  };

  const getDifferenceInHours = () =>
    (secondSelectedTime.getTime() - selectedTime.getTime()) / (1000 * 60 * 60);

  const isGreaterThanMaxTime = (number) => {
    const maxDateFromTimeString = getDateFromTimeString(maxTime);
    const maxDate = new Date(
      new Date(selectedTime).setDate(
        getDateFromTimeString(minTime).getTime() >
          maxDateFromTimeString.getTime()
          ? selectedTime.getDate() + 1
          : selectedTime.getDate()
      )
    );
    return (
      new Date(selectedTime).setHours(selectedTime.getHours() + number) >
      maxDate.setHours(
        maxDateFromTimeString.getHours(),
        maxDateFromTimeString.getMinutes()
      )
    );
  };

  const isSelectedIntersect = (date) => {
    const start = kind === "start" ? date : selectedDate;
    const end = kind === "end" ? date : secondSelectedDate;

    return busyRanges.find(
      (range) =>
        end &&
        start &&
        new Date(range.start_datetime).setHours(0, 0) <= end.getTime() &&
        new Date(range.end_datetime).setHours(0, 0) > start.getTime()
    );
  };

  const isInSelectedRange = (date) => {
    return (
      selectedDate &&
      secondSelectedDate &&
      date.getTime() > selectedDate.getTime() &&
      date.getTime() < secondSelectedDate.getTime()
    );
  };

  const isOut = (date) => {
    return (
      date.getTime() < new Date(currentDate).setHours(0, 0, 0, 0) ||
      (mode === "date"
        ? (allowedRange &&
            (date.getTime() < allowedRange.start_datetime.setHours(0, 0) ||
              date.getTime() >= allowedRange.end_datetime.setHours(0, 0))) ||
          (secondSelectedDate &&
            kind === "start" &&
            date.getTime() > secondSelectedDate.getTime()) ||
          (selectedDate &&
            kind === "end" &&
            date.getTime() < selectedDate.getTime())
        : false)
    );
  };

  const getType = (date) => {
    if (
      (selectedDate && date.getTime() === selectedDate.getTime()) ||
      (secondSelectedDate && date.getTime() === secondSelectedDate.getTime())
    ) {
      if (isOut(date)) {
        return types.secondInvalidSelected;
      }
      return types.selectedUnavailable;
    }

    const intervals = getIntersectedBusyIntervals(date);
    if (intervals.length > 0) {
      if (intervals.length === 2 && mode === "date") return types.overlay;
      if (
        new Date(intervals[0].end_datetime).setHours(0, 0) === date.getTime()
      ) {
        if (isOut(date)) return types.endOut;
        return mode === "date" && kind === "end"
          ? types.endUnavailable
          : types.end;
      }
      return mode === "date" ? types.busy : isOut(date) ? types.out : types.end;
    }
    if (isOut(date)) {
      return types.out;
    }

    if (isInSelectedRange(date)) return types.selected;

    if (date.getTime() === new Date(currentDate).setHours(0, 0, 0, 0))
      return types.today;
    return types.neutral;
  };

  const getSelectedStartEnd = () => {
    return [
      new Date(
        new Date(selectedDate).setHours(
          selectedTime.getHours(),
          selectedTime.getMinutes()
        )
      ),
      new Date(
        new Date(secondSelectedDate).setHours(
          secondSelectedTime.getHours(),
          secondSelectedTime.getMinutes()
        )
      ),
    ];
  };

  const validate = () => {
    const notInRange = isGreaterThanMaxTime(getDifferenceInHours());
    const startEnd = getSelectedStartEnd();
    const selectedStart = startEnd[0];
    const selectedEnd = startEnd[1];
    const intersection =
      selectedIntervals.filter((interval) => {
        const intervalStart = getUTCDate(interval.start_datetime);
        const intervalEnd = getUTCDate(interval.end_datetime);
        return (
          selectedStart.getTime() < intervalEnd.getTime() &&
          selectedEnd.getTime() > intervalStart.getTime()
        );
      }).length > 0;
    return !selectedDate || !secondSelectedDate || notInRange || intersection;
  };

  useEffect(() => {
    setCalendarData(getCalendarData());
  }, []);

  return (
    <Modal onShow={scrollToSelected} animationType="slide" visible={visible}>
      <Screen>
        <ScrollView>
          <View
            style={{
              backgroundColor: colors.softGrey,
              borderRadius: 15,
              maxWidth: "80%",
              maxHeight: "60%",
              alignSelf: "center",
            }}
          >
            <AppText
              style={{ alignSelf: "center", marginTop: 10, marginBottom: 5 }}
            >
              {header}
            </AppText>

            <FlatList
              ref={flatlist}
              keyExtractor={(page) => `${page.year}${page.month}`}
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              data={calendarData}
              renderItem={({ item, index }) => (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <AppText
                      style={{ marginTop: 10, marginLeft: 15, fontSize: 16 }}
                      fontWeight="500"
                    >
                      {item.year}
                    </AppText>
                    <AppText
                      style={{
                        fontSize: 16,
                        marginRight: 15,
                        marginTop: 10,
                      }}
                      fontWeight="500"
                    >
                      {monthNames[item.month]}
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      width: screen.width * 0.8,
                      paddingVertical: 10,
                    }}
                  >
                    {item.days.map((i) => {
                      const date = new Date(item.year, item.month, i);
                      const type = getType(date);
                      return (
                        <TouchableOpacity
                          disabled={type.disabled}
                          key={`${item.year}${item.month}${i}`}
                          onPress={() => {
                            if (mode === "date") {
                              if (kind === "start") {
                                setSelectedDate(date);

                                if (isSelectedIntersect(date)) {
                                  setSecondSelectedDate(null);
                                }
                              } else {
                                setSecondSelectedDate(date);

                                if (isSelectedIntersect(date)) {
                                  setSelectedDate(null);
                                }
                              }
                            } else {
                              setSelectedDate(date);
                              setSecondSelectedDate(date);
                              setSelectedIntervals(
                                getSelectedBusyIntervals(date)
                              );
                            }
                          }}
                          style={{
                            width: 45,
                            height: 45,
                            margin: 2,
                            borderRadius: 25,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: type.colors
                              ? "transparent"
                              : type.color,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {type.colors && (
                              <>
                                <View
                                  style={{
                                    width: 22.5,
                                    height: 45,
                                    backgroundColor: type.colors[0],
                                    borderTopLeftRadius: 25,
                                    borderBottomLeftRadius: 25,
                                  }}
                                />
                                <View
                                  style={{
                                    width: 22.5,
                                    height: 45,
                                    backgroundColor: type.colors[1],
                                    borderTopRightRadius: 25,
                                    borderBottomRightRadius: 25,
                                  }}
                                />
                              </>
                            )}
                            <AppText style={{ position: "absolute" }}>
                              {i}
                            </AppText>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            />
            {mode === "date" && (
              <View style={{ flexDirection: "row", top: 10, left: -5 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      kind === "end" ? "lightgrey" : colors.lessSoftGrey,
                    marginRight: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => setKind("start")}
                >
                  <AppText
                    style={{
                      color:
                        kind === "start"
                          ? colors.blue
                          : selectedDate
                          ? "black"
                          : "red",
                    }}
                  >
                    Начало
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      kind === "start" ? "lightgrey" : colors.lessSoftGrey,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  }}
                  onPress={() => setKind("end")}
                >
                  <AppText
                    style={{
                      color:
                        kind === "end"
                          ? colors.blue
                          : secondSelectedDate
                          ? "black"
                          : "red",
                    }}
                  >
                    Конец
                  </AppText>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={scrollToSelected}>
              <Foundation
                name="target"
                size={42}
                color={colors.cyan}
                style={{
                  alignSelf: "flex-end",
                  position: "absolute",
                  // right: -10,
                  top: -30,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 20 }}>
            {mode === "datetime" && selectedIntervals.length > 0 && (
              <>
                <View style={{ flexDirection: "row" }}>
                  <AppText
                    style={{ marginTop: 20, fontSize: 16 }}
                    fontWeight="500"
                  >
                    Занятые интервалы
                  </AppText>
                  <View style={{ marginLeft: 20, marginTop: 20 }}>
                    {selectedIntervals.map((interval) => {
                      const intervalStart = getUTCDate(interval.start_datetime);
                      const intervalEnd = getUTCDate(interval.end_datetime);

                      const startEnd = getSelectedStartEnd();
                      const selectedStart = startEnd[0];
                      const selectedEnd = startEnd[1];

                      const intersection =
                        selectedStart.getTime() < intervalEnd.getTime() &&
                        selectedEnd.getTime() > intervalStart.getTime();
                      return (
                        <AppText
                          style={{
                            fontSize: 18,
                            marginBottom: 5,
                            color: intersection ? colors.primary : "black",
                          }}
                          key={interval.start_datetime.getTime()}
                        >{`${getUTCTimeTextFromDate(
                          interval.start_datetime
                        )}-${getUTCTimeTextFromDate(
                          interval.end_datetime
                        )}`}</AppText>
                      );
                    })}
                  </View>
                </View>
              </>
            )}
            {mode === "datetime" && (
              <>
                <View style={{ alignSelf: "center", marginTop: 10 }}>
                  <AppText
                    style={{
                      fontSize: 20,
                      marginBottom: 5,
                      alignSelf: "center",
                    }}
                    fontWeight="500"
                  >
                    Начало
                  </AppText>
                  <DateTimePickerEvent
                    themeVariant="light"
                    onChange={(event, selectedDate) => {
                      const selected = new Date(selectedDate.setSeconds(0, 0));
                      setSelectedTime(selected);
                      setSecondSelectedTime(
                        new Date(
                          new Date(selected).setHours(
                            selected.getHours() + getDifferenceInHours()
                          )
                        )
                      );
                    }}
                    value={selectedTime}
                    mode="time"
                    display="spinner"
                    minimumDate={getDateFromTimeString(minTime)}
                    maximumDate={
                      getDateFromTimeString(minTime).getTime() >
                      getDateFromTimeString(maxTime).getTime()
                        ? null
                        : getDateFromTimeString(maxTime).setHours(
                            getDateFromTimeString(maxTime).getHours() - minHours
                          )
                    }
                    style={{ width: 120, marginBottom: 15 }}
                    minuteInterval={5}
                  />
                </View>
                <AppText style={{ alignSelf: "center" }}>
                  Забронировать на
                </AppText>
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {range(maxHours - minHours + 1, minHours).map((number) => {
                    const isSelected = number === getDifferenceInHours();
                    const isDisabled = isGreaterThanMaxTime(number);

                    return (
                      (!isDisabled || isSelected) && (
                        <TouchableOpacity
                          key={number}
                          onPress={() => {
                            setSecondSelectedTime(
                              new Date(
                                new Date(selectedTime).setHours(
                                  selectedTime.getHours() + number
                                )
                              )
                            );
                          }}
                          style={{
                            padding: 5,
                            backgroundColor: isDisabled
                              ? colors.lessSoftGrey
                              : isSelected
                              ? colors.lessSoftGrey
                              : colors.white,
                            borderWidth: 2,
                            borderColor: isDisabled
                              ? colors.primary
                              : isSelected
                              ? colors.blue
                              : colors.mediumGrey,
                            borderRadius: 5,
                            alignItems: "center",
                            margin: 5,
                          }}
                        >
                          {isDisabled && (
                            <MaterialCommunityIcons
                              name="close-box-outline"
                              size={24}
                              color={colors.primary}
                            />
                          )}
                          <AppText style={{ fontSize: 16 }}>{number}</AppText>
                          <AppText>
                            {number < 5 && number > 1
                              ? "Часа"
                              : number === 1
                              ? "Час"
                              : "Часов"}
                          </AppText>
                        </TouchableOpacity>
                      )
                    );
                  })}
                </View>
              </>
            )}
            <AppButton
              style={{ marginTop: 30 }}
              disabled={validate()}
              onPress={() => {
                const startEnd = getSelectedStartEnd();
                onConfirm(startEnd[0], startEnd[1]);
              }}
            >
              OK
            </AppButton>
            <AppButton
              style={{ marginTop: 10 }}
              onPress={() => {
                if (mode === "date") setMode("datetime");
                else setMode("date");
              }}
            >
              Сменить интерфейс
            </AppButton>
            <AppButton
              onPress={onRequestClose}
              style={{
                backgroundColor: colors.lessSoftGrey,
                marginTop: 10,
                marginBottom: 150,
              }}
            >
              Отмена
            </AppButton>
          </View>
        </ScrollView>
      </Screen>
    </Modal>
  );
}
