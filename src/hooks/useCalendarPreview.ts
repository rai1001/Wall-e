import { useEffect, useState } from 'react';
import { supabaseClient } from '../lib/supabaseClient';

const fallbackWeek = [
  { day: 'LUN', focus: 'Work', events: ['Plan sprint', 'Sync ops'] },
  { day: 'MAR', focus: 'Work', events: ['Review builds', 'Edge tests'] },
  { day: 'MIÉ', focus: 'Home', events: ['Family dinner'] },
  { day: 'JUE', focus: 'Personal', events: ['Learning hour'] },
  { day: 'VIE', focus: 'Work', events: ['Demo prep'] },
  { day: 'SAB', focus: 'Off', events: ['Rest'] },
  { day: 'DOM', focus: 'Reset', events: ['Reflect'] },
];

const fallbackMonth = [
  { label: 'Semana 1', detail: 'Onboarding + auth' },
  { label: 'Semana 2', detail: 'Planner core' },
  { label: 'Semana 3', detail: 'Events sync' },
  { label: 'Semana 4', detail: 'IA assistant' },
];

const fallbackConnections = [
  { provider: 'Google', status: 'synced' },
  { provider: 'Microsoft', status: 'pending' },
  { provider: 'Supabase mirror', status: 'active' },
];

const fallbackOrganizer = [
  { title: 'Revisar RLS', owner: 'DB Lead' },
  { title: 'Configurar tenant claims', owner: 'Security' },
];

export function useCalendarPreview() {
  const [week, setWeek] = useState(fallbackWeek);
  const [month, setMonth] = useState(fallbackMonth);
  const [connections, setConnections] = useState(fallbackConnections);
  const [organizer, setOrganizer] = useState(fallbackOrganizer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabaseClient) return;

      try {
        const eventsResponse = await supabaseClient
          .from('calendar_events')
          .select('title, start_time, status')
          .order('start_time', { ascending: true })
          .limit(7);

        const connectionsResponse = await supabaseClient
          .from('calendar_connections')
          .select('provider, is_enabled')
          .limit(3);

        const tasksResponse = await supabaseClient
          .from('tasks')
          .select('title, type')
          .order('created_at', { ascending: false })
          .limit(2);

        if (cancelled) return;

        if (eventsResponse.data?.length) {
          setWeek(
            eventsResponse.data.map((event) => ({
              day: event.start_time?.slice(0, 3).toUpperCase() ?? 'UNK',
              focus: event.status ?? 'Work',
              events: [event.title ?? 'Evento'],
            }))
          );
        }

        if (connectionsResponse.data?.length) {
          setConnections(
            connectionsResponse.data.map((conn) => ({
              provider: conn.provider,
              status: conn.is_enabled ? 'active' : 'paused',
            }))
          );
        }

        if (tasksResponse.data?.length) {
          setOrganizer(tasksResponse.data.map((task) => ({ title: task.title, owner: task.type })));
        }
      } catch (err) {
        console.warn('Supabase preview data not available yet', err);
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { week, month, connections, organizer, loading };
}
