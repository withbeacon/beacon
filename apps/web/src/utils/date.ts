type FormatType = "monthly" | "weekly" | "daily";

export function formatDate(date: Date, formatType: FormatType): string {
  switch (formatType) {
    case "monthly": {
      return date.toLocaleString("en-US", {
        month: "short",
      });
    }

    case "weekly": {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    case "daily": {
      return `${date.getDate() === 1 ? "" : "0"}${date.getDate()}`;
    }
  }
}
export function date(): Date {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);

  return d;
}

export function diffInDays(a: Date, b: Date): number {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function fromNow(days?: number) {
  return new Date(new Date().setDate(new Date().getDate() - (days || 0)));
}

