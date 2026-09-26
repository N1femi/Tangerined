import { StyleSheet, Text, View } from 'react-native'

import { Colors, Spacing } from '@/constants/theme'

type TaskCardProps = {
  title: string
  due: string
  sliceName?: string
  sliceColor?: string
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

      {props.sliceName && props.sliceColor ? (
        <View style={styles.sliceInfo}>
          <View
            style={[
              styles.sliceCircle,
              { backgroundColor: props.sliceColor },
            ]}
          />

          <Text style={[styles.sliceName, { color: colors.textSecondary }]}>
            {props.sliceName}
          </Text>
        </View>
      ) : null}
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