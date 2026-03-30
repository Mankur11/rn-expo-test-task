import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { useUniverse } from '../api';

export function ServiceSelectionScreen() {
  const { data: universe, isLoading, error } = useUniverse();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load services</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{universe?.title}</Text>
      <Text style={styles.subtitle}>
        {universe?.categories.length} categories loaded
      </Text>
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
  centered: {
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
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
  },
});
