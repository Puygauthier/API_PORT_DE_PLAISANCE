const express = require('express');
const router = express.Router();
const reservationController = require('../../controllers/reservationController');

// GET /catways/:id/reservations
router.get('/', reservationController.getAllReservations);

// GET /catways/:id/reservations/:idReservation
router.get('/:idReservation', reservationController.getReservation);

// POST /catways/:id/reservations
router.post('/', reservationController.createReservation);

// PUT /catways/:id/reservations/:idReservation
router.put('/:idReservation', reservationController.updateReservation);

// DELETE /catways/:id/reservations/:idReservation
router.delete('/:idReservation', reservationController.deleteReservation);

module.exports = router;

