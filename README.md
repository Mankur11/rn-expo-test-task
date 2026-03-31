# Wecasa Booking App

A 4-screen React Native booking app for scheduling haircuts at home. Built with Expo, TypeScript strict mode, and a linear wizard flow.

## Screens

1. **Service Selection** - Browse catalog by category, add/remove services to basket
2. **Address** - Enter delivery address
3. **Appointment** - Pick date and time (7:00-22:00, 30-min slots)
4. **Confirmation** - Review booking summary, start a new booking

## Tech Stack

- **Expo SDK 54** / React Native 0.81
- **TypeScript** (strict mode)
- **Zustand** - client state (basket, address, appointment)
- **TanStack Query** - server state (service catalog, booking mutation)
- **Zod** - runtime validation at API boundaries
- **React Navigation 7** - typed native-stack navigator
- **date-fns** - date manipulation and formatting

## Architecture

```
src/
  api/          # Zod schemas, fetch functions, TanStack Query hooks
  components/   # Reusable UI components (ServiceCard, BasketSummary, DateTimePicker, etc.)
  constants/    # Centralized messages
  hooks/        # Derived state hooks (useBookingSummary)
  navigation/   # RootNavigator with typed param list
  screens/      # 4 wizard screens
  store/        # Zustand booking store
  utils/        # Formatters, date utils, typed error system
  theme.ts      # Colors, spacing, typography constants
```

**State split**: server data (catalog) in TanStack Query with `staleTime: Infinity`; client data (basket, address, appointment) in Zustand. Derived values (`totalPrice`, `canProceed`) computed via `useBookingSummary` hook.

**Basket model**: `Record<reference, { prestation, quantity }>` for O(1) lookups and clean quantity management.

**Error handling**: typed `AppError` with error codes, central `toAppError()` mapping, and `getErrorMessage()` for consistent user-facing messages.

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android).

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm test` | Run Jest test suite |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run format` | Format code with Prettier |

## Testing

75+ tests across 12 suites using Jest and React Native Testing Library:

- **Store tests** - actions, derived selectors, gate checks, reset
- **Utility tests** - pure function assertions (formatters, date utils)
- **Component tests** - render output, conditional rendering, callbacks
- **Screen tests** - integration with mocked API hooks and pre-populated store

```bash
npm test
```

## Date/Time Policy

- Appointments are stored as ISO 8601 strings (UTC) in the store
- Display uses local timezone via `date-fns/format`
- Valid booking window: 7:00-22:00 local time, today or future dates
- Slots snap to 30-minute intervals
- Default appointment: next available 30-min slot, or tomorrow at 7:00 if past hours

## Nice to Do Later

- Replace `messages.ts` with proper i18n (e.g., `react-i18next`) for real locale support
- Add address validation via a geocoding API instead of free-text input
- Persist basket to AsyncStorage using Zustand's `persist` middleware so it survives app kills
- Add E2E tests with Detox or Maestro covering the full booking flow
- Use app-level locale setting (with device locale fallback) for date/currency formatting in `formatters.ts`
