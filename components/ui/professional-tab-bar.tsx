import { IconSymbol } from '@/components/ui/icon-symbol';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabConfig {
  name: string;
  title: string;
  icon: string;
  color: string;
}

const tabConfigs: Record<string, TabConfig> = {
  index: {
    name: 'index',
    title: 'Home',
    icon: 'house.fill',
    color: '#3b82f6',
  },
  groups: {
    name: 'groups',
    title: 'Groups',
    icon: 'person.3.fill',
    color: '#10b981',
  },
  consult: {
    name: 'consult',
    title: 'Consult',
    icon: 'stethoscope',
    color: '#8b5cf6',
  },
  settings: {
    name: 'settings',
    title: 'Settings',
    icon: 'gear',
    color: '#6b7280',
  },
};

export function ProfessionalTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : route.name;

          const isFocused = state.index === index;
          const config = tabConfigs[route.name];

          const onPress = () => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }

            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if (!config) return null;

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemFocused,
              ]}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                isFocused && [styles.iconContainerFocused, { backgroundColor: `${config.color}15` }]
              ]}>
                <IconSymbol
                  name={config.icon as any}
                  size={isFocused ? 24 : 22}
                  color={isFocused ? config.color : '#9ca3af'}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                isFocused && [styles.tabLabelFocused, { color: config.color }]
              ]}>
                {config.title}
              </Text>
              {isFocused && (
                <View style={[styles.indicator, { backgroundColor: config.color }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    position: 'relative',
  },
  tabItemFocused: {
    // No background here, handled by iconContainer
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainerFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 2,
  },
  tabLabelFocused: {
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
});