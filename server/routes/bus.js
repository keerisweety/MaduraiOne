const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const ROUTE_FARES = {
  'Madurai Junction - Anna Nagar': 25,
  'Madurai Junction - Mattuthavani': 30,
  'Madurai Junction - Goripalayam': 20,
  'Madurai Junction - Thiruparankundram': 35,
  'Madurai Junction - Viswanathapuram': 22,
  'Madurai Junction - K.K. Nagar': 28,
  'Anna Nagar - Mattuthavani': 25,
  'Anna Nagar - Thiruparankundram': 30,
  'Mattuthavani - Goripalayam': 25,
  'Mattuthavani - K.K. Nagar': 20
};

router.post('/calculate-fare', (req, res) => {
  const { busNumber, route } = req.body;

  if (!busNumber || !route) {
    return res.status(400).json({ error: 'Bus number and route are required' });
  }

  const busNumberRegex = /^TN[\s-]?\d{2}[\s-]?[A-Z]{1,2}[\s-]?\d{4}$/i;
  if (!busNumberRegex.test(busNumber.trim())) {
    return res.status(400).json({ error: 'Invalid bus number format. Expected format: TN 45 A 1234' });
  }

  const fare = ROUTE_FARES[route] || 30;

  res.json({
    busNumber: busNumber.toUpperCase(),
    route,
    fare,
    validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  });
});

router.post('/create-ticket', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'madurai_one_secret_key_2024');
    const { busNumber, route, fare, paymentId } = req.body;

    const ticketId = uuidv4().slice(0, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const qrData = JSON.stringify({
      ticketId,
      busNumber,
      route,
      fare,
      userPhone: decoded.phone,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    });

    const qrCode = await QRCode.toDataURL(qrData);

    const ticket = new Ticket({
      userId: decoded.userId,
      busNumber,
      route,
      fare,
      qrData,
      paymentId,
      expiresAt
    });

    await ticket.save();

    res.json({
      success: true,
      ticket: {
        id: ticket._id,
        ticketId,
        busNumber,
        route,
        fare,
        qrCode,
        createdAt: ticket.createdAt,
        expiresAt
      }
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/ticket/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('userId');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const isExpired = new Date() > ticket.expiresAt;

    res.json({
      id: ticket._id,
      ticketId: ticket._id.toString().slice(-8).toUpperCase(),
      busNumber: ticket.busNumber,
      route: ticket.route,
      fare: ticket.fare,
      status: isExpired ? 'expired' : ticket.status,
      createdAt: ticket.createdAt,
      expiresAt: ticket.expiresAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/routes', (req, res) => {
  res.json(Object.keys(ROUTE_FARES));
});

module.exports = router;
