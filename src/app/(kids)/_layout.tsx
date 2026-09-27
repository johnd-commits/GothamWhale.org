import { Tabs } from 'expo-router';

import { kidTabs } from '@/lib/routes';

export default function KidsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#082F3A',
        tabBarInactiveTintColor: '#3D5C66',
        tabBarStyle: {
          backgroundColor: '#E7F6F8',
          minHeight: 64,
        },
        tabBarItemStyle: { minHeight: 48 },
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      {kidTabs.map((tab) => (
        <Tabs.Screen
          key={tab.href}
          name={tab.href === '/' ? 'index' : tab.href.slice(1)}
          options={{ title: tab.title }}
        />
      ))}
    </Tabs>
  );
}
