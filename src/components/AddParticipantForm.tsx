import { useState } from "react"
import { PARTICIPANT_STATUSES, type ParticipantStatus } from "../features/participants/types"
import { useCreateParticipant } from "../features/participants/queries"
import { remainingSpots } from "../features/participants/rules"
import type { SubmitEvent } from 'react'

type AddParticipantFormProps = {
    eventId: string
    capacity: number
    comingCount: number
}

export function AddParticipantForm({ eventId, capacity, comingCount }: AddParticipantFormProps) {
    const [name, setName] = useState('')
    const [status, setStatus] = useState<ParticipantStatus>('registered')
    const createMutation = useCreateParticipant(eventId)

    const trimmedName = name.trim()
    const isFull = remainingSpots(capacity, comingCount) === 0
    const canSubmit = trimmedName !== '' && !isFull && !createMutation.isPending


    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!canSubmit) return

        createMutation.mutate(
            { eventId, name: trimmedName, status},
            {
                onSuccess: () => {
                    setName('')
                    setStatus('registered')
                },
            },
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-white p-6">
            <h3 className="font-medium text-foreground">Add a participant</h3>

            <fieldset disabled={isFull} className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Participant name"
                    className="flex-1 rounded-lg border border-border px-3 py-2"
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ParticipantStatus)}
                    className="rounded-lg border border-border px-3 py-2"
                >
                    {PARTICIPANT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {createMutation.isPending ? 'Adding…' : 'Add participant'}
                </button>
            </fieldset>

            {isFull && (
                <p className="mt-3 text-sm text-red-700">This event is full: no spot left for a new participant.</p>
            )}
            {createMutation.isError && (
                <p className="mt-3 text-sm text-red-700">Could not add the participant. Please try again.</p>
            )}
        </form>
    )

}
