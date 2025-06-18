// deleteEmptyReservations.js
const mongoose = require('mongoose');
const Reservation = require('./models/reservation');

mongoose.connect('mongodb+srv://puygauthiernathalie:9fsBkQv99KO6GC6b@cluster0.emvgewi.mongodb.net/port')
  .then(async () => {
    console.log('✅ Connecté à MongoDB');

    const result = await Reservation.deleteMany({
      $or: [
        { client: { $exists: false } },
        { dateDebut: { $exists: false } },
        { dateFin: { $exists: false } },
        { catway: { $exists: false } }
      ]
    });

    console.log(`🧹 Réservations supprimées : ${result.deletedCount}`);
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Erreur :', err));
