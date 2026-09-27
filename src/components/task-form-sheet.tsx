import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { Colors, Spacing } from '@/constants/theme'
import { slices } from '@/data/slices'
import { Task } from '@/data/tasks'

type TaskFormSheetProps = {
  visible: boolean
  onClose(): void
  onCreate(task: Task): void
}

function createDefaultDate() {
  const date = new Date()

  date.setDate(date.getDate() + 5)
  date.setHours(0, 0, 0, 0)

  return date
}

function datesAreSame(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

export default function TaskFormSheet(props: TaskFormSheetProps) {
  const colors = Colors.light

  const defaultDate = createDefaultDate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [sliceId, setSliceId] = useState('school')

  const [date, setDate] = useState(defaultDate)

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(
      defaultDate.getFullYear(),
      defaultDate.getMonth(),
      1
    )
  )

  const [hour, setHour] = useState(1)
  const [minute, setMinute] = useState(0)
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM')

  const [hasTime, setHasTime] = useState(true)

  const [popup, setPopup] = useState<'calendar' | 'time' | null>(null)

  const backdropOpacity = useRef(
    new Animated.Value(0)
  ).current

  const sheetTranslateY = useRef(
    new Animated.Value(700)
  ).current

  useEffect(function() {
    if (props.visible === true) {
      backdropOpacity.setValue(0)
      sheetTranslateY.setValue(700)

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 22,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [props.visible])

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: function(event, gestureState) {
        return gestureState.dy > 5
      },

      onPanResponderMove: function(event, gestureState) {
        if (gestureState.dy > 0) {
          sheetTranslateY.setValue(gestureState.dy)
        }
      },

      onPanResponderRelease: function(event, gestureState) {
        if (gestureState.dy > 100) {
          closeSheet()
        } else {
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            damping: 20,
            stiffness: 220,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  function resetForm() {
    const newDate = createDefaultDate()

    setTitle('')
    setDescription('')

    setSliceId('school')

    setDate(newDate)

    setCalendarMonth(
      new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        1
      )
    )

    setHour(1)
    setMinute(0)
    setPeriod('PM')

    setHasTime(true)
    setPopup(null)
  }

  function closeSheet() {
    setPopup(null)

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),

      Animated.timing(sheetTranslateY, {
        toValue: 700,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(function() {
      resetForm()
      props.onClose()
    })
  }

  function formatDateForDisplay(selectedDate: Date) {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  function formatDateForStorage(selectedDate: Date) {
    const year = selectedDate.getFullYear()

    const month = String(
      selectedDate.getMonth() + 1
    ).padStart(2, '0')

    const day = String(
      selectedDate.getDate()
    ).padStart(2, '0')

    return year + '-' + month + '-' + day
  }

  function formatTime() {
    const minuteText = String(minute).padStart(2, '0')

    return hour + ':' + minuteText + ' ' + period
  }

  function createTask() {
    let finalTitle = title.trim()

    if (finalTitle === '') {
      finalTitle = 'Untitled Title'
    }

    let taskTime = null

    if (hasTime === true) {
      taskTime = formatTime()
    }

    const newTask: Task = {
      id: String(Date.now()),
      title: finalTitle,
      description: description.trim(),
      sliceId: sliceId,
      date: formatDateForStorage(date),
      time: taskTime,
      completed: false,
    }

    props.onCreate(newTask)

    closeSheet()
  }

  function previousMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    )
  }

  function nextMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      )
    )
  }

  function getCalendarDays() {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()

    const firstDay = new Date(year, month, 1).getDay()

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate()

    const days: (Date | null)[] = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        new Date(year, month, day)
      )
    }

    return days
  }

  function chooseDate(selectedDate: Date | null) {
    if (selectedDate === null) {
      return
    }

    setDate(selectedDate)
    setPopup(null)
  }

  function increaseHour() {
    if (hour === 12) {
      setHour(1)
    } else {
      setHour(hour + 1)
    }
  }

  function decreaseHour() {
    if (hour === 1) {
      setHour(12)
    } else {
      setHour(hour - 1)
    }
  }

  function increaseMinute() {
    if (minute === 55) {
      setMinute(0)
    } else {
      setMinute(minute + 5)
    }
  }

  function decreaseMinute() {
    if (minute === 0) {
      setMinute(55)
    } else {
      setMinute(minute - 5)
    }
  }

  const calendarDays = getCalendarDays()

  const monthTitle = calendarMonth.toLocaleDateString(
    'en-US',
    {
      month: 'long',
      year: 'numeric',
    }
  )

  return (
    <Modal
      visible={props.visible}
      transparent={true}
      animationType="none"
      onRequestClose={closeSheet}
    >
      <View style={styles.modal}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <Pressable
            style={styles.fill}
            onPress={closeSheet}
          />
        </Animated.View>

        <KeyboardAvoidingView
          style={styles.sheetPosition}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.backgroundElement,

                transform: [
                  {
                    translateY: sheetTranslateY,
                  },
                ],
              },
            ]}
          >
            <View
              style={styles.handleArea}
              {...panResponder.panHandlers}
            >
              <View
                style={[
                  styles.handle,
                  {
                    backgroundColor: colors.textSecondary,
                  },
                ]}
              />
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Untitled Title"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.titleInput,
                  {
                    color: colors.text,
                  },
                ]}
              />

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Add description..."
                placeholderTextColor={colors.textSecondary}
                multiline={true}
                style={[
                  styles.descriptionInput,
                  {
                    color: colors.text,
                  },
                ]}
              />

              <Text
                style={[
                  styles.sectionLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                SLICE
              </Text>

              <View style={styles.sliceOptions}>
                {slices.map(function(slice) {
                  const selected = slice.id === sliceId

                  function selectSlice() {
                    setSliceId(slice.id)
                  }

                  return (
                    <Pressable
                      key={slice.id}
                      onPress={selectSlice}
                      style={[
                        styles.sliceOption,
                        {
                          backgroundColor: selected
                            ? slice.backgroundColor
                            : colors.cream,

                          borderColor: selected
                            ? slice.color
                            : colors.cream,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.sliceCircle,
                          {
                            backgroundColor: slice.color,
                          },
                        ]}
                      />

                      <Text
                        style={[
                          styles.sliceText,
                          {
                            color: colors.text,
                          },
                        ]}
                      >
                        {slice.name}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>

              <Text
                style={[
                  styles.sectionLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                DETAILS
              </Text>

              <Pressable
                onPress={function() {
                  setPopup('calendar')
                }}
                style={[
                  styles.detailRow,
                  {
                    backgroundColor: colors.cream,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Date
                </Text>

                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {formatDateForDisplay(date)}
                </Text>
              </Pressable>

              <Pressable
                onPress={function() {
                  if (hasTime === false) {
                    setHasTime(true)
                  }

                  setPopup('time')
                }}
                style={[
                  styles.detailRow,
                  {
                    backgroundColor: colors.cream,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Time
                </Text>

                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {hasTime === true
                    ? formatTime()
                    : 'No time'}
                </Text>
              </Pressable>

              <Pressable
                onPress={function() {
                  setHasTime(!hasTime)
                }}
                style={styles.noTimeButton}
              >
                <Text
                  style={[
                    styles.noTimeText,
                    {
                      color: colors.orange,
                    },
                  ]}
                >
                  {hasTime === true
                    ? 'Remove reminder time'
                    : 'Add reminder time'}
                </Text>
              </Pressable>

              <View style={styles.buttons}>
                <Pressable
                  onPress={closeSheet}
                  style={styles.cancelButton}
                >
                  <Text
                    style={[
                      styles.cancelText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={createTask}
                  style={[
                    styles.addButton,
                    {
                      backgroundColor: colors.orange,
                    },
                  ]}
                >
                  <Text style={styles.addText}>
                    Add
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>

        {popup === 'calendar' ? (
          <View style={styles.popupLayer}>
            <Pressable
              style={styles.popupBackdrop}
              onPress={function() {
                setPopup(null)
              }}
            />

            <View
              style={[
                styles.popupCard,
                {
                  backgroundColor: colors.backgroundElement,
                },
              ]}
            >
              <View style={styles.calendarHeader}>
                <Pressable
                  onPress={previousMonth}
                  style={styles.arrowButton}
                >
                  <Text
                    style={[
                      styles.arrow,
                      {
                        color: colors.orange,
                      },
                    ]}
                  >
                    ‹
                  </Text>
                </Pressable>

                <Text
                  style={[
                    styles.monthTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {monthTitle}
                </Text>

                <Pressable
                  onPress={nextMonth}
                  style={styles.arrowButton}
                >
                  <Text
                    style={[
                      styles.arrow,
                      {
                        color: colors.orange,
                      },
                    ]}
                  >
                    ›
                  </Text>
                </Pressable>
              </View>

              <View style={styles.weekRow}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
                  function(dayName, index) {
                    return (
                      <Text
                        key={index}
                        style={[
                          styles.weekDay,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        {dayName}
                      </Text>
                    )
                  }
                )}
              </View>

              <View style={styles.calendarDays}>
                {calendarDays.map(function(calendarDate, index) {
                  if (calendarDate === null) {
                    return (
                      <View
                        key={'empty-' + index}
                        style={styles.dayCell}
                      />
                    )
                  }

                  const selected = datesAreSame(
                    calendarDate,
                    date
                  )

                  function selectDate() {
                    chooseDate(calendarDate)
                  }

                  return (
                    <View
                      key={calendarDate.toISOString()}
                      style={styles.dayCell}
                    >
                      <Pressable
                        onPress={selectDate}
                        style={[
                          styles.dayButton,

                          selected
                            ? {
                                backgroundColor: colors.orange,
                              }
                            : null,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            {
                              color: selected
                                ? 'white'
                                : colors.text,
                            },
                          ]}
                        >
                          {calendarDate.getDate()}
                        </Text>
                      </Pressable>
                    </View>
                  )
                })}
              </View>

              <Pressable
                onPress={function() {
                  setPopup(null)
                }}
                style={[
                  styles.popupDoneButton,
                  {
                    backgroundColor: colors.orange,
                  },
                ]}
              >
                <Text style={styles.popupDoneText}>
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {popup === 'time' ? (
          <View style={styles.popupLayer}>
            <Pressable
              style={styles.popupBackdrop}
              onPress={function() {
                setPopup(null)
              }}
            />

            <View
              style={[
                styles.popupCard,
                {
                  backgroundColor: colors.backgroundElement,
                },
              ]}
            >
              <Text
                style={[
                  styles.timeTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Choose time
              </Text>

              <View style={styles.timeControls}>
                <View style={styles.numberPicker}>
                  <Pressable
                    onPress={increaseHour}
                    style={styles.numberButton}
                  >
                    <Text
                      style={[
                        styles.numberButtonText,
                        {
                          color: colors.orange,
                        },
                      ]}
                    >
                      +
                    </Text>
                  </Pressable>

                  <Text
                    style={[
                      styles.numberValue,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {hour}
                  </Text>

                  <Pressable
                    onPress={decreaseHour}
                    style={styles.numberButton}
                  >
                    <Text
                      style={[
                        styles.numberButtonText,
                        {
                          color: colors.orange,
                        },
                      ]}
                    >
                      −
                    </Text>
                  </Pressable>
                </View>

                <Text
                  style={[
                    styles.colon,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  :
                </Text>

                <View style={styles.numberPicker}>
                  <Pressable
                    onPress={increaseMinute}
                    style={styles.numberButton}
                  >
                    <Text
                      style={[
                        styles.numberButtonText,
                        {
                          color: colors.orange,
                        },
                      ]}
                    >
                      +
                    </Text>
                  </Pressable>

                  <Text
                    style={[
                      styles.numberValue,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {String(minute).padStart(2, '0')}
                  </Text>

                  <Pressable
                    onPress={decreaseMinute}
                    style={styles.numberButton}
                  >
                    <Text
                      style={[
                        styles.numberButtonText,
                        {
                          color: colors.orange,
                        },
                      ]}
                    >
                      −
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.periodPicker}>
                  <Pressable
                    onPress={function() {
                      setPeriod('AM')
                    }}
                    style={[
                      styles.periodButton,
                      {
                        backgroundColor:
                          period === 'AM'
                            ? colors.orange
                            : colors.cream,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.periodText,
                        {
                          color:
                            period === 'AM'
                              ? 'white'
                              : colors.text,
                        },
                      ]}
                    >
                      AM
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={function() {
                      setPeriod('PM')
                    }}
                    style={[
                      styles.periodButton,
                      {
                        backgroundColor:
                          period === 'PM'
                            ? colors.orange
                            : colors.cream,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.periodText,
                        {
                          color:
                            period === 'PM'
                              ? 'white'
                              : colors.text,
                        },
                      ]}
                    >
                      PM
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={function() {
                  setPopup(null)
                }}
                style={[
                  styles.popupDoneButton,
                  {
                    backgroundColor: colors.orange,
                  },
                ]}
              >
                <Text style={styles.popupDoneText}>
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },

  fill: {
    flex: 1,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(52, 44, 38, 0.35)',
  },

  sheetPosition: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  sheet: {
    maxHeight: '88%',

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    overflow: 'hidden',
  },

  handleArea: {
    paddingTop: 22,
    paddingBottom: 18,

    alignItems: 'center',
  },

  handle: {
    width: 50,
    height: 5,

    borderRadius: 3,

    opacity: 0.4,
  },

  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },

  titleInput: {
    fontSize: 30,
    fontWeight: '700',

    paddingVertical: 0,
    marginBottom: Spacing.two,
  },

  descriptionInput: {
    minHeight: 70,

    fontSize: 16,
    lineHeight: 22,

    paddingVertical: 0,

    marginBottom: Spacing.four,

    textAlignVertical: 'top',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',

    letterSpacing: 1,

    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },

  sliceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  sliceOption: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,

    borderRadius: 20,
    borderWidth: 1,

    marginRight: Spacing.two,
    marginBottom: Spacing.two,
  },

  sliceCircle: {
    width: 8,
    height: 8,

    borderRadius: 4,

    marginRight: Spacing.two,
  },

  sliceText: {
    fontSize: 14,
    fontWeight: '500',
  },

  detailRow: {
    minHeight: 56,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: Spacing.three,

    borderRadius: 16,

    marginBottom: Spacing.two,
  },

  detailLabel: {
    fontSize: 14,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },

  noTimeButton: {
    alignSelf: 'flex-end',

    marginTop: Spacing.one,
  },

  noTimeText: {
    fontSize: 13,
    fontWeight: '600',
  },

  buttons: {
    flexDirection: 'row',

    marginTop: Spacing.five,
  },

  cancelButton: {
    flex: 1,

    backgroundColor: '#E9DED2',

    paddingVertical: Spacing.three,

    borderRadius: 18,

    alignItems: 'center',

    marginRight: Spacing.two,
  },

  addButton: {
    flex: 1,

    paddingVertical: Spacing.three,

    borderRadius: 18,

    alignItems: 'center',
  },

  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },

  addText: {
    color: 'white',

    fontSize: 16,
    fontWeight: '600',
  },

  popupLayer: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },

  popupBackdrop: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(52, 44, 38, 0.25)',
  },

  popupCard: {
    width: '88%',
    maxWidth: 380,

    borderRadius: 26,

    padding: Spacing.four,
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: Spacing.three,
  },

  arrowButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    fontSize: 32,
  },

  monthTitle: {
    fontSize: 17,
    fontWeight: '600',
  },

  weekRow: {
    flexDirection: 'row',

    marginBottom: Spacing.two,
  },

  weekDay: {
    width: '14.2857%',

    textAlign: 'center',

    fontSize: 12,
    fontWeight: '600',
  },

  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: '14.2857%',
    height: 42,

    alignItems: 'center',
    justifyContent: 'center',
  },

  dayButton: {
    width: 36,
    height: 36,

    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',
  },

  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },

  timeTitle: {
    textAlign: 'center',

    fontSize: 20,
    fontWeight: '700',

    marginBottom: Spacing.four,
  },

  timeControls: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },

  numberPicker: {
    minWidth: 64,

    alignItems: 'center',
  },

  numberButton: {
    width: 44,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',
  },

  numberButtonText: {
    fontSize: 26,
    fontWeight: '500',
  },

  numberValue: {
    fontSize: 30,
    fontWeight: '700',

    marginVertical: Spacing.one,
  },

  colon: {
    fontSize: 30,
    fontWeight: '700',

    marginHorizontal: Spacing.one,
  },

  periodPicker: {
    marginLeft: Spacing.three,
  },

  periodButton: {
    minWidth: 54,

    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,

    borderRadius: 12,

    alignItems: 'center',

    marginVertical: Spacing.one,
  },

  periodText: {
    fontSize: 13,
    fontWeight: '700',
  },

  popupDoneButton: {
    marginTop: Spacing.four,

    paddingVertical: Spacing.three,

    borderRadius: 16,

    alignItems: 'center',
  },

  popupDoneText: {
    color: 'white',

    fontSize: 15,
    fontWeight: '600',
  },
})