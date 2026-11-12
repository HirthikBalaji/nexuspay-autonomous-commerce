export const FX_RATE_USD_TO_INR = 86.85;

let currentCurrency = typeof window !== 'undefined' 
  ? (localStorage.getItem('nexuspay_currency') || 'USD') 
  : 'USD';

export function getActiveCurrency() {
  return currentCurrency;
}

export function setActiveCurrency(currency) {
  currentCurrency = currency;
  if (typeof window !== 'undefined') {
    localStorage.setItem('nexuspay_currency', currency);
    window.dispatchEvent(new CustomEvent('currency_change', { detail: currency }));
  }
}

export function formatCurrency(amount, explicitCurrency = null) {
  const targetCurrency = explicitCurrency || currentCurrency;
  const num = Number(amount) || 0;

  if (targetCurrency === 'INR') {
    const inrValue = num * FX_RATE_USD_TO_INR;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(inrValue);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDualCurrency(amount) {
  const num = Number(amount) || 0;
  const inrValue = num * FX_RATE_USD_TO_INR;
  const inrFormatted = `₹${inrValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const usdFormatted = `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (currentCurrency === 'INR') {
    return `${inrFormatted} (~${usdFormatted} USD)`;
  }
  return `${usdFormatted} (~${inrFormatted} INR)`;
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
