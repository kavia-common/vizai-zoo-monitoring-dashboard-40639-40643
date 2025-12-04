//
// PUBLIC_INTERFACE
// Common formatting helpers for dates, times, and numbers with safe fallbacks.
//

// PUBLIC_INTERFACE
export function formatDate(date, locale = undefined, options = {}) {
  const d = toDate(date);
  if (!d) return '';
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options,
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

// PUBLIC_INTERFACE
export function formatTime(date, locale = undefined, options = {}) {
  const d = toDate(date);
  if (!d) return '';
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    }).format(d);
  } catch {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}

// PUBLIC_INTERFACE
export function formatDateTime(date, locale = undefined, options = {}) {
  const d = toDate(date);
  if (!d) return '';
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    }).format(d);
  } catch {
    return `${formatDate(d)} ${formatTime(d)}`;
  }
}

// PUBLIC_INTERFACE
export function formatNumber(n, locale = undefined, options = {}) {
  const v = toNumber(n);
  if (v === null) return '';
  try {
    return new Intl.NumberFormat(locale, options).format(v);
  } catch {
    return String(v);
  }
}

// PUBLIC_INTERFACE
export function formatPercent(n, locale = undefined, digits = 1) {
  const v = toNumber(n);
  if (v === null) return '';
  try {
      return new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v);
  } catch {
      return `${(v * 100).toFixed(digits)}%`;
  }
}

function toDate(input) {
  if (input instanceof Date) return input;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}
function toNumber(n) {
  const v = typeof n === 'string' ? Number(n) : n;
  return Number.isFinite(v) ? v : null;
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatPercent,
};
