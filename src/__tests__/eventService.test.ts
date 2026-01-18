import { eventService } from '../services/eventService';

const fromMock = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: { from: (...args: any[]) => fromMock(...args) },
}));

const sampleDbEvent = {
  id: '1',
  title: 'Event',
  category: 'work',
  start_time: '2024-01-01T10:00:00Z',
  end_time: '2024-01-01T11:00:00Z',
  description: 'desc',
};

function buildQuery(resolved: any) {
  return {
    select: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(resolved),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(resolved),
  };
}

describe('eventService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('lista eventos y mapea a UI', async () => {
    fromMock.mockReturnValue(buildQuery({ data: [sampleDbEvent], error: null }));
    const events = await eventService.listEvents(new Date(sampleDbEvent.start_time), new Date(sampleDbEvent.end_time));
    expect(events[0].id).toBe('1');
    expect(events[0].duration).toBe(60);
  });

  it('crea y actualiza eventos', async () => {
    fromMock.mockReturnValue(buildQuery({ data: sampleDbEvent, error: null }));

    const created = await eventService.createEvent(sampleDbEvent as any);
    expect(created.id).toBe('1');

    const updated = await eventService.updateEvent('1', { title: 'Updated' } as any);
    expect(updated.title).toBe('Event'); // mapDbToUi keeps original mapping for UI display
  });

  it('borra eventos', async () => {
    fromMock.mockReturnValue(buildQuery({ data: null, error: null }));
    await expect(eventService.deleteEvent('1')).resolves.toBe(true);
  });
});
