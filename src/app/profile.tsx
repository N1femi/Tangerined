import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors, Spacing } from '@/constants/theme'

export default function ProfileScreen() {
  const colors = Colors.light

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={[styles.title, { color: colors.text }]}>
          Profile
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your settings and preferences.
        </Text>
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

  title: {
    fontSize: 34,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    marginTop: Spacing.two,
  },
})