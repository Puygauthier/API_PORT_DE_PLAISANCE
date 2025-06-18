const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userService = require('../services/userService'); // utilisé pour la vue

// ✅ Route : afficher la vue Jade avec la liste des utilisateurs
router.get('/view', async (req, res) => {
  try {
    const users = await userService.getAllUsers(); // on masque les mots de passe dans le service
    res.render('users', { users });
  } catch (err) {
    res.status(500).send('Erreur lors du chargement des utilisateurs');
  }
});

// ✅ Route : créer un nouvel utilisateur (JSON)
router.post('/', userController.createUser);

// ✅ Route : récupérer tous les utilisateurs (JSON)
router.get('/', userController.getAllUsers);

// ✅ Route : récupérer un utilisateur par son email (JSON)
router.get('/:email', userController.getUserByEmail);

// ✅ Route : mettre à jour un utilisateur (JSON)
router.put('/:email', userController.updateUser);

// ✅ Route : supprimer un utilisateur (JSON)
router.delete('/:email', userController.deleteUser);

module.exports = router;
