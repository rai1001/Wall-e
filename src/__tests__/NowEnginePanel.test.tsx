import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NowEnginePanel from '../components/sprint4/NowEnginePanel';

const mockGetNext = vi.fn();
const mockStart = vi.fn();
const mockEnd = vi.fn();
const mockParking = vi.fn();

vi.mock('../lib/nowActions', () => ({
  getNextNowTask: (...args: any[]) => mockGetNext(...args),
  startFocus: (...args: any[]) => mockStart(...args),
  endFocus: (...args: any[]) => mockEnd(...args),
  addParking: (...args: any[]) => mockParking(...args),
}));

describe('NowEnginePanel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('carga una tarea y permite iniciar/finalizar focus', async () => {
    mockGetNext.mockResolvedValue([{ id: 't1', title: 'Task', due: new Date().toISOString(), status: 'todo' }]);
    mockStart.mockResolvedValue([{ id: 's1' }]);
    mockEnd.mockResolvedValue(true);
    mockParking.mockResolvedValue(true);

    render(<NowEnginePanel />);

    await waitFor(() => screen.getByText(/Task/));

    fireEvent.click(screen.getByText(/Iniciar Focus/i));
    await waitFor(() => expect(mockStart).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/Finalizar Focus/i));
    await waitFor(() => expect(mockEnd).toHaveBeenCalled());

    fireEvent.change(screen.getByPlaceholderText(/parking/i), { target: { value: 'nota' } });
    fireEvent.click(screen.getByText(/Guardar en Parking/i));
    await waitFor(() => expect(mockParking).toHaveBeenCalledWith('nota'));
  });
});
