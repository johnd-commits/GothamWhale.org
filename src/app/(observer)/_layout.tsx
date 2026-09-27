import { Stack } from 'expo-router';

export default function ObserverLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#E7F6F8' },
        headerTintColor: '#082F3A',
        contentStyle: { backgroundColor: '#F4FBFC' },
      }}
    />
  );
}
