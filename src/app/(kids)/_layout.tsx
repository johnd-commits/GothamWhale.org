import { Tabs } from 'expo-router';

import { kidTabs } from '@/lib/routes';
import { colors, font, tapTarget } from '@/theme/tokens';

export default function KidsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.deep,
        tabBarInactiveTintColor: colors.sea,
        tabBarStyle: {
          backgroundColor: colors.mist,
          minHeight: tapTarget + 16,
        },
        tabBarItemStyle: { minHeight: tapTarget },
        tabBarLabelStyle: { fontSize: 14, fontFamily: font.semibold },
      }}
    >
      {kidTabs.map((tab) => (
        <Tabs.Screen
          key={tab.href}
          name={tab.href === '/' ? 'index' : tab.href.slice(1)}
          options={{ title: tab.title }}
        />
      ))}
      <Tabs.Screen name="whale/[id]" options={{ href: null, title: 'Whale' }} />
    </Tabs>
  );
}
