import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors, Spacing } from '@/constants/theme'

export default function SlicesScreen() {
  const colors = Colors.light

  function openSchool() {
    router.push("./school")
  }

  function openProjects() {
    router.push("./projects")
  }

  function openPersonal() {
    router.push("./personal")
  }

  function goBack() {
    router.back()
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={[styles.title, { color: colors.text }]}>
          Slices
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Everything in your life, sliced up into bite size pieces.
        </Text>

        <View style={styles.slicesContainer}>
          <Pressable
            style={[styles.sliceCard, { backgroundColor: colors.cream }]}
            onPress={openSchool}
          >
            <Text style={styles.emoji}>🎓</Text>

            <Text style={[styles.sliceTitle, { color: colors.text }]}>
              School
            </Text>

            <Text style={[styles.sliceInfo, { color: colors.textSecondary }]}>
              4 things remaining
            </Text>
          </Pressable>

          <Pressable
            style={[styles.sliceCard, { backgroundColor: colors.cream }]}
            onPress={openProjects}
          >
            <Text style={styles.emoji}>💻</Text>

            <Text style={[styles.sliceTitle, { color: colors.text }]}>
              Projects
            </Text>

            <Text style={[styles.sliceInfo, { color: colors.textSecondary }]}>
              3 things remaining
            </Text>
          </Pressable>

          <Pressable
            style={[styles.sliceCard, { backgroundColor: colors.cream }]}
            onPress={openPersonal}
          >
            <Text style={styles.emoji}>🏠</Text>

            <Text style={[styles.sliceTitle, { color: colors.text }]}>
              Personal
            </Text>

            <Text style={[styles.sliceInfo, { color: colors.textSecondary }]}>
              2 things remaining
            </Text>
          </Pressable>
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

  title: {
    fontSize: 34,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    marginTop: Spacing.two,
  },

  slicesContainer: {
    marginTop: Spacing.five,
  },

  sliceCard: {
    padding: Spacing.four,
    borderRadius: 24,
    marginBottom: Spacing.three,
  },

  emoji: {
    fontSize: 28,
    marginBottom: Spacing.two,
  },

  sliceTitle: {
    fontSize: 21,
    fontWeight: '600',
  },

  sliceInfo: {
    fontSize: 14,
    marginTop: Spacing.one,
  }
})