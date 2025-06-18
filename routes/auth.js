const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).render('login', { error: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).render('login', { error: 'Email ou mot de passe incorrect' });
    }

    req.session.user = {
      email: user.email,
      role: user.role || 'standard'
    };

    res.redirect('/users'); // page protégée après login
  } catch (error) {
    console.error(error);
    res.status(500).render('login', { error: 'Erreur interne du serveur' });
  }
});

module.exports = router;

