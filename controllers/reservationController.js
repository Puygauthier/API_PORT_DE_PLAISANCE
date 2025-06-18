const reservationService = require('../services/reservationService');

/**
 * Liste toutes les réservations d’un catway (API JSON)
 */
exports.getAllReservations = async (req, res) => {
  try {
    const catwayId = req.params.id;
    const reservations = await reservationService.getReservationsByCatway(catwayId);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Récupère une réservation par son ID et catway (API JSON)
 */
exports.getReservation = async (req, res) => {
  try {
    const { id: catwayId, idReservation } = req.params;
    const reservation = await reservationService.getReservationById(catwayId, idReservation);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Crée une nouvelle réservation pour un catway (API JSON)
 */
exports.createReservation = async (req, res) => {
  try {
    const catwayId = req.params.id;
    const reservationData = req.body;
    const newReservation = await reservationService.createReservation(catwayId, reservationData);
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Met à jour une réservation existante (API JSON)
 */
exports.updateReservation = async (req, res) => {
  try {
    const { id: catwayId, idReservation } = req.params;
    const updates = req.body;
    const updatedReservation = await reservationService.updateReservation(catwayId, idReservation, updates);
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(updatedReservation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Supprime une réservation (API JSON)
 */
exports.deleteReservation = async (req, res) => {
  try {
    const { id: catwayId, idReservation } = req.params;
    const deletedReservation = await reservationService.deleteReservation(catwayId, idReservation);
    if (!deletedReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Affiche la page HTML des réservations (Vue Jade)
 */
exports.renderReservationList = async (req, res) => {
  try {
    const catwayId = req.query.catwayId || '';
    const reservations = catwayId
      ? await reservationService.getReservationsByCatway(catwayId)
      : await reservationService.getAllReservations();

    res.render('reservation/list', { reservations, catwayId });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Erreur lors de l’affichage des réservations' });
  }
};
