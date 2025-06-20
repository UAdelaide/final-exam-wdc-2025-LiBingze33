const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async(req, res) = {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

module.exports = router;