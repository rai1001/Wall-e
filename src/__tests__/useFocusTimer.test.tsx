import { act, renderHook } from '@testing-library/react';
import { useFocusTimer } from '../hooks/useFocusTimer';

describe('useFocusTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia, incrementa y pausa el contador', () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.elapsedSeconds).toBe(3);
    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.togglePause();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // sigue en 3 porque está en pausa
    expect(result.current.elapsedSeconds).toBe(3);
    expect(result.current.isPaused).toBe(true);
  });

  it('formatea el tiempo correctamente', () => {
    const { result } = renderHook(() => useFocusTimer());

    expect(result.current.formatTime(65)).toBe('1:05');
    expect(result.current.formatTime(3665)).toBe('1:01:05');
  });
});
