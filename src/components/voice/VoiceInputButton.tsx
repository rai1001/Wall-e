
import { useState } from 'react';
import { Mic, Loader2, Sparkles } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { geminiService } from '../../services/geminiService';
import { useEventContext } from '../../context/EventContext';

export function VoiceInputButton() {
    const { openCreateEvent } = useEventContext();
    const [processing, setProcessing] = useState(false);

    const handleTranscript = async (text: string) => {
        console.log('Voice recognized:', text);
        setProcessing(true);

        try {
            const parsed = await geminiService.parseEventFromText(text);
            console.log('Parsed event:', parsed);

            openCreateEvent({
                title: parsed.title,
                start_time: parsed.start_time,
                end_time: parsed.end_time,
                location: parsed.location,
                description: parsed.description,
                category: parsed.category || 'work' // Default fallback
            });
        } catch (e) {
            console.error(e);
            // Fallback: open with raw text as title
            openCreateEvent({ title: text });
        } finally {
            setProcessing(false);
        }
    };

    const { isListening, startListening, support } = useVoiceInput(handleTranscript);

    if (!support) return null;

    return (
        <button
            onClick={startListening}
            disabled={isListening || processing}
            className={`
                fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50
                p-4 rounded-full shadow-soft transition-all duration-300
                flex items-center justify-center
                ${isListening
                    ? 'bg-red-500 text-white animate-pulse scale-110 shadow-red-500/30'
                    : processing
                        ? 'bg-accent text-white scale-105'
                        : 'bg-main text-white hover:bg-main/90 hover:scale-105'
                }
            `}
            title="Añadir evento por voz"
        >
            {processing ? (
                <Loader2 className="animate-spin" size={24} />
            ) : isListening ? (
                <div className="animate-bounce">
                    <Mic size={24} />
                </div>
            ) : (
                <Mic size={24} />
            )}

            {/* Tooltip detail/status */}
            {isListening && (
                <div className="absolute right-full mr-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                    Escuchando...
                </div>
            )}
            {processing && (
                <div className="absolute right-full mr-4 bg-accent text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap flex gap-2">
                    <Sparkles size={16} /> Procesando con IA...
                </div>
            )}
        </button>
    );
}
