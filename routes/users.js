const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');

// ✅ Route : afficher la vue utilisateurs (Jade)
router.get('/view', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('users', { users });
  } catch (err) {
    res.status(500).send('Erreur lors du chargement des utilisateurs');
  }
});

// ✅ Route : créer un utilisateur
router.post('/', userController.createUser);

// ✅ Route : lister tous les utilisateurs (JSON)
router.get('/', userController.getAllUsers);

// ✅ Route : récupérer un utilisateur par email (JSON)
router.get('/:email', userController.getUserByEmail);

// ✅ Route : mettre à jour un utilisateur
router.put('/:email', userController.updateUser);

// ✅ Route : supprimer un utilisateur
router.delete('/:email', userController.deleteUser);

module.exports = router;
