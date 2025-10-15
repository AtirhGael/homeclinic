import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { accessibilityState } = props;
  const focused = accessibilityState?.selected;

  return (
    <View style={[styles.tabContainer, focused && styles.tabContainerFocused]}>
      <Animated.View
        style={[
          styles.contentContainer,
          { 
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <PlatformPressable
          {...props}
          style={[props.style, styles.pressable]}
          onPressIn={(ev) => {
            if (process.env.EXPO_OS === 'ios') {
              // Add a light haptic feedback when pressing down on the tabs.
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            
            // Scale animation on press
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              useNativeDriver: true,
              tension: 200,
              friction: 8,
            }).start();
            
            props.onPressIn?.(ev);
          }}
          onPressOut={(ev) => {
            // Scale back
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 200,
              friction: 8,
            }).start();
            
            props.onPressOut?.(ev);
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    borderRadius: 16,
    marginHorizontal: 6,
    marginVertical: 6,
  },
  tabContainerFocused: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  contentContainer: {
    flex: 1,
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 4,
  },
});
