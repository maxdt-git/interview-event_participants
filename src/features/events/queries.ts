import { useQuery } from '@tanstack/react-query'
import { getEvent, getEvents } from './api'

export const eventKeys = {
  all: ['events'] as const,
  detail: (id: string) => ['events', id] as const,
}

export function useEvents() {
    return useQuery({
      queryKey: eventKeys.all,
      queryFn: getEvents,
    })
}

export function useEvent(eventId: string) {
    return useQuery({
      queryKey: eventKeys.detail(eventId),
      queryFn: () => getEvent(eventId),
      enabled: eventId !== '',
    })
}
