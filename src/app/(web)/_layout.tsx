import { Redirect, Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function WebLayout() {
  if (Platform.OS !== 'web') {
    return <Redirect href="/" />;
  }

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
