import { Stack } from 'expo-router';

import { InfoScreen } from '@/components/info-screen';

export default function TeacherScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Teacher desk' }} />
      <InfoScreen message="Classes and lessons will be here." />
    </>
  );
}
