const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connexion MongoDB Atlas
mongoose.connect('mongodb+srv://puygauthiernathalie:9fsBkQv99KO6GC6b@cluster0.emvgewi.mongodb.net/port?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connexion MongoDB réussie'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'tonSecretIciChangeMoi',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

// Moteur de vues Jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Import des routes
const indexRouter = require('./routes/index');                   // dans routes/
const usersRouter = require('./routes/users');                   // dans routes/
const catwaysRouter = require('./routes/routes/catways');        // dans routes/routes/
const reservationsRouter = require('./routes/routes/reservations'); // dans routes/routes/
const apiRoutes = require('./routes/routes/api');                // dans routes/routes/

// Utilisation des routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/reservations', reservationsRouter);
app.use('/api', apiRoutes);

// Erreur 404
app.use((req, res, next) => {
  next(createError(404));
});

// Erreurs globales
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
