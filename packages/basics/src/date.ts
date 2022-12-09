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

export function getDaysBetween(a: Date, b: Date): number {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function fromNow(days?: number) {
  return new Date(new Date().setDate(new Date().getDate() - (days || 0)));
}

export function getWeeksBetween(a: Date, b: Date): number {
  const difference = Math.abs(+a - +b);
  return Math.ceil(difference / (1000 * 60 * 60 * 24 * 7));
}

export function getMonthsBetween(a: Date, b: Date): number {
  const difference = Math.abs(+a - +b);
  return Math.ceil(difference / (1000 * 60 * 60 * 24 * 30));
}

export function getDateFormat(from: Date): "daily" | "weekly" | "monthly" {
  const days = getDaysBetween(from, new Date());

  if (days < 60) {
    return "daily";
  } else if (days < 180) {
    return "weekly";
  } else {
    return "monthly";
  }
}

export function addDays(date: Date, days: number): Date {
  const result = toDay(new Date(date));
  result.setDate(result.getDate() + days);

  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function addMonths(date: Date, months: number): Date {
  const result = toMonth(new Date(date));
  result.setMonth(result.getMonth() + months);

  return result;
}

export function toDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toMonth(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
}

export function toWeek(date: Date): Date {
  const day = date.getDay();
  const difference = date.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(date.setDate(difference));
}

