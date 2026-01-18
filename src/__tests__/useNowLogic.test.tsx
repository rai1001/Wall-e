import { renderHook } from '@testing-library/react';
import { useNowLogic } from '../hooks/useNowLogic';

const baseTime = new Date('2024-01-01T09:00:00Z');

const buildEvent = (overrides: Partial<any>) => ({
  id: 'evt-1',
  title: 'Event',
  start_time: '2024-01-01T09:00:00Z',
  duration: 60,
  status: 'confirmed',
  ...overrides,
});

describe('useNowLogic', () => {
  it('detecta evento en curso y calcula progreso', () => {
    const events = [buildEvent({ duration: 60 })];

    const { result } = renderHook(() => useNowLogic(events, baseTime));

    expect(result.current.status).toBe('focus');
    expect(result.current.currentEvent?.title).toBe('Event');
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.timeUntilNext).toBeNull();
  });

  it('muestra gap y próximo evento cuando no hay evento actual', () => {
    const events = [
      buildEvent({ start_time: '2024-01-01T11:00:00Z', title: 'Next' }),
    ];

    const { result } = renderHook(() => useNowLogic(events, baseTime));

    expect(result.current.status).toBe('gap');
    expect(result.current.nextEvent?.title).toBe('Next');
    expect(result.current.timeUntilNext).toContain('in');
  });

  it('marca libre cuando no hay eventos', () => {
    const { result } = renderHook(() => useNowLogic([], baseTime));

    expect(result.current.status).toBe('free');
    expect(result.current.currentEvent).toBeNull();
    expect(result.current.nextEvent).toBeNull();
  });
});
