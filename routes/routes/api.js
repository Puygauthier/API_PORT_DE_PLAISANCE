const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://puygauthiernathalie:gRwKGWCGXbRQHU44@cluster0.gembtqn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db('API_PORT_DE_PLAISANCE'); // 💡 mets ici le vrai nom de ta base
}

// GET /api/catways
router.get('/catways', async (req, res) => {
  try {
    const db = await connectDB();
    const catways = await db.collection('catways').find().toArray();
    res.json(catways);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catways' });
  }
});

// GET /api/reservations
router.get('/reservations', async (req, res) => {
  try {
    const db = await connectDB();
    const reservations = await db.collection('reservations').find().toArray();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

module.exports = router;
