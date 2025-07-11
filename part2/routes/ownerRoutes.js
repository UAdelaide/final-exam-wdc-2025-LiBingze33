const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async (req, res) => {
    if(!req.session.user){
        return res.status(401); // will resolve the force browsing later
    }
  try {
    // since user is logged in, just retrieve the id from the session instead of making another database request
    const OwnerId = req.session.user.user_id;
    const [dogs] = await db.query('SELECT dog_id, name FROM Dogs where owner_id = ?', [OwnerId]);
    return res.json(dogs);
  }
  catch(err){
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});
module.exports = router;