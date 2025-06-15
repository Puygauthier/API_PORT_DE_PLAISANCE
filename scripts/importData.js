const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb+srv://puygauthiernathalie:gRwKGWCGXbRQHU44@cluster0.gembtqn.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("API_PORT_DE_PLAISANCE");

    // Charger les données JSON depuis /data/
    const catwaysData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'catways.json'), 'utf8'));
    const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'reservations.json'), 'utf8'));

    // Supprimer les anciennes données
    await db.collection('catways').deleteMany({});
    await db.collection('reservations').deleteMany({});

    // Insérer les nouvelles données
    const catwaysResult = await db.collection('catways').insertMany(catwaysData);
    const reservationsResult = await db.collection('reservations').insertMany(reservationsData);

    console.log(`✅ ${catwaysResult.insertedCount} catways insérés.`);
    console.log(`✅ ${reservationsResult.insertedCount} réservations insérées.`);
  } catch (err) {
    console.error("❌ Erreur d'importation :", err);
  } finally {
    await client.close();
    console.log("🔌 Connexion MongoDB fermée.");
  }
}

run();
