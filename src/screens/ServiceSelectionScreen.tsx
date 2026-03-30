import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function ServiceSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Selection</Text>
      <Text style={styles.subtitle}>Choose your prestations</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
