import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssistantPanel from '../components/sprint3/AssistantPanel';

const mockRequest = vi.fn();
const mockConfirm = vi.fn();

vi.mock('../lib/assistantActions', () => ({
  requestSuggestion: (...args: any[]) => mockRequest(...args),
  confirmSuggestion: (...args: any[]) => mockConfirm(...args),
  __esModule: true,
}));

describe('AssistantPanel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('muestra sugerencia y permite confirmar', async () => {
    mockRequest.mockResolvedValue({ id: '1', suggestion: 'Haz pruebas', status: 'proposed' });
    mockConfirm.mockResolvedValue({ id: '1', suggestion: 'Haz pruebas', status: 'accepted' });

    render(<AssistantPanel />);

    fireEvent.click(screen.getByText(/consultar ia/i));

    await waitFor(() => screen.getByText(/Haz pruebas/));

    fireEvent.click(screen.getByText(/Confirmar/i));
    await waitFor(() => expect(mockConfirm).toHaveBeenCalled());
  });

  it('muestra error si la solicitud falla', async () => {
    mockRequest.mockRejectedValue(new Error('fallo'));

    render(<AssistantPanel />);
    fireEvent.click(screen.getByText(/consultar ia/i));

    await waitFor(() => screen.getByText(/Error: fallo/i));
  });
});
