const Catway = require('../models/catway');

/**
 * Récupère tous les catways
 * @returns {Promise<Array>} - Liste de tous les catways
 */
async function getAllCatways() {
  return await Catway.find();
}

/**
 * Récupère un catway par son identifiant
 * @param {string} id - ID du catway
 * @returns {Promise<Object|null>} - Le catway trouvé ou null
 */
async function getCatwayById(id) {
  return await Catway.findById(id);
}

/**
 * Crée un nouveau catway
 * @param {Object} catwayData - Données du nouveau catway
 * @returns {Promise<Object>} - Catway créé
 */
async function createCatway(catwayData) {
  const newCatway = new Catway(catwayData);
  return await newCatway.save();
}

/**
 * Met à jour un catway existant
 * @param {string} id - ID du catway
 * @param {Object} updates - Données à mettre à jour
 * @returns {Promise<Object|null>} - Catway mis à jour ou null
 */
async function updateCatway(id, updates) {
  return await Catway.findByIdAndUpdate(id, updates, { new: true });
}

/**
 * Supprime un catway
 * @param {string} id - ID du catway à supprimer
 * @returns {Promise<Object|null>} - Catway supprimé ou null
 */
async function deleteCatway(id) {
  return await Catway.findByIdAndDelete(id);
}

module.exports = {
  getAllCatways,
  getCatwayById,
  createCatway,
  updateCatway,
  deleteCatway
};
