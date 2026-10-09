/** Formats an ISO timestamp as a short Swedish date and time, or "—" if missing. */
export function formatDate(dateString: string): string {
  if (!dateString) {
    return "—";
  }
  return new Date(dateString).toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
