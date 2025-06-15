const express = require('express');
const router = express.Router({ mergeParams: true }); // Récupérer :id du catway
const Reservation = require('../../models/reservation');

// GET liste toutes les réservations pour un catway
router.get('/', async (req, res) => {
  const catwayId = req.params.id;
  try {
    const reservations = await Reservation.find({ catway: catwayId });
    res.render('reservations/list', {
      title: 'Liste des Réservations',
      reservations,
      catwayId,
      error: null,
      success: req.query.success || null,
    });
  } catch (err) {
    res.render('reservations/list', {
      title: 'Liste des Réservations',
      reservations: [],
      catwayId,
      error: 'Erreur chargement des réservations',
      success: null
    });
  }
});

// GET détail d'une réservation
router.get('/:idReservation', async (req, res) => {
  const { id: catwayId, idReservation } = req.params;
  try {
    const reservation = await Reservation.findById(idReservation);
    if (!reservation) return res.status(404).send('Réservation non trouvée');
    res.render('reservations/detail', { title: 'Détail Réservation', reservation, catwayId, error: null });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// GET formulaire édition réservation
router.get('/:idReservation/edit', async (req, res) => {
  const { id: catwayId, idReservation } = req.params;
  try {
    const reservation = await Reservation.findById(idReservation);
    if (!reservation) return res.status(404).send('Réservation non trouvée');
    res.render('reservations/edit', { title: 'Modifier Réservation', reservation, catwayId, error: null });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// POST création nouvelle réservation
router.post('/', async (req, res) => {
  const catwayId = req.params.id;
  const { nomClient, dateDebut, dateFin } = req.body;

  try {
    const reservation = new Reservation({ catway: catwayId, nomClient, dateDebut, dateFin });
    await reservation.save();
    // Redirection avec message succès
    res.redirect(`/catways/${catwayId}/reservations?success=${encodeURIComponent('Réservation ajoutée avec succès !')}`);
  } catch (err) {
    // Redirection avec message erreur
    res.redirect(`/catways/${catwayId}/reservations?error=${encodeURIComponent('Erreur lors de l’ajout de la réservation.')}`);
  }
});

// POST mise à jour d'une réservation (avec override méthode PUT dans formulaire)
router.post('/:idReservation', async (req, res) => {
  const { id: catwayId, idReservation } = req.params;
  const { nomClient, dateDebut, dateFin } = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(idReservation, { nomClient, dateDebut, dateFin }, { new: true });
    if (!reservation) return res.status(404).send('Réservation non trouvée');
    res.redirect(`/catways/${catwayId}/reservations?success=${encodeURIComponent('Réservation mise à jour avec succès !')}`);
  } catch (err) {
    res.redirect(`/catways/${catwayId}/reservations?error=${encodeURIComponent('Erreur lors de la mise à jour de la réservation.')}`);
  }
});

// POST suppression d'une réservation (méthode override DELETE)
router.post('/:idReservation/delete', async (req, res) => {
  const { id: catwayId, idReservation } = req.params;

  try {
    const result = await Reservation.findByIdAndDelete(idReservation);
    if (!result) return res.status(404).send('Réservation non trouvée');
    res.redirect(`/catways/${catwayId}/reservations?success=${encodeURIComponent('Réservation supprimée avec succès !')}`);
  } catch (err) {
    res.redirect(`/catways/${catwayId}/reservations?error=${encodeURIComponent('Erreur lors de la suppression de la réservation.')}`);
  }
});

module.exports = router;
