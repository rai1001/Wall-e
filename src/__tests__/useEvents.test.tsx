import { act, renderHook, waitFor } from '@testing-library/react';
import { useEvents } from '../hooks/useEvents';

const mockEventService = vi.hoisted(() => ({
  listEvents: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

const mockGoogleService = vi.hoisted(() => ({
  listEvents: vi.fn(),
}));

vi.mock('../services/eventService', () => ({
  eventService: mockEventService,
}));

vi.mock('../services/googleCalendarService', () => ({
  googleCalendarService: mockGoogleService,
}));

const start = new Date('2024-01-01T00:00:00Z');
const end = new Date('2024-01-02T00:00:00Z');

describe('useEvents', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('combina eventos internos y de Google', async () => {
    mockEventService.listEvents.mockResolvedValue([
      { id: 'a', title: 'Internal', start_time: start.toISOString(), duration: 30, source: 'internal' },
    ]);
    mockGoogleService.listEvents.mockResolvedValue([
      { id: 'g', title: 'Google', start_time: start.toISOString(), duration: 45, source: 'google' },
    ]);

    const { result } = renderHook(() => useEvents(start, end));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.events).toHaveLength(2);
    expect(result.current.events.map((e) => e.id)).toEqual(['a', 'g']);
    expect(result.current.requiresSignIn).toBe(false);
  });

  it('marca requiresSignIn cuando el servicio interno devuelve 401', async () => {
    mockEventService.listEvents.mockRejectedValue({ status: 401 });
    mockGoogleService.listEvents.mockResolvedValue([]);

    const { result } = renderHook(() => useEvents(start, end));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.requiresSignIn).toBe(true);
  });

  it('expone helpers para crear, actualizar y borrar', async () => {
    mockEventService.listEvents.mockResolvedValue([]);
    mockGoogleService.listEvents.mockResolvedValue([]);

    const created = { id: 'x', title: 'New', start_time: start.toISOString(), duration: 30 };
    mockEventService.createEvent.mockResolvedValue(created);
    mockEventService.updateEvent.mockResolvedValue({ ...created, title: 'Updated' });
    mockEventService.deleteEvent.mockResolvedValue(true);

    const { result } = renderHook(() => useEvents(start, end));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addEvent(created as any);
      await result.current.updateEvent('x', { title: 'Updated' } as any);
      await result.current.deleteEvent('x');
    });

    expect(mockEventService.createEvent).toHaveBeenCalled();
    expect(mockEventService.updateEvent).toHaveBeenCalledWith('x', { title: 'Updated' });
    expect(mockEventService.deleteEvent).toHaveBeenCalledWith('x');
  });
});
