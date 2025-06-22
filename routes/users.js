const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userService = require('../services/userService');

// Route pour afficher la page Jade avec la liste des utilisateurs
router.get('/view', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.render('users', { users });
  } catch (err) {
    res.status(500).send('Erreur lors du chargement des utilisateurs');
  }
});

// API JSON
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:email', userController.getUserByEmail);
router.put('/:email', userController.updateUser);
router.delete('/:email', userController.deleteUser);

module.exports = router;
