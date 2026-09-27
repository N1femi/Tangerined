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
  understandTasksText,
} from '@/lib/api'


export default function AddScreen() {
  const colors = Colors.light

  const [listening, setListening] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [draftTasks, setDraftTasks] = useState<TaskDraft[]>([])
  const [understanding, setUnderstanding] = useState(false)

  const latestTranscript = useRef('')
  const lastSentTranscript = useRef('')
  const requestInProgress = useRef(false)
  const listeningRef = useRef(false)


  useEffect(function() {
    latestTranscript.current = liveTranscript

    if (liveTranscript.trim() === '') {
      setDraftTasks([])
      lastSentTranscript.current = ''
    }
  }, [liveTranscript])


  useEffect(function() {
    listeningRef.current = listening
  }, [listening])


  async function updateDraftFromSpeech() {
    const text = latestTranscript.current.trim()

    if (text === '') {
      return
    }

    if (text === lastSentTranscript.current) {
      return
    }

    if (requestInProgress.current) {
      return
    }

    lastSentTranscript.current = text
    requestInProgress.current = true

    setUnderstanding(true)

    try {
      const tasks = await understandTasksText(text)

      setDraftTasks(tasks)
    } catch (error) {
      console.log('Understanding error:', error)
    } finally {
      requestInProgress.current = false
      setUnderstanding(false)

      const newestText = latestTranscript.current.trim()

      if (
        listeningRef.current === false &&
        newestText !== lastSentTranscript.current
      ) {
        updateDraftFromSpeech()
      }
    }
  }


  useEffect(function() {
    if (!listening) {
      updateDraftFromSpeech()
      return
    }

    const firstUpdate = setTimeout(function() {
      updateDraftFromSpeech()
    }, 1200)

    const updateInterval = setInterval(function() {
      updateDraftFromSpeech()
    }, 2200)

    return function() {
      clearTimeout(firstUpdate)
      clearInterval(updateInterval)
    }
  }, [listening])


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

        {liveTranscript !== '' && draftTasks.length === 0 && (
          <DraftTaskCard
            visible={true}
            understanding={understanding}
            task={null}
          />
        )}

        {draftTasks.map(function(task, index) {
          return (
            <DraftTaskCard
              key={'draft-' + index}
              visible={true}
              understanding={understanding}
              task={task}
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

  title: {
    fontSize: 34,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    marginTop: Spacing.two,
  },
})