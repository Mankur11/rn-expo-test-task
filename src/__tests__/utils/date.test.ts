import { isValidAppointment, getDefaultAppointment, getMinDate } from '../../utils/date';

describe('isValidAppointment', () => {
  it('accepts a date with hour within 7-22 range', () => {
    const date = new Date();
    date.setHours(10, 0, 0, 0);
    expect(isValidAppointment(date)).toBe(true);
  });

  it('accepts hour 7 (start boundary)', () => {
    const date = new Date();
    date.setHours(7, 0, 0, 0);
    expect(isValidAppointment(date)).toBe(true);
  });

  it('accepts hour 21 (last valid hour)', () => {
    const date = new Date();
    date.setHours(21, 30, 0, 0);
    expect(isValidAppointment(date)).toBe(true);
  });

  it('rejects hour 22 (end boundary)', () => {
    const date = new Date();
    date.setHours(22, 0, 0, 0);
    expect(isValidAppointment(date)).toBe(false);
  });

  it('rejects hour 6 (before start)', () => {
    const date = new Date();
    date.setHours(6, 0, 0, 0);
    expect(isValidAppointment(date)).toBe(false);
  });

  it('rejects a date in the past (yesterday)', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(10, 0, 0, 0);
    expect(isValidAppointment(yesterday)).toBe(false);
  });

  it('accepts today even if time is slightly in the past', () => {
    const today = new Date();
    today.setHours(10, 0, 0, 0);
    if (today < new Date()) {
      expect(isValidAppointment(today)).toBe(true);
    }
  });
});

describe('getDefaultAppointment', () => {
  it('returns a valid appointment', () => {
    const defaultDate = getDefaultAppointment();
    expect(isValidAppointment(defaultDate)).toBe(true);
  });

  it('snaps minutes to 30-minute intervals', () => {
    const defaultDate = getDefaultAppointment();
    expect(defaultDate.getMinutes() % 30).toBe(0);
  });

  it('has seconds set to 0', () => {
    const defaultDate = getDefaultAppointment();
    expect(defaultDate.getSeconds()).toBe(0);
  });
});

describe('getMinDate', () => {
  it('returns start of today', () => {
    const minDate = getMinDate();
    expect(minDate.getHours()).toBe(0);
    expect(minDate.getMinutes()).toBe(0);
    expect(minDate.getSeconds()).toBe(0);
  });
});
