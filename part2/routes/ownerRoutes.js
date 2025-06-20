const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async (req, res) => {
    if(!req.session.user){
        return res.status(401); //will resolve the force browsing later
    }
  try {
    const OwnerId = req.session.
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
module.exports = router;