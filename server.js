const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware pour journaliser les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware pour analyser les formulaires
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques depuis /public
app.use(express.static(path.join(__dirname, 'public')));

// Route de documentation (simple HTML statique)
app.get('/docs', (req, res) => {
  res.send(`
    <h2>📚 Documentation de l'API</h2>
    <ul>
      <li>GET /api/catways</li>
      <li>GET /api/reservations</li>
    </ul>
    <a href="/">⬅ Retour à l'accueil</a>
  `);
});

// Traitement de la connexion (exemple simple)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // ⚠️ À remplacer par une vraie authentification plus tard
  if (username === 'admin' && password === '1234') {
    res.redirect('/tableau-de-bord.html');
  } else {
    res.send('❌ Échec de la connexion. <a href="/">Retour</a>');
  }
});

// Routes API (MongoDB)
const apiRoutes = require('./routes/routes/api');
app.use('/api', apiRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
