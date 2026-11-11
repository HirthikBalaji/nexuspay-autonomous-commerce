export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function truncateHash(hash, startLen = 6, endLen = 4) {
  if (!hash) return '';
  if (hash.length <= startLen + endLen) return hash;
  return `${hash.substring(0, startLen)}...${hash.substring(hash.length - endLen)}`;
}

export function formatRelativeTime(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.round((now - date) / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
}
