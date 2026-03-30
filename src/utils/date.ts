import { isBefore, setHours, setMinutes, setSeconds, startOfDay } from 'date-fns';

const BOOKING_START_HOUR = 7;
const BOOKING_END_HOUR = 22;

export function isValidAppointment(date: Date): boolean {
  const now = new Date();
  if (isBefore(startOfDay(date), startOfDay(now))) return false;

  const hour = date.getHours();
  return hour >= BOOKING_START_HOUR && hour < BOOKING_END_HOUR;
}

export function getMinTime(date: Date): Date {
  return setSeconds(setMinutes(setHours(date, BOOKING_START_HOUR), 0), 0);
}

export function getMaxTime(date: Date): Date {
  return setSeconds(setMinutes(setHours(date, BOOKING_END_HOUR), 0), 0);
}

export function getMinDate(): Date {
  return startOfDay(new Date());
}

export function getDefaultAppointment(): Date {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const snappedMinutes = Math.ceil(minutes / 30) * 30;

  if (hour >= BOOKING_START_HOUR && (hour < BOOKING_END_HOUR - 1 || (hour === BOOKING_END_HOUR - 1 && snappedMinutes < 60))) {
    return setSeconds(setMinutes(setHours(now, snappedMinutes === 60 ? hour + 1 : hour), snappedMinutes === 60 ? 0 : snappedMinutes), 0);
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return setSeconds(setMinutes(setHours(tomorrow, BOOKING_START_HOUR), 0), 0);
}
