import { Link } from 'react-router'
import { useEvents } from '../features/events/queries'
import { formatDate, isPast } from '../lib/format'
import { Button } from '../components/Button'
import { CalendarDays, Users } from 'lucide-react'


function EventsPage() {
  const { data: events, isPending, error, refetch, isFetching } = useEvents()

  if (isPending) return <p className="text-muted-foreground">Loading events…</p>

  if (error) return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <p className="text-foreground">Could not load events.</p>
      <Button onClick={() => refetch()} disabled={isFetching} className="mt-3 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        {isFetching ? 'Retrying…' : 'Retry'}
      </Button>
    </div>
  )

  if (events.length === 0) return <p className="text-muted-foreground">No events yet.</p>

  const sortedEvents = events.toSorted((a, b) => a.date.localeCompare(b.date))

  return (
    <>
    <div className='mb-8'>
      <p className='text-xs font-bold uppercase text-primary'>Events</p>
      <h1 className='mt-2 font-display text-4xl font-extrabold text-foreground'>All events</h1>
    </div>
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sortedEvents.map((event) => (
        <li key={event.id}>
          <Link
            to={`/events/${event.id}`}
            className="group block h-full rounded-2xl border border-border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="flex items-start justify-between">
              <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <CalendarDays className="size-5" />
              </div>
              {isPast(event.date) && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Past
                </span>
              )}
            </div>
            <h2 className="mt-4 font-display text-lg font-extrabold text-foreground group-hover:text-primary">
              {event.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">{formatDate(event.date)}</p>
            {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
              <Users className="size-4 text-primary" />
              {event.capacity} spots
            </div>
          </Link>
        </li>
      ))}
</ul>

    </>
  )
}

export default EventsPage
