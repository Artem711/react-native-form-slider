// PLUGINS IMPORTS //
import React, { useEffect } from "react"
import { View, StyleSheet, Dimensions, ViewStyle } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated"

// COMPONENTS IMPORTS //
import { lerp } from "../Shared/utils"
import { useNavigation } from "@react-navigation/native"

// EXTRA IMPORTS //

/////////////////////////////////////////////////////////////////////////////

export interface PointType {
  date: number
  value: number
  color: string
}

export interface BarStyleType {
  topStyle: ViewStyle
  bodyStyle: ViewStyle
}

export interface AnimationConfigType {
  type: "Spring" | "Timing"
  duration: number
}

interface PropsType {
  point: PointType

  index: number
  maxY: number
  step: number
  i: number

  style?: BarStyleType
  animationConfig?: AnimationConfigType
}

const { width: sWidth } = Dimensions.get("window")
const aspectRatio = 165 / 305
const width = sWidth - 25 * 2
const height = width * aspectRatio
const BORDER_RADIUS = 20

const BarItem: React.FC<PropsType> = (props) => {
  const navigation = useNavigation()
  const value = useSharedValue(0)
  const { animationConfig } = props

  useEffect(() => {
    const unsubscribe = () => {
      navigation.addListener("focus", () => {
        const toValue = lerp(0, height, props.point.value / props.maxY)
        value.value =
          animationConfig?.type === "Timing"
            ? withTiming(toValue, {
                duration: animationConfig.duration || 800,
              })
            : animationConfig?.type === "Spring"
            ? withSpring(toValue, { stiffness: 70 })
            : withSpring(toValue, { stiffness: 70 })
      })

      navigation.addListener("blur", () => {
        value.value = 0
      })
    }
    return unsubscribe()
  }, [navigation])
  const animatedStyle = useAnimatedStyle(() => ({ height: value.value }))

  return (
    <Animated.View
      key={props.point.date}
      style={[
        styles.wrapper,
        animatedStyle,
        {
          width: props.step,
          left: props.i * props.step,
        },
      ]}
    >
      <View
        style={[
          styles.bar_top,
          props.style?.topStyle,
          { backgroundColor: props.point.color, borderRadius: BORDER_RADIUS },
        ]}
      />
      <View
        style={[
          styles.bar,
          props.style?.bodyStyle,
          {
            backgroundColor: props.point.color,
            borderTopRightRadius: BORDER_RADIUS,
            borderTopLeftRadius: BORDER_RADIUS,
          },
        ]}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
  },

  bar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 20,
    right: 10,
    opacity: 0.1,
  },

  bar_top: {
    position: "absolute",
    top: 0,
    height: 32,
    left: 20,
    right: 10,
  },
})

export default React.memo(BarItem)
