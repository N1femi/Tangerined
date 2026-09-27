import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition'

import { Colors, Spacing } from '@/constants/theme'
import Animated, { FadeIn } from 'react-native-reanimated'


type LiveSpeechProps = {
  listening: boolean
  transcript: string
  onListeningChange(listening: boolean): void
  onTranscriptChange(transcript: string): void
}


export default function LiveSpeech(props: LiveSpeechProps) {
  const colors = Colors.light

  useSpeechRecognitionEvent('start', function() {
    props.onListeningChange(true)
  })

  useSpeechRecognitionEvent('end', function() {
    props.onListeningChange(false)
  })

  useSpeechRecognitionEvent('result', function(event) {
    const result = event.results[0]

    if (result) {
      props.onTranscriptChange(result.transcript)
    }
  })

  useSpeechRecognitionEvent('error', function(event) {
    console.log('Speech error:', event.error, event.message)

    props.onListeningChange(false)
  })


  async function startListening() {
    const permission =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync()

    if (!permission.granted) {
      return
    }

    props.onTranscriptChange('')

    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: true,
      maxAlternatives: 1,
      iosTaskHint: 'dictation',
    })
  }


  function stopListening() {
    ExpoSpeechRecognitionModule.stop()
  }


  return (
    <View style={styles.container}>
      <Pressable
        onPress={
          props.listening
            ? stopListening
            : startListening
        }
        style={[
          styles.button,
          {
            backgroundColor: props.listening
              ? colors.text
              : colors.orange,
          },
        ]}
      >
        <Text style={styles.buttonText}>
          {props.listening
            ? '■  Stop'
            : '●  Start talking'}
        </Text>
      </Pressable>

      {props.listening && (
        <Animated.Text
            entering={FadeIn.duration(250)}
            style={[styles.status, { color: colors.orange }]}
        >
            Listening live...
        </Animated.Text>
      )}

      {props.transcript !== '' && (
        <Text style={[styles.transcript, { color: colors.text }]}>
          {props.transcript}
        </Text>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.five,
  },

  button: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },

  status: {
    marginTop: Spacing.three,
    fontSize: 15,
    textAlign: 'center',
  },

  transcript: {
    marginTop: Spacing.three,
    fontSize: 20,
    lineHeight: 28,
  },
})