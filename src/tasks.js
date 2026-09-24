const VIP_DISCOUNT = 0.1;

function calculateTotal(price, quantity, customerType) {
  if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
    throw new Error('price and quantity must be numbers');
  }

  if (price < 0 || quantity < 0) {
    throw new Error('price and quantity must be >= 0');
  }

  const subtotal = price * quantity;
  return customerType === 'vip' ? subtotal * (1 - VIP_DISCOUNT) : subtotal;
}

module.exports = {
  calculateTotal,
};

// The API key should come from an environment variable such as process.env.API_KEY,
// never from a hard-coded secret in source code.
