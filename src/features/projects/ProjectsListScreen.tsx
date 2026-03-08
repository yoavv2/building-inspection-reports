import { StyleSheet, View } from 'react-native';

import { HebrewButton } from '../../components/HebrewButton';
import { HebrewText } from '../../components/HebrewText';

type ProjectsListScreenProps = {
  onOpenEditor: () => void;
};

const mockProjects = ['בניין אלון 12', 'מרכז מסחרי השרון', 'מגדל גנים 4'];

export const ProjectsListScreen = ({ onOpenEditor }: ProjectsListScreenProps) => {
  return (
    <View style={styles.container}>
      <HebrewText variant="subtitle">רשימת פרויקטים</HebrewText>
      <View style={styles.list}>
        {mockProjects.map((project) => (
          <View key={project} style={styles.projectCard}>
            <HebrewText>{project}</HebrewText>
          </View>
        ))}
      </View>
      <HebrewButton label="יצירת פרויקט חדש" onPress={onOpenEditor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  list: {
    gap: 10,
  },
  projectCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
