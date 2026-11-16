# Event Participants

A small event management app: browse events and manage their participants (create, delete,
change status, search) while the event capacity is always respected.

Built with **React 19**, **TypeScript**, **TanStack Query**, **React Router** and **Tailwind CSS v4**.

## Setup instructions

**Prerequisites**: Node.js 22 (or 20.19+) and npm.

```bash
git clone git@github.com:maxdt-git/shakerapp-interview.git
cd shakerapp-interview
npm install
cp .env.example .env
npm run dev
```

The app runs on http://localhost:5173. `.env` contains the base URL of the MockAPI project:

```env
VITE_API_URL=https://6af6e339e844c7ff741bbefb.mockapi.io/api
```

| npm | Makefile | Description |
|---|---|---|
| `npm run dev` | `make dev` | Start the dev server |
| `npm run build` | `make build` | Type-check and build for production |
| `npm run lint` | `make lint` | Run ESLint |

## Assumptions made

### Business rules

- A participant is **coming** when their status is `registered`, `confirmed` or `attended`.
  `canceled` participants don't count toward the capacity.
- A change **takes a spot** only when a participant becomes coming while they weren't
  (creation, or `canceled` → coming). Moving between coming statuses, or canceling, never needs one.
- **A full event accepts no new registration**, whatever the status.
- Capacity is checked **twice**: the UI disables what is not allowed (status options, add form),
  and the handlers check again before sending the request.
- Search only filters the displayed list: it never changes the capacity counters.

### API data

The API data doesn't fully match the brief. Every difference is handled once, in the API layer
(`src/features/*/api.ts`), so the rest of the app only uses clean domain types.

| The API returns | Assumption / handling |
|---|---|
| Statuses `"status 1"` … `"status 50"` | Unknown status → treated as `registered`. Conservative choice: it counts toward the capacity, so it can never cause an overbooking. Statuses changed from the app are saved with a valid value. |
| `startsAt` / `endsAt` as Unix timestamps (seconds) | Converted to dates. `endsAt` always equals `startsAt`, so only the start is shown. |
| `location` is a number (same value as `startsAt`) | Not a real place, so it is hidden. A text location would be displayed. |
| `?eventId=1` is a partial match (also returns 10, 11, 21…) | Participants are filtered again on the exact `eventId`. |
| An empty filter result answers **404** | Treated as an empty list. |
| `DELETE /participants/:id` answers 404 | Participants are a child resource: deletion uses `/events/:eventId/participants/:id`. |
| No email field | Search is on the name only. |
| All events are in the past | A "Past" badge is shown, but registrations stay open so every feature can be tested. |

## What I would improve with more time

- **Past-event rules**: close registrations once an event is over, and only allow `attended` /
  `canceled` after it. It would be one more pure rule in `rules.ts`, combined with the capacity rule.
- **UX polish**: a confirmation modal instead of `window.confirm`, success toasts,
  accent-insensitive search ("chloe" → "Chloé"), and search / filters on the events list stored in the URL.
