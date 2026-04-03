import { messages } from '../constants/messages';

export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'BOOKING_FAILED'
  | 'SERVICES_LOAD_FAILED'
  | 'INVALID_APPOINTMENT';

const errorMessageMap: Record<AppErrorCode, string> = {
  NETWORK_ERROR: messages.bookingError,
  BOOKING_FAILED: messages.bookingError,
  SERVICES_LOAD_FAILED: messages.errorLoadingServices,
  INVALID_APPOINTMENT: messages.invalidAppointment,
};

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message?: string,
    public readonly cause?: unknown,
  ) {
    super(message ?? errorMessageMap[code]);
    this.name = 'AppError';
  }
}

export function toAppError(error: unknown, fallbackCode: AppErrorCode = 'BOOKING_FAILED'): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof Error) {
    if (error.message.includes('Network') || error.message.includes('timeout')) {
      return new AppError('NETWORK_ERROR', undefined, error);
    }
  }

  return new AppError(fallbackCode, undefined, error);
}

export function getErrorMessage(error: unknown, fallbackCode?: AppErrorCode): string {
  return toAppError(error, fallbackCode).message;
}
