import { StyleSheet, Text, View } from 'react-native'

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


  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElement,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>

      {props.understanding && (
        <Text style={[styles.status, { color: colors.orange }]}>
          Understanding...
        </Text>
      )}

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Slice
        </Text>

        <Text style={[styles.value, { color: colors.text }]}>
          {slice}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Date
        </Text>

        <Text style={[styles.value, { color: colors.text }]}>
          {date}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Time
        </Text>

        <Text style={[styles.value, { color: colors.text }]}>
          {time}
        </Text>
      </View>
    </View>
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