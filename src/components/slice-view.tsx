import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import TaskCard from '@/components/task-card'
import { Colors, Spacing } from '@/constants/theme'

type SliceViewProps = {
  name: string
  emoji: string
  description: string
  tasks: any[]
  onBack: () => void
}

export default function SliceView(props: SliceViewProps) {
  const colors = Colors.light

  function getTaskDue(task: any) {
    if (task.time !== null) {
      return task.date + ' • ' + task.time
    }

    return task.date
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={props.onBack}>
          <Text style={[styles.back, { color: colors.orange }]}>
                { "< " }Back
          </Text>
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>
          {props.emoji} {props.name}
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {props.description}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.orange }]}>
          TASKS
        </Text>

        {props.tasks.map(function(task) {
          return (
            <TaskCard
              key={task.id}
              title={task.title}
              due={getTaskDue(task)}
            />
          )
        })}
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

  back: {
    fontSize: 16,
    marginBottom: Spacing.three,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    marginTop: Spacing.two,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: Spacing.five,
    marginBottom: Spacing.two,
  },
})