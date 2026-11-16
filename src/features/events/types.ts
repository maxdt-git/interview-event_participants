export type AppEvent = {
    id: string
    name: string
    date: string
    location: string
    capacity: number
}

export type ApiEvent = {
    id: string
    name: string
    startsAt: number
    endsAt: number
    location: unknown
    capacity: number
}
