export const PARTICIPANT_STATUSES = ['registered', 'confirmed', 'attended', 'canceled'] as const

export type ParticipantStatus = (typeof PARTICIPANT_STATUSES)[number]

export type Participant = {
    id: string
    eventId: string
    name: string
    status: ParticipantStatus
    avatar?: string
    birthdate?: string
}

export type NewParticipant = Omit<Participant, 'id' >

export type ApiParticipant = {
    id: string
    eventId: string
    name: string
    avatar?: string
    birthdate?: string
    status: string
}
