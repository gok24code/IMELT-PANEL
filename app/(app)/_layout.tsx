import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // The header will be custom inside the screen
        }}
      />
    </Stack>
  );
}
