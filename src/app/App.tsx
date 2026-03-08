import { StatusBar } from 'expo-status-bar';

import { NavigationShell } from '../features/navigation/NavigationShell';

export default function App() {
  return (
    <>
      <NavigationShell />
      <StatusBar style="dark" />
    </>
  );
}
