import { Link, useParams } from 'react-router'
import { useEvent } from '../features/events/queries'
import { useDeleteParticipant, useParticipants, useUpdateParticipantStatus } from '../features/participants/queries'
import { Button } from '../components/Button'
import { canChange, countComing, remainingSpots } from '../features/participants/rules'
import { ApiError } from '../api/client'
import { formatDate } from '../lib/format'
import { ParticipantsList } from '../components/ParticipantsList'
import { useState } from 'react'
import { matchesSearch } from '../features/participants/search'
import type { Participant, ParticipantStatus } from '../features/participants/types'
import { AddParticipantForm } from '../components/AddParticipantForm'

export default function EventPage() {
  const { eventId = '' } = useParams()
  const eventQuery = useEvent(eventId)
  const participantsQuery = useParticipants(eventId)
  const [search, setSearch] = useState('')
  const updateStatus = useUpdateParticipantStatus(eventId)
  const deleteMutation = useDeleteParticipant(eventId)
  const isMutating = updateStatus.isPending || deleteMutation.isPending

  if (!eventId) return <p>Not found</p>
  if (eventQuery.isPending || participantsQuery.isPending) return <p>Loading...</p>
  if (eventQuery.error instanceof ApiError && eventQuery.error.status === 404) {
    return <p>Event not found</p>
  }
  if (eventQuery.error) return (
    <div>
        <p>Error</p>
        <Button onClick={() => eventQuery.refetch()}>Retry</Button>
    </div>
  )

  if (participantsQuery.error) return (
    <div>
        <p>Error</p>
        <Button onClick={() => participantsQuery.refetch()}>Retry</Button>
    </div>
  )

  const event = eventQuery.data
  const participants = participantsQuery.data

  const comingCount = countComing(participants)
  const spotsLeft = remainingSpots(event.capacity, comingCount)
  const isFull = spotsLeft === 0
  const filteredParticipants = participants.filter((participant) => matchesSearch(participant, search))

  function handleStatusChange(participant: Participant, status: ParticipantStatus) {
    if (!canChange(event.capacity, comingCount, participant.status, status)) return
    updateStatus.mutate({ id: participant.id, status })
  }

  function handleDelete(participant: Participant) {
    const confirmed = window.confirm(`Delete ${participant.name}? This cannot be undone.`)
    if (!confirmed) return
    deleteMutation.mutate(participant.id)
  }

  return (
    <div>
      <Link to='/' className='mt-4 inline-block text-primary hover:underline mb-6'>
        ← Back to events
      </Link>
      <p className='text-xs font-bold uppercase text-primary'>Event</p>
      <div className='mt-2 text-foreground'>
        <h1 className='font-display text-4xl font-extrabold'>{event.name}</h1>

        <div className='mt-2 text-lg text-muted-foreground'>
          {event.location && <p>{event.location}</p>}
          <p>{formatDate(event.date)}</p>
        </div>

        <div className='mt-8 rounded-2xl border border-border bg-white p-6'>
          <p className='text-2xl font-bold '>
            {comingCount} / {event.capacity} coming
          </p>
          {isFull ? (
            <span className='rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700'>
                Full
            </span>
            ) : (
              <p className='mt-2 text-muted-foreground'>
                {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
              </p>
            )}
        </div>
      </div>
      <div>
        <h2 className='mt-10 font-display text-2xl font-extrabold'>Participants</h2>

        <AddParticipantForm eventId={event.id} capacity={event.capacity} comingCount={comingCount}/>

        <input
          type='search'
          className=' mt-4 w-full max-w-sm rounded-lg border border-border px-3 py-2'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"/>

        {updateStatus.isError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            Could not update the status. Please try again.
          </p>
        )}

        {deleteMutation.isError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            Could not delete the participant. Please try again.
          </p>
        )}

        {filteredParticipants.length === 0 && search.trim() !== '' ? (
          <p className="mt-4 text-muted-foreground">No participants match "{search}".</p>
            ) : (
          <ParticipantsList
            participants={filteredParticipants}
            capacity={event.capacity}
            comingCount={comingCount}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            disabled={isMutating}/>
        )}

      </div>
    </div>
  )
}
