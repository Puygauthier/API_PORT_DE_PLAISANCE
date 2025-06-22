require('dotenv').config(); // Charger les variables d'environnement en premier

const app = require('./app'); // <-- Correction ici
const mongoose = require('mongoose');
const http = require('http');

// Port
const PORT = process.env.PORT || 3000;

// Encodage du mot de passe pour éviter les problèmes dans l'URL
const password = encodeURIComponent('14Mars1973.');
const mongoUri = process.env.MONGODB_URI || `mongodb+srv://puygauthiernathalie:${password}@cluster0.mao9joz.mongodb.net/port?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connexion MongoDB réussie');

    // Démarrage du serveur une fois connecté à MongoDB
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB :', err);
    process.exit(1);
  });
