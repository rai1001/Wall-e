import { useState, useEffect } from "react";
import { X, Clock, MapPin, AlignLeft, Briefcase, Home, User, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { CreateEventInput } from "../../services/eventService";

interface EventPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CreateEventInput & { id?: string }) => Promise<any>;
    onDelete?: (id: string) => Promise<any>;
    initialData?: (Partial<CreateEventInput> & { id?: string }) | null;
}

export function EventPanel({ isOpen, onClose, onSave, onDelete, initialData }: EventPanelProps) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'work' | 'home'>('work');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [eventId, setEventId] = useState<string | undefined>(undefined);
    const [isReadOnly, setIsReadOnly] = useState(false);

    // Reset or Populate when opening
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setEventId(initialData.id);
                setTitle(initialData.title || '');
                setType(initialData.category || 'work');
                setLocation(initialData.location || '');
                setDescription(initialData.description || '');
                setStartTime(initialData.start_time || new Date('2026-01-16T10:00:00').toISOString());
                setEndTime(initialData.end_time || new Date('2026-01-16T11:00:00').toISOString());
                // @ts-ignore - source isn't in the strict type yet but it flows through
                setIsReadOnly(initialData.source === 'google');
            } else {
                // Default empty state
                setEventId(undefined);
                setTitle('');
                setType('work');
                setLocation('');
                setDescription('');
                setStartTime(new Date('2026-01-16T10:00:00').toISOString());
                setEndTime(new Date('2026-01-16T11:00:00').toISOString());
                setIsReadOnly(false);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!title.trim() || isReadOnly) return;

        try {
            setSaving(true);
            await onSave({
                id: eventId,
                title,
                category: type,
                description,
                location,
                start_time: startTime,
                end_time: endTime,
                is_all_day: false
            });

            // Reset and close
            setTitle('');
            setDescription('');
            setLocation('');
            setEventId(undefined);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save event');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!eventId || !onDelete || isReadOnly) return;
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            setSaving(true);
            await onDelete(eventId);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to delete event');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 p-6 flex flex-col border-l border-main/5 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h2 className="text-xl font-serif font-semibold text-main">
                        {eventId ? 'Edit Event' : 'New Event'}
                    </h2>
                    {isReadOnly && <span className="text-xs text-terracotta font-medium">Read Only (Google Calendar)</span>}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-main/5 rounded-full text-main/40 hover:text-main transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className={`space-y-6 flex-1 ${isReadOnly ? 'opacity-70 pointer-events-none' : ''}`}>

                {/* Title */}
                <div>
                    <input
                        type="text"
                        placeholder="Add title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full text-2xl font-serif font-bold placeholder:text-main/20 border-b border-main/10 pb-2 focus:outline-none focus:border-terracotta bg-transparent text-main"
                        autoFocus={!isReadOnly}
                        disabled={isReadOnly}
                    />
                </div>

                {/* Context Toggles */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setType('work')}
                        disabled={isReadOnly}
                        className={`flex-1 py-2 rounded-lg border font-medium flex justify-center items-center gap-2 transition-colors ${type === 'work' ? 'border-terracotta bg-terracotta/5 text-terracotta' : 'border-main/10 text-main/40 hover:bg-main/5'}`}>
                        <Briefcase size={16} /> Work
                    </button>
                    <button
                        onClick={() => setType('personal')}
                        disabled={isReadOnly}
                        className={`flex-1 py-2 rounded-lg border font-medium flex justify-center items-center gap-2 transition-colors ${type === 'personal' ? 'border-terracotta bg-terracotta/5 text-terracotta' : 'border-main/10 text-main/40 hover:bg-main/5'}`}>
                        <User size={16} /> Personal
                    </button>
                    <button
                        onClick={() => setType('home')}
                        disabled={isReadOnly}
                        className={`flex-1 py-2 rounded-lg border font-medium flex justify-center items-center gap-2 transition-colors ${type === 'home' ? 'border-sage bg-sage/5 text-sage' : 'border-main/10 text-main/40 hover:bg-main/5'}`}>
                        <Home size={16} /> Home
                    </button>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-main/60">
                        <Clock size={20} className="text-main/40" />
                        <div className="flex-1 flex gap-2">
                            <div className="bg-main/5 px-3 py-2 rounded-lg text-sm font-medium text-main">Jan 16</div>
                            <div className="bg-main/5 px-3 py-2 rounded-lg text-sm font-medium text-main">10:00 AM</div>
                            <span className="self-center text-main/40">-</span>
                            <div className="bg-main/5 px-3 py-2 rounded-lg text-sm font-medium text-main">11:00 AM</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-main/60">
                        <MapPin size={20} className="text-main/40" />
                        <input
                            placeholder="Add location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            disabled={isReadOnly}
                            className="flex-1 bg-transparent text-sm font-medium placeholder:text-main/30 focus:outline-none text-main"
                        />
                    </div>

                    <div className="flex items-start gap-4 text-main/60">
                        <AlignLeft size={20} className="mt-1 text-main/40" />
                        <textarea
                            placeholder="Add description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            disabled={isReadOnly}
                            className="flex-1 bg-main/5 rounded-xl p-3 text-sm font-medium placeholder:text-main/30 focus:outline-none resize-none text-main"
                        />
                    </div>
                </div>

            </div>

            <div className="flex justify-between items-center pt-4 border-t border-main/5">
                {eventId && !isReadOnly ? (
                    <button
                        onClick={handleDelete}
                        disabled={saving}
                        className="p-2 text-main/40 hover:text-terracotta hover:bg-terracotta/5 rounded-lg transition-colors"
                        title="Delete Event"
                    >
                        <Trash2 size={20} />
                    </button>
                ) : (
                    <div></div> // Spacer
                )}
                {isReadOnly ? (
                    <div className="flex-1 flex justify-end">
                        <Button variant="ghost" onClick={onClose}>Close</Button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving || !title.trim()}>
                            {saving ? 'Saving...' : 'Save Event'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
