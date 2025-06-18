const Reservation = require('../models/reservation');

/**
 * Récupère toutes les réservations pour un catway donné
 */
async function getReservationsByCatway(catwayId) {
  return Reservation.find({ catway: catwayId });
}

/**
 * Récupère une réservation par son ID et catway
 */
async function getReservationById(catwayId, reservationId) {
  return Reservation.findOne({ _id: reservationId, catway: catwayId });
}

/**
 * Crée une réservation liée à un catway
 */
async function createReservation(catwayId, reservationData) {
  const newReservation = new Reservation({ ...reservationData, catway: catwayId });
  return newReservation.save();
}

/**
 * Met à jour une réservation d’un catway
 */
async function updateReservation(catwayId, reservationId, updates) {
  return Reservation.findOneAndUpdate(
    { _id: reservationId, catway: catwayId },
    updates,
    { new: true }
  );
}

/**
 * Supprime une réservation d’un catway
 */
async function deleteReservation(catwayId, reservationId) {
  return Reservation.findOneAndDelete({ _id: reservationId, catway: catwayId });
}

/**
 * Récupère toutes les réservations (sans filtrage)
 */
async function getAllReservations() {
  return Reservation.find();
}

module.exports = {
  getReservationsByCatway,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getAllReservations, // <- ajouté ici
};
