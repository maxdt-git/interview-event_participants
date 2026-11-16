import { canChange } from '../features/participants/rules'
import { PARTICIPANT_STATUSES, type Participant, type ParticipantStatus } from '../features/participants/types'

type ParticipantsListProps = {
  participants: Participant[]
  capacity: number
  comingCount: number
  onStatusChange: (participant: Participant, status: ParticipantStatus) => void
  onDelete: (participant: Participant) => void
  disabled: boolean
}

export function ParticipantsList({ participants, capacity, comingCount, onStatusChange, onDelete, disabled }: ParticipantsListProps) {
  if (participants.length === 0) {
    return <p className="text-muted-foreground">No participants yet.</p>
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="font-medium text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-3">{p.name}</td>
              <td className="px-4 py-3">
                <select
                  value={p.status}
                  disabled={disabled}
                  onChange={(e) => onStatusChange(p, e.target.value as ParticipantStatus)}
                  className="disabled:opacity-50"
                >
                  {PARTICIPANT_STATUSES.map((status) => (
                    <option key={status} value={status} disabled={!canChange(capacity, comingCount, p.status, status)}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className='px-4 py-3 text-right'>
                <button
                  disabled={disabled}
                  type='button'
                  onClick={() => onDelete(p)}
                  className='text-sm font-medium text-red-600 hover:text-red-800 hover:underline'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
