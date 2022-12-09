export function getDaysBetween(a: Date, b: Date): number {
  const difference = Math.abs(+a - +b);
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
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

