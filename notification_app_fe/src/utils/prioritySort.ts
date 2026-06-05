export interface RawNotification {
  ID: string
  Type: 'Placement' | 'Result' | 'Event'
  Message: string
  Timestamp: string
}

const TYPE_WEIGHTS: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
}

export function getTopPriorityNotifications(notifications: RawNotification[], n: number = 10): RawNotification[] {
  return [...notifications]
    .map(item => ({
      item,
      time: new Date(item.Timestamp).getTime(),
      weight: TYPE_WEIGHTS[item.Type] || 0
    }))
    .sort((a, b) => {
      if (a.time !== b.time) {
        return b.time - a.time
      }
      return b.weight - a.weight
    })
    .map(mapped => mapped.item)
    .slice(0, n)
}
