const express = require('express');
const router = express.Router();

// Correction du chemin du modèle Catway
const Catway = require('../../models/catway');

// GET /catways
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render('catways', {
      title: 'Gestion des Catways',
      catways,
      error: null,
      success: null
    });
  } catch (err) {
    res.render('catways', {
      title: 'Gestion des Catways',
      catways: [],
      error: 'Erreur chargement catways',
      success: null
    });
  }
});

// POST /catways
router.post('/', async (req, res) => {
  const { numero, catwayType, catwayState } = req.body;
  try {
    const catway = new Catway({ numero, catwayType, catwayState });
    await catway.save();
    const catways = await Catway.find();
    res.render('catways', {
      title: 'Gestion des Catways',
      catways,
      error: null,
      success: 'Catway ajouté avec succès !'
    });
  } catch (err) {
    const catways = await Catway.find();
    res.render('catways', {
      title: 'Gestion des Catways',
      catways,
      error: 'Erreur lors de l’ajout du catway.',
      success: null
    });
  }
});

// Monte les routes de réservation comme sous-ressource
const reservationRoutes = require('./reservations');
router.use('/:id/reservations', reservationRoutes);

module.exports = router;
