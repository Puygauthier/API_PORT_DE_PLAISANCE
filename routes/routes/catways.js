const express = require('express');
const router = express.Router();
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

// GET /catways/list - Affiche la liste en 2 colonnes
router.get('/list', async (req, res) => {
  try {
    const catways = await Catway.find();
    const half = Math.ceil(catways.length / 2);
    res.render('catwayList', {
      title: 'Liste des Catways',
      catways,
      half
    });
  } catch (err) {
    res.status(500).send("Erreur lors du chargement de la liste des catways.");
  }
});

// Sous-routes réservations (imbriquées)
const reservationRoutes = require('./reservations');
router.use('/:id/reservations', reservationRoutes);

module.exports = router;
