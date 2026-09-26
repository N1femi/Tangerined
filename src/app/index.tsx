import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import TaskCard from '@/components/task-card'
import { Colors, Spacing } from '@/constants/theme'
import { slices } from '@/data/slices'
import { tasks } from '@/data/tasks'

export default function HomeScreen() {
  const colors = Colors.light

  function getTodayDate() {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return year + '-' + month + '-' + day
  }

  function formatDate(dateString: string) {
    const parts = dateString.split('-')

    const year = Number(parts[0])
    const month = Number(parts[1]) - 1
    const day = Number(parts[2])

    const date = new Date(year, month, day)

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  function getSlice(sliceId: string) {
    for (let i = 0; i < slices.length; i++) {
      if (slices[i].id === sliceId) {
        return slices[i]
      }
    }

    return null
  }

  const todayDate = getTodayDate()

  let upcomingTasks = []
  let todayTasks = []

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]

    if (
      task.completed === false &&
      task.time !== null
    ) {
      upcomingTasks.push(task)
    }

    if (
      task.completed === false &&
      task.date === todayDate &&
      task.time === null
    ) {
      todayTasks.push(task)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Good afternoon
          </Text>

          <Text style={[styles.title, { color: colors.text }]}>
            Tangerined
          </Text>
        </View>

        <View
          style={[
            styles.slice,
            styles.upcomingSlice,
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <Text style={[styles.sliceLabel, { color: colors.orange }]}>
            UPCOMING
          </Text>

          <Text style={[styles.sliceTitle, { color: colors.text }]}>
            Your day at a glance
          </Text>

          {upcomingTasks.length === 0 ? (
            <Text style={[styles.sliceText, { color: colors.textSecondary }]}>
              Nothing here yet.
            </Text>
          ) : null}

          {upcomingTasks.map(function(task) {
            const taskSlice = getSlice(task.sliceId)

            return (
              <TaskCard
                key={task.id}
                title={task.title}
                due={formatDate(task.date) + ' • ' + task.time}
                sliceName={taskSlice ? taskSlice.name : undefined}
                sliceColor={taskSlice ? taskSlice.color : undefined}
              />
            )
          })}
        </View>

        <View
          style={[
            styles.slice,
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <Text style={[styles.sliceLabel, { color: colors.orange }]}>
            TODAY&apos;S TASKS
          </Text>

          <Text style={[styles.sliceTitle, { color: colors.text }]}>
            Get them done
          </Text>

          {todayTasks.length === 0 ? (
            <Text style={[styles.sliceText, { color: colors.textSecondary }]}>
              Nothing here yet.
            </Text>
          ) : null}

          {todayTasks.map(function(task) {
            const taskSlice = getSlice(task.sliceId)

            return (
              <TaskCard
                key={task.id}
                title={task.title}
                due="Today"
                sliceName={taskSlice ? taskSlice.name : undefined}
                sliceColor={taskSlice ? taskSlice.color : undefined}
              />
            )
          })}
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },

  header: {
    marginBottom: Spacing.five,
  },

  greeting: {
    fontSize: 16,
    marginBottom: Spacing.one,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
  },

  slice: {
    padding: Spacing.four,
    borderRadius: 28,
  },

  upcomingSlice: {
    marginBottom: Spacing.three,
  },

  sliceLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.two,
  },

  sliceTitle: {
    fontSize: 21,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },

  sliceText: {
    fontSize: 15,
  },
})