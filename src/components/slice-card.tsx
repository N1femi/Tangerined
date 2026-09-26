import { Pressable, StyleSheet, Text } from 'react-native'

import { Colors, Spacing } from '@/constants/theme'

type SliceCardProps = {
  id: string
  name: string
  emoji: string
  remaining: number
  onPress: Function
}

export default function SliceCard(props: SliceCardProps) {
  const colors = Colors.light

  function handlePress() {
    props.onPress(props.id)
  }

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.cream }]}
      onPress={handlePress}
    >
      <Text style={styles.emoji}>
        {props.emoji}
      </Text>

      <Text style={[styles.title, { color: colors.text }]}>
        {props.name}
      </Text>

      <Text style={[styles.info, { color: colors.textSecondary }]}>
        {props.remaining} things remaining
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: 24,
    marginBottom: Spacing.three,
  },

  emoji: {
    fontSize: 28,
    marginBottom: Spacing.two,
  },

  title: {
    fontSize: 21,
    fontWeight: '600',
  },

  info: {
    fontSize: 14,
    marginTop: Spacing.one,
  },
})