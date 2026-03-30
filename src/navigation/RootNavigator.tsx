import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ServiceSelectionScreen,
  AddressSelectionScreen,
  AppointmentSelectionScreen,
  ConfirmationScreen,
} from '../screens';
import { theme } from '../theme';

export type RootStackParamList = {
  ServiceSelection: undefined;
  AddressSelection: undefined;
  AppointmentSelection: undefined;
  Confirmation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ServiceSelection"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="ServiceSelection"
        component={ServiceSelectionScreen}
        options={{ title: 'Services' }}
      />
      <Stack.Screen
        name="AddressSelection"
        component={AddressSelectionScreen}
        options={{ title: 'Address' }}
      />
      <Stack.Screen
        name="AppointmentSelection"
        component={AppointmentSelectionScreen}
        options={{ title: 'Appointment' }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
