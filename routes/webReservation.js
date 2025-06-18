const express = require('express');
const router = express.Router();
const reservationController = require('../../controllers/reservationController');

// Route pour afficher la page des réservations avec recherche par numéro de catway
router.get('/', reservationController.renderReservationList);

module.exports = router;
