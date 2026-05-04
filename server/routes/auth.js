const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length !== 10) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 300000);

    let user = await User.findOne({ phone });
    
    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = new User({ phone, otp, otpExpiry });
      await user.save();
    }

    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      phone: phone.slice(0, 3) + '****' + phone.slice(7)
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ 
      phone, 
      otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || 'madurai_one_secret_key_2024',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        language: user.language,
        blindMode: user.blindMode,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'madurai_one_secret_key_2024');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      phone: user.phone,
      language: user.language,
      blindMode: user.blindMode,
      location: user.location
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'madurai_one_secret_key_2024');
    const { language, blindMode, location } = req.body;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (language) user.language = language;
    if (blindMode !== undefined) user.blindMode = blindMode;
    if (location) user.location = location;

    await user.save();

    res.json({
      id: user._id,
      phone: user.phone,
      language: user.language,
      blindMode: user.blindMode,
      location: user.location
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
