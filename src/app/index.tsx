import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors, Spacing } from '@/constants/theme'

export default function HomeScreen() {
  const colors = Colors.light

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
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <Text style={[styles.sliceLabel, { color: colors.orange }]}>
            UPCOMING
          </Text>

          <Text style={[styles.sliceTitle, { color: colors.text }]}>
            Your day at a glance
          </Text>

          <Text style={[styles.sliceText, { color: colors.textSecondary }]}>
            Nothing here yet.
          </Text>
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