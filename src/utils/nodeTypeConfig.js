export const NODE_TYPE_CONFIG = {
  walkway:   { color: '#94a3b8', strokeColor: '#64748b', label: 'Walkway',   radius: 10 },
  entry:     { color: '#22c55e', strokeColor: '#15803d', label: 'Entry',     radius: 12 },
  exit:      { color: '#ef4444', strokeColor: '#b91c1c', label: 'Exit',      radius: 12 },
  escalator: { color: '#f59e0b', strokeColor: '#d97706', label: 'Escalator', radius: 11 },
  stairs:    { color: '#fb923c', strokeColor: '#ea580c', label: 'Stairs',    radius: 11 },
  lift:      { color: '#8b5cf6', strokeColor: '#7c3aed', label: 'Lift',      radius: 11 },
  junction:  { color: '#3b82f6', strokeColor: '#2563eb', label: 'Junction',  radius: 9  },
}

const DEFAULT_CONFIG = { color: '#cbd5e1', strokeColor: '#94a3b8', label: 'Node', radius: 10 }

export const getNodeConfig = (nodeType) =>
  NODE_TYPE_CONFIG[nodeType?.toLowerCase()] ?? DEFAULT_CONFIG
