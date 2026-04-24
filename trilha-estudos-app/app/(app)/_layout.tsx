import { Stack } from 'expo-router';
import { THEME } from '../../src/theme/colors';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: THEME.background },
        headerTintColor: THEME.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: THEME.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Início', headerShown: false }} />
      <Stack.Screen name="trilhas/[id]" options={{ title: 'Detalhes da Trilha' }} />
    </Stack>
  );
}
