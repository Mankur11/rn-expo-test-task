import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';
import { messages } from '../constants/messages';

export function ConfirmationHeader() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <Text style={styles.checkmark}>✓</Text>
      <Text style={styles.title}>{messages.bookingConfirmedTitle}</Text>
      <Text style={styles.subtitle}>{messages.bookingConfirmedMessage}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  checkmark: {
    fontSize: theme.fontSize.xxl,
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
