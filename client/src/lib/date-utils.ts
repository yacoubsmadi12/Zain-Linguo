export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return getDateString(date);
}

export function isToday(dateString: string): boolean {
  return dateString === getDateString();
}
