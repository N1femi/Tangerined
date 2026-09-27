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
  const lastSuccessfulTranscript = useRef('')
  const requestInProgress = useRef(false)
  const listeningRef = useRef(false)
  const finalRequestWaiting = useRef(false)


  useEffect(function() {
    latestTranscript.current = liveTranscript

    if (liveTranscript.trim() === '') {
      setDraftTasks([])
      lastSuccessfulTranscript.current = ''
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

    if (text === lastSuccessfulTranscript.current) {
      return
    }

    if (requestInProgress.current) {
      if (listeningRef.current === false) {
        finalRequestWaiting.current = true
      }

      return
    }

    requestInProgress.current = true
    setUnderstanding(true)

    try {
      const tasks = await understandTasksText(text)

      console.log('MULTI TASKS:', tasks)

      setDraftTasks(tasks)

      lastSuccessfulTranscript.current = text
    } catch (error) {
      console.log('Understanding error:', error)
    } finally {
      requestInProgress.current = false
      setUnderstanding(false)

      if (finalRequestWaiting.current) {
        finalRequestWaiting.current = false

        const newestText = latestTranscript.current.trim()

        if (newestText !== lastSuccessfulTranscript.current) {
          updateDraftFromSpeech()
        }
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

        {liveTranscript !== '' &&
          draftTasks.length === 0 &&
          (listening || understanding) && (
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