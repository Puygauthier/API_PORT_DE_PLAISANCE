const catwayService = require('../services/catwayService');

/**
 * Affiche tous les catways
 */
exports.getAllCatways = async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.json(catways);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Affiche un catway par ID
 */
exports.getCatwayById = async (req, res) => {
  try {
    const catway = await catwayService.getCatwayById(req.params.id);
    if (!catway) return res.status(404).json({ message: 'Catway non trouvé' });
    res.json(catway);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Crée un nouveau catway
 */
exports.createCatway = async (req, res) => {
  try {
    const newCatway = await catwayService.createCatway(req.body);
    res.status(201).json(newCatway);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Met à jour un catway existant
 */
exports.updateCatway = async (req, res) => {
  try {
    const updatedCatway = await catwayService.updateCatway(req.params.id, req.body);
    if (!updatedCatway) return res.status(404).json({ message: 'Catway non trouvé' });
    res.json(updatedCatway);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * Supprime un catway
 */
exports.deleteCatway = async (req, res) => {
  try {
    const deletedCatway = await catwayService.deleteCatway(req.params.id);
    if (!deletedCatway) return res.status(404).json({ message: 'Catway non trouvé' });
    res.json({ message: 'Catway supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
