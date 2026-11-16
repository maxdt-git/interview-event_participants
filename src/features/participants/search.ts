import type { Participant } from "./types";

export function matchesSearch(participant: Participant, query: string): boolean {
    const q = query.trim().toLowerCase()
    if (q === '') return true

    const name = participant.name.toLowerCase()

    return name.includes(q)
}
