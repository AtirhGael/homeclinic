import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: AppColors.primary.main,
          tabBarInactiveTintColor: AppColors.text.tertiary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: AppColors.background.primary,
            borderTopWidth: 1,
            borderTopColor: AppColors.border.light,
            paddingBottom: Platform.OS === 'ios' ? 25 : 0,
            paddingTop: 10,
            height: 90,
            shadowColor: AppColors.neutral.gray800,
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: 4,
            marginBottom: 0,
          },
          tabBarIconStyle: {
            marginTop: 6,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
            borderRadius: 12,
            marginHorizontal: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 26 : 23} 
                name="house.fill" 
                color={focused ? AppColors.primary.main : AppColors.text.tertiary} 
              />
            ),
            tabBarActiveTintColor: AppColors.primary.main,
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: 'Groups',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 26 : 23} 
                name="person.3.fill" 
                color={focused ? AppColors.secondary.main : AppColors.text.tertiary} 
              />
            ),
            tabBarActiveTintColor: AppColors.secondary.main,
          }}
        />
        <Tabs.Screen
          name="consult"
          options={{
            title: 'Consult',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 26 : 23} 
                name="stethoscope" 
                color={focused ? AppColors.primary.main : AppColors.text.tertiary} 
              />
            ),
            tabBarActiveTintColor: AppColors.primary.main,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 26 : 23} 
                name="gear" 
                color={focused ? AppColors.text.secondary : AppColors.text.tertiary} 
              />
            ),
            tabBarActiveTintColor: AppColors.text.secondary,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
