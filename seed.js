const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

const uri = "mongodb+srv://puygauthiernathalie:9fsBkQv99KO6GC6b@cluster0.emvgewi.mongodb.net/port?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db('port');
}

async function seed() {
  try {
    const db = await connectDB();

    // Charger les fichiers JSON
    const catwaysData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'catways.json')));
    const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'reservations.json')));

    // Nettoyer les collections
    await db.collection('catways').deleteMany({});
    await db.collection('reservations').deleteMany({});

    // Insérer les catways avec clé 'numero'
    const catways = catwaysData.map(c => ({
      numero: c.catwayNumber,
      catwayType: c.catwayType,
      catwayState: c.catwayState
    }));
    const result = await db.collection('catways').insertMany(catways);

    // Créer une map { numero => _id }
    const catwayMap = {};
    Object.entries(result.insertedIds).forEach(([index, id]) => {
      const numero = catwaysData[index].catwayNumber;
      catwayMap[numero] = id;
    });

    // Adapter les réservations
    const adaptedReservations = reservationsData.map(r => {
      const catwayId = catwayMap[r.catwayNumber];
      if (!catwayId) return null; // ignore si pas de catway trouvé
      return {
        catway: catwayId,
        client: r.clientName,
        boatName: r.boatName,
        dateDebut: new Date(r.startDate),
        dateFin: new Date(r.endDate)
      };
    }).filter(Boolean); // Supprime les null

    // Insérer les réservations transformées
    await db.collection('reservations').insertMany(adaptedReservations);

    console.log('✅ Seed terminé : catways et reservations insérés correctement.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seed:', err);
    process.exit(1);
  }
}

seed();
