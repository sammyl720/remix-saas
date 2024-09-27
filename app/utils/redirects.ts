export function isValidRedirectRoute(route?: string | null): route is string {
  return ['pricing'].includes(route?.toLowerCase() ?? '');
}
