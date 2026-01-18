import { act, renderHook } from '@testing-library/react';
import { useFocusMode } from '../hooks/useFocusMode';

describe('useFocusMode', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia y cuenta atrás la sesión', () => {
    const { result } = renderHook(() => useFocusMode());

    act(() => result.current.startSession('Task A'));
    expect(result.current.isActive).toBe(true);
    expect(result.current.currentTask).toBe('Task A');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.timeLeft).toBeLessThan(25 * 60);

    act(() => result.current.stopSession());
    expect(result.current.isActive).toBe(false);
    expect(result.current.currentTask).toBeNull();
  });

  it('formatea el tiempo', () => {
    const { result } = renderHook(() => useFocusMode());
    expect(result.current.formatTime(65)).toBe('1:05');
  });
});
