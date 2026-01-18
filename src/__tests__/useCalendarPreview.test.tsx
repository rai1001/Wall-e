import { renderHook, waitFor } from '@testing-library/react';
import { useCalendarPreview } from '../hooks/useCalendarPreview';

const buildQuery = (data: any[]) => ({
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue({ data, error: null }),
});

vi.mock('../lib/supabaseClient', () => {
  const events = [{ title: 'Evento', start_time: '2024-01-01T10:00:00Z', status: 'Work' }];
  const connections = [{ provider: 'Google', is_enabled: true }];
  const tasks = [{ title: 'Tarea', type: 'work' }];

  return {
    supabaseClient: {
      from: vi.fn((table: string) => {
        if (table === 'calendar_events') return buildQuery(events);
        if (table === 'calendar_connections') return buildQuery(connections);
        if (table === 'tasks') return buildQuery(tasks);
        return buildQuery([]);
      }),
    },
  };
});

describe('useCalendarPreview', () => {
  it('carga datos desde Supabase y actualiza estados', async () => {
    const { result } = renderHook(() => useCalendarPreview());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.week[0].events[0]).toBe('Evento');
    expect(result.current.connections[0].provider).toBe('Google');
    expect(result.current.organizer[0].title).toBe('Tarea');
  });
});
