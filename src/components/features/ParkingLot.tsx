import { useState } from 'react';

export const ParkingLot = () => {
    const [thought, setThought] = useState('');
    const [parkedItems, setParkedItems] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handlePark = (e: React.FormEvent) => {
        e.preventDefault();
        if (!thought.trim()) return;
        setParkedItems(prev => [...prev, thought]);
        setThought('');
        // Ideally save to DB or State
    };

    return (
        <div className={`fixed bottom-24 right-4 z-40 flex flex-col items-end transition-all ${isOpen ? 'w-full max-w-xs' : 'w-auto'}`}>

            {/* Expanded List */}
            {isOpen && (
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 mb-2 w-full animate-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parking (Captura rápida)</h4>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <ul className="space-y-1 mb-3 max-h-32 overflow-y-auto">
                        {parkedItems.length === 0 && <li className="text-xs text-gray-300 italic">Nada aparcado aún...</li>}
                        {parkedItems.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600 truncate border-l-2 border-purple-300 pl-2 bg-purple-50 py-1">{item}</li>
                        ))}
                    </ul>

                    <form onSubmit={handlePark} className="flex gap-2">
                        <input
                            type="text"
                            value={thought}
                            onChange={(e) => setThought(e.target.value)}
                            placeholder="Distracción..."
                            className="bg-gray-100 rounded px-2 py-1 text-sm flex-1 outline-none focus:ring-1 focus:ring-purple-500"
                            autoFocus
                        />
                        <button type="submit" className="text-purple-600 font-bold text-lg leading-none">+</button>
                    </form>
                </div>
            )}

            {/* Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-white/80 backdrop-blur text-purple-600 p-3 rounded-full shadow-lg border border-purple-100 hover:scale-110 transition-transform"
                    title="Aparcar Idea"
                >
                    🅿️
                </button>
            )}
        </div>
    );
};
