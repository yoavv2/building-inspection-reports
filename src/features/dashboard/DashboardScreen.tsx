import { StyleSheet, View } from 'react-native';

import { HebrewText } from '../../components/HebrewText';

export const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <HebrewText variant="subtitle">לוח בקרה</HebrewText>
      <HebrewText>סיכום סטטוס יופיע כאן בהמשך.</HebrewText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
