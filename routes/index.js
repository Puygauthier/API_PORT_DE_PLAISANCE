require('dotenv').config(); // charger les variables d'environnement en début de fichier

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // utilise la variable d'environnement

const client = new MongoClient(uri);

async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db('API_PORT_DE_PLAISANCE');
}

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Accueil - Port de Plaisance' });
});

// GET documentation API
router.get('/docs', function(req, res, next) {
  res.render('docs', {
    title: 'Documentation de l’API - Port de Plaisance',
    content1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.`,
    content2: `Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor.`
  });
});

// POST login form
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

// GET dashboard
router.get('/dashboard', async function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const user = req.session.user;
  const dateDuJour = new Date().toLocaleDateString('fr-FR');

  try {
    const db = await connectDB();
    const now = new Date();
    // Récupère réservations en cours
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

// GET logout
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
