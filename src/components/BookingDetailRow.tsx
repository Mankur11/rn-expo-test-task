import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface BookingDetailRowProps {
  label: string;
  value: string;
}

export const BookingDetailRow = memo(function BookingDetailRow({
  label,
  value,
}: BookingDetailRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  value: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'right',
    marginLeft: theme.spacing.sm,
  },
});
