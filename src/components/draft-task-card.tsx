import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated'

import { Colors, Spacing } from '@/constants/theme'
import { TaskDraft } from '@/lib/api'


type DraftTaskCardProps = {
  visible: boolean
  understanding: boolean
  task: TaskDraft | null
}


export default function DraftTaskCard(props: DraftTaskCardProps) {
  const colors = Colors.light

  if (!props.visible) {
    return null
  }


  let title = 'Understanding task...'
  let slice = 'Finding slice...'
  let date = 'Finding date...'
  let time = 'Finding time...'

  if (props.task !== null) {
    title = props.task.title
    slice = props.task.sliceId
    date = props.task.date

    if (props.task.time !== '') {
      time = props.task.time
    } else {
      time = 'No time'
    }
  }


  let status = 'Listening for context...'

  if (props.understanding) {
    status = 'Understanding...'
  } else if (props.task !== null) {
    status = 'Ready — keep talking to change it'
  }


  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      layout={LinearTransition.duration(250)}
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElement,
        },
      ]}
    >
      <Animated.Text
        key={title}
        entering={FadeIn.duration(300)}
        style={[styles.title, { color: colors.text }]}
      >
        {title}
      </Animated.Text>

      <Animated.Text
        key={status}
        entering={FadeIn.duration(250)}
        style={[styles.status, { color: colors.orange }]}
      >
        {status}
      </Animated.Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Slice
        </Text>

        <Animated.Text
          key={slice}
          entering={FadeIn.duration(300)}
          style={[styles.value, { color: colors.text }]}
        >
          {slice}
        </Animated.Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Date
        </Text>

        <Animated.Text
          key={date}
          entering={FadeIn.duration(300)}
          style={[styles.value, { color: colors.text }]}
        >
          {date}
        </Animated.Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Time
        </Text>

        <Animated.Text
          key={time}
          entering={FadeIn.duration(300)}
          style={[styles.value, { color: colors.text }]}
        >
          {time}
        </Animated.Text>
      </View>
    </Animated.View>
  )
}


const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.three,
    borderRadius: 20,
    padding: Spacing.three,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
  },

  status: {
    fontSize: 13,
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },

  label: {
    fontSize: 15,
  },

  value: {
    fontSize: 15,
    fontWeight: '500',
  },
})