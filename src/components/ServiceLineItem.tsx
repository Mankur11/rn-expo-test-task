import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatPrice } from '../utils';
import { theme } from '../theme';
import type { BasketItem } from '../store';

interface ServiceLineItemProps {
  item: BasketItem;
}

export const ServiceLineItem = memo(function ServiceLineItem({
  item,
}: ServiceLineItemProps) {
  const label =
    item.quantity > 1
      ? `${item.prestation.title} ×${item.quantity}`
      : item.prestation.title;
  const formattedPrice = formatPrice(item.prestation.price * item.quantity);

  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.price}>{formattedPrice}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  price: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
});
