const mongoose = require('mongoose');

// Remplace par ta chaîne de connexion MongoDB
const mongoUri = 'mongodb+srv://puygauthiernathalie:9fsBkQv99KO6GC6b@cluster0.emvgewi.mongodb.net/port?retryWrites=true&w=majority';

// Schéma simplifié Catway (juste l'id pour la recherche)
const Catway = mongoose.model('Catway', new mongoose.Schema({
  numero: Number
}), 'catways'); // nom de la collection

// Schéma Reservation
const Reservation = mongoose.model('Reservation', new mongoose.Schema({
  client: String,
  dateDebut: Date,
  dateFin: Date,
  catway: mongoose.Schema.Types.Mixed // ici pour migrer
}), 'reservations');

async function migrate() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connecté à MongoDB');

    // Récupérer toutes les réservations
    const reservations = await Reservation.find({}).exec();

    for (const r of reservations) {
      if (typeof r.catway === 'number') {
        // Trouver le catway correspondant par numero
        const catway = await Catway.findOne({ numero: r.catway }).exec();
        if (catway) {
          r.catway = catway._id;
          await r.save();
          console.log(`Migration réservation ${r._id} : numéro ${r.catway} -> ObjectId ${catway._id}`);
        } else {
          console.log(`Catway numéro ${r.catway} introuvable pour réservation ${r._id}`);
        }
      }
    }

    console.log('Migration terminée');
    mongoose.disconnect();
  } catch (err) {
    console.error('Erreur migration:', err);
  }
}

migrate();
