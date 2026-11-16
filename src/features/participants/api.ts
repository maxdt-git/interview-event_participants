import { ApiError, http } from '../../api/client'
import type { ApiParticipant, NewParticipant, Participant, ParticipantStatus } from './types'
import { PARTICIPANT_STATUSES } from './types'

export async function getParticipants(eventId: string): Promise<Participant[]> {
    const params = new URLSearchParams({ eventId })
    try {
        const raw = await http.get<ApiParticipant[]>(`/participants?${params}`)
        return raw.filter((p) => p.eventId === eventId).map(toParticipant)
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return []
        throw error
    }
}

export async function createParticipant(data: NewParticipant): Promise<Participant> {
    const raw = await http.post<ApiParticipant>('/participants', data)
    return toParticipant(raw)
}

export async function updateParticipant(id: string, status: ParticipantStatus): Promise<Participant> {
    const raw = await http.put<ApiParticipant>(`/participants/${id}`, { status })
    return toParticipant(raw)
}

export async function deleteParticipant(eventId: string, id: string): Promise<Participant> {
    const raw = await http.delete<ApiParticipant>(`/events/${eventId}/participants/${id}`)
    return toParticipant(raw)
}

function isParticipantStatus(value: string): value is ParticipantStatus {
    return (PARTICIPANT_STATUSES as readonly string[]).includes(value)
}

export function parseStatus(raw: string): ParticipantStatus {
    return isParticipantStatus(raw) ? raw : 'registered'
}

function toParticipant(raw: ApiParticipant): Participant {
    return {
        id: raw.id,
        eventId: raw.eventId,
        name: raw.name,
        status: parseStatus(raw.status),
        avatar: raw.avatar,
        birthdate: raw.birthdate,
    }
}
