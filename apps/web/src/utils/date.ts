export function formatDate(date: Date): string {
  return [
    date.getDate() +
      ", " +
      date.toLocaleDateString("en-US", { weekday: "short" }),
  ].join();
}

export function date(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  return d;
}

export function diffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


