import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Prestation } from '../api/universe';
import { formatPrice, formatDuration } from '../utils';
import { theme } from '../theme';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

interface ServiceCardProps {
  service: Prestation;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export const ServiceCard = memo(function ServiceCard({ service, quantity, onAdd, onRemove }: ServiceCardProps) {
  const formattedPrice = formatPrice(service.price);
  const formattedDuration = formatDuration(service.duration);

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.details}>
          {formattedPrice} · {formattedDuration}
        </Text>
      </View>
      <View style={styles.controls}>
        {quantity > 0 && (
          <>
            <Pressable style={styles.button} onPress={onRemove} hitSlop={HIT_SLOP}>
              <Text style={styles.buttonText}>−</Text>
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
          </>
        )}
        <Pressable style={styles.button} onPress={onAdd} hitSlop={HIT_SLOP}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  info: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  details: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.background,
    lineHeight: 22,
    textAlign: 'center',
  },
  quantity: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.sm,
    minWidth: 20,
    textAlign: 'center',
  },
});
