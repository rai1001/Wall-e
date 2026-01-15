
import { useState, useCallback, useEffect } from 'react';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: any) => void;
}

// Global window extension
declare global {
    interface Window {
        SpeechRecognition: { new(): SpeechRecognition };
        webkitSpeechRecognition: { new(): SpeechRecognition };
    }
}

export function useVoiceInput(onFinalTranscript: (text: string) => void) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [support, setSupport] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setSupport(false);
        }
    }, []);

    const startListening = useCallback(() => {
        if (!support) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'es-ES'; // Spanish default

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let final = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            if (final) {
                setTranscript(final);
                onFinalTranscript(final);
                // Recognition automatically stops after final result usually, 
                // but we strictly manage state on end
            } else {
                setTranscript(interim);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
            setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
        setTranscript('');
    }, [onFinalTranscript, support]);

    const stopListening = useCallback(() => {
        // We rely on "onend" to clear state, but we can't easily access the instance here 
        // without a ref. For simple "one-shot" commands, usually let it finish or use a ref 
        // if we need manual abort. For MVP, we presume user talks and it finishes.
        // If we need manual stop, we'd store the recognition instance in a ref.
    }, []);

    return { isListening, transcript, startListening, stopListening, support };
}
