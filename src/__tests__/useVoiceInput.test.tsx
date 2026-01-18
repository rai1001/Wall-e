import { act, renderHook } from '@testing-library/react';
import { useVoiceInput } from '../hooks/useVoiceInput';

describe('useVoiceInput', () => {
  let recognitionInstance: any;

  beforeEach(() => {
    recognitionInstance = null;
    vi.useFakeTimers();
    // Mock SpeechRecognition
    const FakeRecognition = function () {
      this.continuous = false;
      this.interimResults = false;
      this.lang = 'es-ES';
      this.start = () => {
        recognitionInstance = this;
      };
      this.stop = vi.fn();
      this.onresult = () => {};
      this.onend = () => {};
      this.onerror = () => {};
    } as any;

    (global as any).window.SpeechRecognition = FakeRecognition;
    (global as any).window.webkitSpeechRecognition = FakeRecognition;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (global as any).window.SpeechRecognition;
    delete (global as any).window.webkitSpeechRecognition;
  });

  it('captura transcripciones finales y llama onFinalTranscript', () => {
    const onFinal = vi.fn();
    const { result } = renderHook(() => useVoiceInput(onFinal));

    act(() => result.current.startListening());
    expect(result.current.isListening).toBe(true);
    expect(recognitionInstance).not.toBeNull();

    const fakeEvent = {
      resultIndex: 0,
      results: [
        { isFinal: true, 0: { transcript: 'hola', confidence: 1 } },
      ],
    } as any;

    act(() => {
      recognitionInstance.onresult(fakeEvent);
      recognitionInstance.onend();
    });

    expect(onFinal).toHaveBeenCalledWith('hola');
    expect(result.current.transcript).toBe('hola');
    expect(result.current.isListening).toBe(false);
  });
});
