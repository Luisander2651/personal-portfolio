/** Status of an entry that can be ongoing or finished (projects, education). */
export type EntryStatus = 'completed' | 'in-progress';

const STATUS_LABELS: Record<EntryStatus, string> = {
  completed: 'Finalizado',
  'in-progress': 'En curso',
};

/** Visible label of a status. */
export function statusLabel(status: EntryStatus): string {
  return STATUS_LABELS[status];
}
