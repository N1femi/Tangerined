import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import SliceCard from '@/components/slice-card'
import SliceView from '@/components/slice-view'
import { Colors, Spacing } from '@/constants/theme'
import { slices } from '@/data/slices'

export default function SlicesScreen() {
  const colors = Colors.light

  const [selectedSliceId, setSelectedSliceId] = useState('')

  function openSlice(id: string) {
    setSelectedSliceId(id)
  }

  function closeSlice() {
    setSelectedSliceId('')
  }

  let selectedSlice = null

  for (let i = 0; i < slices.length; i++) {
    if (slices[i].id === selectedSliceId) {
      selectedSlice = slices[i]
    }
  }

  if (selectedSlice !== null) {
    return (
      <SliceView
        name={selectedSlice.name}
        emoji={selectedSlice.emoji}
        description={selectedSlice.description}
        tasks={selectedSlice.tasks}
        onBack={closeSlice}
      />
    )
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
          {slices.map(function(slice) {
            return (
              <SliceCard
                key={slice.id}
                id={slice.id}
                name={slice.name}
                emoji={slice.emoji}
                remaining={slice.tasks.length}
                onPress={openSlice}
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
})