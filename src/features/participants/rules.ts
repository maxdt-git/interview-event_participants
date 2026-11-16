import type { Participant, ParticipantStatus } from './types';

export function isComing(status: ParticipantStatus): boolean {
    if (status !== 'canceled') {
        return true
    }
    return false
}

export function countComing(participants: Participant[]): number {
    let count = 0
    for (const participant of participants) {
        if (isComing(participant.status)) {
            count += 1
        }
    }
    return count
}

export function remainingSpots(capacity: number, comingCount: number): number {
    if (comingCount > capacity) {
        return 0
    }
    return capacity - comingCount
}

export function takesNewSpot(from: ParticipantStatus | null, to: ParticipantStatus): boolean {
    if (!isComing(to)) {
        return false
    }
    if (from === null) {
        return true
    }
    return !isComing(from)
}

export function canChange(capacity: number, comingCount: number, from: ParticipantStatus | null, to: ParticipantStatus): boolean {
    const remainSpots = remainingSpots(capacity, comingCount)
    if (!takesNewSpot(from, to) || remainSpots > 0) {
        return true
    }
    return false
}
