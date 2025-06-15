const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://puygauthiernathalie:gRwKGWCGXbRQHU44@cluster0.gembtqn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db('API_PORT_DE_PLAISANCE');
}

/* GET home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Accueil - Port de Plaisance' });
});

/* POST login form */
router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('index', { title: 'Accueil - Port de Plaisance', error: 'Merci de remplir tous les champs' });
  }

  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ email: email });

    if (!user) {
      return res.render('index', { title: 'Accueil - Port de Plaisance', error: 'Utilisateur non trouvé' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render('index', { title: 'Accueil - Port de Plaisance', error: 'Mot de passe incorrect' });
    }

    // Authentification réussie - créer session
    req.session.user = {
      nom: user.nom,
      email: user.email,
      _id: user._id
    };

    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

/* GET dashboard */
router.get('/dashboard', async function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const user = req.session.user;
  const dateDuJour = new Date().toLocaleDateString('fr-FR');

  try {
    const db = await connectDB();
    const now = new Date();
    // On récupère les réservations en cours dans la base
    const allReservations = await db.collection('reservations').find({ dateFin: { $gte: now } }).toArray();

    res.render('tableau-de-bord', {
      title: 'Tableau de Bord',
      user,
      dateDuJour,
      reservationsEnCours: allReservations
    });
  } catch (err) {
    next(err);
  }
});

/* GET logout */
router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
