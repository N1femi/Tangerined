import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors, Spacing } from '@/constants/theme'
import { useTasks } from '@/context/task-context'
import { createTaskFromText } from '@/lib/api'


export default function AddScreen() {
  const colors = Colors.light

  const { addTask } = useTasks()

  const [thought, setThought] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submitThought() {
    if (thought.trim() === '') {
      return
    }

    if (loading) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const task = await createTaskFromText(thought.trim())

      addTask(task)

      setThought('')
      setMessage('Created: ' + task.title)
    } catch (error) {
      console.log(error)

      setMessage('Could not create task. Check the backend terminal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={[styles.title, { color: colors.text }]}>
          Tangerine a thought
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Tell Tangerined what you need to remember.
        </Text>

        <TextInput
          value={thought}
          onChangeText={setThought}
          placeholder="I need to study calculus Tuesday at 7..."
          placeholderTextColor={colors.textSecondary}
          multiline={true}
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundElement,
              color: colors.text,
            },
          ]}
        />

        <Pressable
          onPress={submitThought}
          style={[
            styles.button,
            { backgroundColor: colors.orange },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              Tangerine it
            </Text>
          )}
        </Pressable>

        {message !== '' && (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>
        )}
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

  input: {
    minHeight: 150,
    marginTop: Spacing.five,
    borderRadius: 20,
    padding: Spacing.three,
    fontSize: 17,
    textAlignVertical: 'top',
  },

  button: {
    height: 52,
    marginTop: Spacing.three,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },

  message: {
    marginTop: Spacing.three,
    fontSize: 15,
  },
})