const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

// Connexion MongoDB Atlas
mongoose.connect('mongodb+srv://puygauthiernathalie:9fsBkQv99KO6GC6b@cluster0.emvgewi.mongodb.net/port?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connexion MongoDB Atlas réussie'))
.catch(err => console.error('Erreur MongoDB :', err));

// Import des routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catwaysRouter = require('./routes/routes/catways');
const reservationRoutes = require('./routes/reservations');
const authRouter = require('./routes/auth'); // Routes pour /login et /logout

// Configuration moteur de vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'tonSecretIciChangeMoi',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 heure
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);                          // CRUD utilisateurs
app.use('/catways', catwaysRouter);                      // Catways
app.use('/catways/:id/reservations', reservationRoutes); // Réservations

app.use('/login', authRouter);   // POST /login
app.use('/logout', authRouter);  // GET /logout

// Gestion des erreurs 404
app.use((req, res, next) => {
  next(createError(404));
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
