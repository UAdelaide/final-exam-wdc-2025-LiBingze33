const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async (req, res) => {
    if(!req.session.user){
        return res.status(401); //will resolve the force browsing later
    }
  try {
    const OwnerId = req.session.user.user_id;
    const [dogs] = await db.query('SELECT dog_id, name FROM Dogs where owner_id = ?', [OwnerId]);
    res.json(dogs);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});
module.exports = router;