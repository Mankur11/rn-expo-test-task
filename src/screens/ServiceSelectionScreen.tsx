import { ActivityIndicator, SectionList, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useUniverse } from '../api';
import type { Prestation } from '../api';
import { useBookingStore } from '../store';
import { ScreenLayout, ServiceCard, BasketSummary } from '../components';
import { theme } from '../theme';
import { messages } from '../constants/messages';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ServiceSelection'>;

export function ServiceSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { data: universe, isLoading, error } = useUniverse();

  const basket = useBookingStore((s) => s.basket);
  const addPrestation = useBookingStore((s) => s.addPrestation);
  const removePrestation = useBookingStore((s) => s.removePrestation);
  const getQuantity = useBookingStore((s) => s.getQuantity);
  const totalPrice = useBookingStore((s) => s.totalPrice);
  const totalDuration = useBookingStore((s) => s.totalDuration);
  const canProceed = useBookingStore((s) => s.canProceedToAddress);

  if (isLoading) {
    return (
      <ScreenLayout style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ScreenLayout>
    );
  }

  if (error || !universe) {
    return (
      <ScreenLayout style={styles.centered}>
        <Text style={styles.errorText}>{messages.errorLoadingServices}</Text>
      </ScreenLayout>
    );
  }

  const sections = universe.categories.map((category) => ({
    title: category.title,
    data: category.prestations,
  }));

  const renderItem = ({ item }: { item: Prestation }) => (
    <ServiceCard
      service={item}
      quantity={getQuantity(item.reference)}
      onAdd={() => addPrestation(item)}
      onRemove={() => removePrestation(item.reference)}
    />
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <ScreenLayout
      footer={
        <BasketSummary
          totalPrice={totalPrice()}
          totalDuration={totalDuration()}
          canProceed={canProceed()}
          onNext={() => navigation.navigate('AddressSelection')}
        />
      }
    >
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.reference}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
  },
  sectionHeader: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
});
