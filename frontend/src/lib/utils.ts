export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function getSeverityBadge(severity: string) {
  return severity === 'critical' ? 'danger' : severity === 'warning' ? 'warning' : 'info';
}

export function getStatusBadge(status: string) {
  return status === 'resolved' ? 'success' : status === 'healing' ? 'purple' : 'warning';
}
