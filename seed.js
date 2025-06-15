const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

const uri = "mongodb+srv://puygauthiernathalie:9fsBkQv99KO6GC6b@cluster0.emvgewi.mongodb.net/port?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db('port'); // Le nom de ta base, ici "port"
}

async function seed() {
  try {
    const db = await connectDB();

    // Charger les fichiers JSON
    const catwaysData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'catways.json')));
    const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'reservations.json')));

    // Préparer catways avec la clé 'numero'
    const catways = catwaysData.map(catway => ({
      numero: catway.catwayNumber,
      catwayType: catway.catwayType,
      catwayState: catway.catwayState
    }));

    // Vider les collections
    await db.collection('catways').deleteMany({});
    await db.collection('reservations').deleteMany({});

    // Insérer les données
    await db.collection('catways').insertMany(catways);
    await db.collection('reservations').insertMany(reservationsData);

    console.log('Seed terminé : collections catways et reservations mises à jour.');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors du seed:', err);
    process.exit(1);
  }
}

seed();
