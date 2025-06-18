const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');

// Liste des réservations
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.catwayId) {
      filter.catway = req.query.catwayId;
    }

    let reservations = await Reservation.find(filter).populate('catway').exec();

    reservations = reservations.map(r => {
      const obj = r.toObject();
      obj.dateDebut = obj.dateDebut ? new Date(obj.dateDebut) : null;
      obj.dateFin = obj.dateFin ? new Date(obj.dateFin) : null;
      if (!obj.catway) {
        obj.catway = { _id: 'inconnu', numero: 'inconnu' };
      }
      return obj;
    });

    res.render('reservations/list', {
      title: 'Liste des réservations',
      reservations,
      catwayId: req.query.catwayId || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Erreur lors du chargement des réservations',
      error: req.app.get('env') === 'development' ? err : {}
    });
  }
});

// Formulaire d'ajout
router.get('/catways/:id/reservations/new', (req, res) => {
  res.render('reservations/form', {
    title: 'Ajouter une réservation',
    action: `/api/catways/${req.params.id}/reservations`,
    method: 'POST',
    reservation: {
      client: '',
      dateDebut: '',
      dateFin: ''
    },
    catwayId: req.params.id
  });
});

// Formulaire de modification
router.get('/catways/:catwayId/reservations/:id/edit', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).render('error', { message: 'Réservation non trouvée' });
    }

    res.render('reservations/form', {
      title: 'Modifier la réservation',
      action: `/api/catways/${req.params.catwayId}/reservations?_method=PUT`,
      method: 'POST', // méthode simulée via method-override
      reservation,
      catwayId: req.params.catwayId
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Erreur lors du chargement de la réservation',
      error: req.app.get('env') === 'development' ? err : {}
    });
  }
});

module.exports = router;
