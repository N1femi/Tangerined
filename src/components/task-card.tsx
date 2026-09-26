import { StyleSheet, Text, View } from 'react-native'

import { Colors, Spacing } from '@/constants/theme'

type TaskCardProps = {
  title: string
  due: string
}

export default function TaskCard(props: TaskCardProps) {
  const colors = Colors.light

  return (
    <View style={[styles.card, { backgroundColor: colors.cream }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {props.title}
      </Text>

      <Text style={[styles.due, { color: colors.textSecondary }]}>
        {props.due}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: 18,
    marginBottom: Spacing.two,
  },

  title: {
    fontSize: 17,
    fontWeight: '600',
  },

  due: {
    fontSize: 14,
    marginTop: Spacing.one,
  },
})