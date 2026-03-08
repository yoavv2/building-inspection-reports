import { StyleSheet, View } from 'react-native';

import { HebrewButton } from '../../components/HebrewButton';
import { HebrewInput } from '../../components/HebrewInput';
import { HebrewText } from '../../components/HebrewText';

type ProjectEditorScreenProps = {
  onSave: () => void;
};

export const ProjectEditorScreen = ({ onSave }: ProjectEditorScreenProps) => {
  return (
    <View style={styles.container}>
      <HebrewText variant="subtitle">עורך פרויקט</HebrewText>
      <View style={styles.form}>
        <HebrewText>שם הפרויקט</HebrewText>
        <HebrewInput placeholder="הזן שם פרויקט" />
        <HebrewText>שם בודק</HebrewText>
        <HebrewInput placeholder="הזן שם בודק" />
      </View>
      <HebrewButton label="שמירת טיוטה" onPress={onSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  form: {
    gap: 8,
  },
});
