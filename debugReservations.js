// debugReservations.js
const mongoose = require('mongoose');
const Reservation = require('./models/reservation');
const Catway = require('./models/catway');

mongoose.connect('mongodb+srv://puygauthiernathalie:9fsBkQv99KO6GC6b@cluster0.emvgewi.mongodb.net/port')
  .then(async () => {
    console.log('✅ Connecté à MongoDB');

    const reservations = await Reservation.find().populate('catway').lean();

    console.log('📋 Réservations :');
    reservations.forEach(r => {
      console.log({
        id: r._id,
        client: r.client,
        dateDebut: r.dateDebut,
        dateFin: r.dateFin,
        catway: r.catway?.numero || 'non trouvé'
      });
    });

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Erreur :', err);
  });
