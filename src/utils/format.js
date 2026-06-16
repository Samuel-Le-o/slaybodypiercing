// src/utils/format.js

/**
 * Formats a raw number into a stylized Ghana Cedi currency string.
 * @param {number} amount - The numeric price value
 * @returns {string} - e.g., "GH₵ 350.00" or "GH₵ 350"
 */
export const formatCedi = (amount) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0, // Set to 2 if you want to explicitly show pesewas (e.g. .00)
    maximumFractionDigits: 2,
  }).format(amount);
};