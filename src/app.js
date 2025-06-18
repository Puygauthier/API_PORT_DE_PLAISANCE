 const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');

const app = express();

// Moteur de vues (les vues sont à la racine)
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-moi-pour-la-prod',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// Fichiers statiques dans le dossier public (hors de src)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Import des routes (en dehors de src)
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const catwaysRouter = require('../routes/routes/catways');
const reservationViewRouter = require('../routes/reservationsView');
const authRouter = require('../routes/auth');
const apiRouter = require('../routes/routes/api');

// Utilisation des routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/reservation', reservationViewRouter);
app.use('/login', authRouter);
app.use('/logout', authRouter);
app.use('/api', apiRouter);

// Gestion 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Gestion des erreurs
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
