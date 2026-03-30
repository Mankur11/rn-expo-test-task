import { isBefore, setHours, setMinutes, setSeconds, startOfDay } from 'date-fns';

const BOOKING_START_HOUR = 7;
const BOOKING_END_HOUR = 22;

export function isValidAppointment(date: Date): boolean {
  const now = new Date();
  if (isBefore(date, now)) return false;

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
