const express = require('express');
const bcrypt = require('bcrypt'); // <-- Ajout du module bcrypt
const router = express.Router();
const User = require('../models/User');

// Connexion (POST /login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).render('login', { error: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // vérification sécurisée

    if (!isMatch) {
      return res.status(401).render('login', { error: 'Email ou mot de passe incorrect' });
    }

    req.session.user = {
      email: user.email,
      role: user.role || 'standard' // tu peux ajouter un champ "role" si tu veux
    };

    res.redirect('/users'); // ou autre page protégée
  } catch (error) {
    console.error(error);
    res.status(500).render('login', { error: 'Erreur interne du serveur' });
  }
});
