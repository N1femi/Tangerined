import { StyleSheet, Text, View } from 'react-native'

import { Colors, Spacing } from '@/constants/theme'
import { slices } from '@/data/slices'
import { Task } from '@/data/tasks'
import { formatDate } from '@/lib/date'

type UpcomingTimelineProps = {
  tasks: Task[]
}

export default function UpcomingTimeline(props: UpcomingTimelineProps) {
  const colors = Colors.light

  function getSlice(sliceId: string) {
    for (let i = 0; i < slices.length; i++) {
      if (slices[i].id === sliceId) {
        return slices[i]
      }
    }

    return null
  }

  return (
    <View style={styles.container}>
      {props.tasks.map(function(task, index) {
        const taskSlice = getSlice(task.sliceId)

        const isNextReminder = index === 0
        const isLastReminder = index === props.tasks.length - 1

        return (
          <View
            key={task.id}
            style={styles.reminder}
          >
            <View style={styles.timeline}>
              {!isLastReminder ? (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: colors.orangeLight },
                  ]}
                />
              ) : null}

              <View
                style={[
                  styles.dot,
                  {
                    borderColor: colors.orange,
                    backgroundColor: isNextReminder
                      ? colors.orange
                      : colors.backgroundElement,
                  },
                ]}
              />
            </View>

            <View style={styles.reminderContent}>
              <Text
                style={[
                  styles.date,
                  { color: colors.orange },
                ]}
              >
                {formatDate(task.date)} • {task.time}
              </Text>

              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                ]}
              >
                {task.title}
              </Text>

              {taskSlice !== null ? (
                <View style={styles.sliceInfo}>
                  <View
                    style={[
                      styles.sliceCircle,
                      { backgroundColor: taskSlice.color },
                    ]}
                  />

                  <Text
                    style={[
                      styles.sliceName,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {taskSlice.name}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.one,
  },

  reminder: {
    flexDirection: 'row',
    minHeight: 86,
  },

  timeline: {
    width: 24,
    alignItems: 'center',
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginTop: 5,
    zIndex: 2,
  },

  line: {
    position: 'absolute',
    width: 2,
    top: 16,
    bottom: -5,
  },

  reminderContent: {
    flex: 1,
    paddingLeft: Spacing.two,
    paddingBottom: Spacing.three,
  },

  date: {
    fontSize: 13,
    fontWeight: '600',
  },

  title: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: Spacing.one,
  },

  sliceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.two,
  },

  sliceCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.two,
  },

  sliceName: {
    fontSize: 13,
  },
})