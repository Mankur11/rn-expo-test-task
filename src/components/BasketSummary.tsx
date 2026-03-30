import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPrice, formatDuration } from '../utils';
import { theme } from '../theme';
import { messages } from '../constants/messages';

interface BasketSummaryProps {
  totalPrice: number;
  totalDuration: number;
  canProceed: boolean;
  onNext: () => void;
  buttonLabel?: string;
}

export function BasketSummary({
  totalPrice,
  totalDuration,
  canProceed,
  onNext,
  buttonLabel = messages.next,
}: BasketSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.totals}>
        <Text style={styles.totalText}>{formatPrice(totalPrice)}</Text>
        <Text style={styles.durationText}>{formatDuration(totalDuration)}</Text>
      </View>
      <Pressable
        style={[styles.button, !canProceed && styles.buttonDisabled]}
        onPress={onNext}
        disabled={!canProceed}
      >
        <Text style={[styles.buttonText, !canProceed && styles.buttonTextDisabled]}>
          {buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totals: {
    flex: 1,
  },
  totalText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  durationText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.background,
  },
  buttonTextDisabled: {
    color: theme.colors.textSecondary,
  },
});
