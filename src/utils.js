const config = require('./config');

function formatPrice(usd, ngn) {
  if (usd === 0) return 'FREE';
  return `$${usd} (₦${ngn.toLocaleString()})`;
}

function calculateDiscount(price, points) {
  const rate = config.DISCOUNT_RATES[points];
  if (!rate) return { discountedPrice: price, discountPercent: 0 };
  return { discountedPrice: Math.round(price * (1 - rate) * 100) / 100, discountPercent: rate * 100 };
}

function getWebsiteDisplayName(type) {
  const names = {
    banking: '🏦 Online Banking',
    realestate: '🏡 Real Estate',
    comic: '🎨 Comic Platform',
    linktree: '🔗 Linktree',
    portfolio: '👨‍💻 Portfolio'
  };
  return names[type];
}

module.exports = { formatPrice, calculateDiscount, getWebsiteDisplayName };