const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  client: String,
  dateDebut: Date,
  dateFin: Date,
  catway: {
    type: Schema.Types.ObjectId,  // <-- changer Number en ObjectId
    required: true,
    ref: 'Catway'
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
