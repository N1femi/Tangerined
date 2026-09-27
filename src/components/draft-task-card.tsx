import { useEffect, useRef } from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Colors, Spacing } from '@/constants/theme'


type DraftTaskCardProps = {
  visible: boolean
}


export default function DraftTaskCard(props: DraftTaskCardProps) {
  const colors = Colors.light

  const cardOpacity = useRef(new Animated.Value(0)).current
  const cardY = useRef(new Animated.Value(10)).current
  const pulseOpacity = useRef(new Animated.Value(0.35)).current


  useEffect(function() {
    if (props.visible) {
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.timing(cardY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [props.visible])


  useEffect(function() {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(pulseOpacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    )

    animation.start()

    return function() {
      animation.stop()
    }
  }, [])


  if (!props.visible) {
    return null
  }


  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElement,
          opacity: cardOpacity,
          transform: [
            {
              translateY: cardY,
            },
          ],
        },
      ]}
    >
      <Animated.Text
        style={[
          styles.title,
          {
            color: colors.text,
            opacity: pulseOpacity,
          },
        ]}
      >
        Understanding task...
      </Animated.Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Date
        </Text>

        <Animated.Text
          style={[
            styles.value,
            {
              color: colors.text,
              opacity: pulseOpacity,
            },
          ]}
        >
          Finding date...
        </Animated.Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Time
        </Text>

        <Animated.Text
          style={[
            styles.value,
            {
              color: colors.text,
              opacity: pulseOpacity,
            },
          ]}
        >
          Finding time...
        </Animated.Text>
      </View>
    </Animated.View>
  )
}


const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.three,
    borderRadius: 20,
    padding: Spacing.three,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.three,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },

  label: {
    fontSize: 15,
  },

  value: {
    fontSize: 15,
    fontWeight: '500',
  },
})