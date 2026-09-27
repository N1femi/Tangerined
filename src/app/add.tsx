import { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import LiveSpeech from '@/components/live-speech'
import DraftTaskCard from '@/components/draft-task-card'
import { Colors, Spacing } from '@/constants/theme'
import {
  TaskDraft,
  understandTaskText,
} from '@/lib/api'


export default function AddScreen() {
  const colors = Colors.light

  const [listening, setListening] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [draftTask, setDraftTask] = useState<TaskDraft | null>(null)
  const [understanding, setUnderstanding] = useState(false)

  const requestNumber = useRef(0)


  useEffect(function() {
    const text = liveTranscript.trim()

    if (text === '') {
      setDraftTask(null)
      setUnderstanding(false)
      return
    }

    requestNumber.current = requestNumber.current + 1

    const thisRequest = requestNumber.current

    setUnderstanding(true)

    const timer = setTimeout(async function() {
      try {
        const task = await understandTaskText(text)

        if (thisRequest === requestNumber.current) {
          setDraftTask(task)
        }
      } catch (error) {
        console.log('Understanding error:', error)
      } finally {
        if (thisRequest === requestNumber.current) {
          setUnderstanding(false)
        }
      }
    }, 700)

    return function() {
      clearTimeout(timer)
    }
  }, [liveTranscript])


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={[styles.title, { color: colors.text }]}>
          Tangerine a thought
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Speak naturally. Change anything while you talk.
        </Text>

        <LiveSpeech
          listening={listening}
          transcript={liveTranscript}
          onListeningChange={setListening}
          onTranscriptChange={setLiveTranscript}
        />

        <DraftTaskCard
          visible={liveTranscript !== ''}
          understanding={understanding}
          task={draftTask}
        />
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