const express = require('express');
const router = express.Router();

router.post('/create-order', (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  res.json({
    success: true,
    order: {
      id: orderId,
      amount: amount * 100,
      currency,
      status: 'created'
    }
  });
});

router.post('/verify', (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  res.json({
    success: true,
    payment: {
      id: paymentId || 'pay_' + Date.now(),
      orderId,
      status: 'captured'
    }
  });
});

module.exports = router;
