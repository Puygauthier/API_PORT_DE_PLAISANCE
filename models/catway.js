const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
    unique: true
  },
  catwayType: {
    type: String,
    required: true,
    enum: ['long', 'court'] // ou adapte selon ton besoin
  },
  catwayState: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Catway', catwaySchema);


