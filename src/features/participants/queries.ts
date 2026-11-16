import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createParticipant, deleteParticipant, getParticipants, updateParticipant } from './api'
import type { NewParticipant, ParticipantStatus } from './types'


export const participantKeys = {
  all: ['participants'] as const,
  byEvent: (eventId: string) => ['participants', 'byEvent', eventId] as const,
}

export function useParticipants(eventId: string) {
    return useQuery({
      queryKey: participantKeys.byEvent(eventId),
      queryFn: () => getParticipants(eventId),
      enabled: eventId !== '',
    })
}

export function useUpdateParticipantStatus(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ParticipantStatus }) =>
      updateParticipant(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: participantKeys.byEvent(eventId) })
  })
}

export function useDeleteParticipant(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteParticipant(eventId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: participantKeys.byEvent(eventId) })
  })
}

export function useCreateParticipant(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: NewParticipant) => createParticipant(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: participantKeys.byEvent(eventId) })
  })
}
