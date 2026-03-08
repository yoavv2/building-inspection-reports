import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { HebrewButton } from '../../components/HebrewButton';
import { HebrewText } from '../../components/HebrewText';
import { DashboardScreen } from '../dashboard/DashboardScreen';
import { ProjectEditorScreen } from '../projects/ProjectEditorScreen';
import { ProjectsListScreen } from '../projects/ProjectsListScreen';

type ScreenKey = 'projects' | 'editor' | 'dashboard';

export const NavigationShell = () => {
  const [screen, setScreen] = useState<ScreenKey>('projects');

  const currentScreen = useMemo(() => {
    switch (screen) {
      case 'projects':
        return <ProjectsListScreen onOpenEditor={() => setScreen('editor')} />;
      case 'editor':
        return <ProjectEditorScreen onSave={() => setScreen('dashboard')} />;
      case 'dashboard':
      default:
        return <DashboardScreen />;
    }
  }, [screen]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HebrewText variant="title">מערכת דוחות בדק</HebrewText>

        <View style={styles.tabBar}>
          <HebrewButton
            label="פרויקטים"
            onPress={() => setScreen('projects')}
            style={screen === 'projects' ? styles.activeTab : styles.inactiveTab}
          />
          <HebrewButton
            label="עורך"
            onPress={() => setScreen('editor')}
            style={screen === 'editor' ? styles.activeTab : styles.inactiveTab}
          />
          <HebrewButton
            label="דשבורד"
            onPress={() => setScreen('dashboard')}
            style={screen === 'dashboard' ? styles.activeTab : styles.inactiveTab}
          />
        </View>

        <View style={styles.screenContainer}>{currentScreen}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 18,
  },
  tabBar: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  activeTab: {
    flex: 1,
    backgroundColor: '#1d4ed8',
  },
  inactiveTab: {
    flex: 1,
    backgroundColor: '#64748b',
  },
  screenContainer: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
});
