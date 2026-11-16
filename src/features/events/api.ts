import { http } from '../../api/client';
import type { ApiEvent, AppEvent } from './types';

export async function getEvents(): Promise<AppEvent[]> {
    const events = await http.get<ApiEvent[]>('/events')
    return events.map(toAppEvent)
}

export async function getEvent(id: string): Promise<AppEvent> {
    const event = await http.get<ApiEvent>(`/events/${id}`)
    return toAppEvent(event)
}

function toAppEvent(raw: ApiEvent): AppEvent {
    return {
        id: raw.id,
        name: raw.name,
        date: Number.isFinite(raw.startsAt) ? new Date(raw.startsAt * 1000).toISOString() : '',
        location: typeof raw.location === 'string' ? raw.location : '',
        capacity: raw.capacity,
    }
}
