const mongoose = require('mongoose');

const uri = 'mongodb+srv://puygauthiernathalie:9fsBkQv99KO6GC6b@cluster0.emvgewi.mongodb.net/port';
mongoose.connect(uri)
  .then(async () => {
    console.log('✅ Connecté à MongoDB');

    const results = await mongoose.connection.db
      .collection('reservations')
      .find({ catway: { $type: 'int' } })
      .toArray();

    if (results.length === 0) {
      console.log('✅ Aucun champ catway de type "int" trouvé. Migration OK.');
    } else {
      console.log(`❌ ${results.length} réservations ont encore un catway en int :`);
      console.log(results);
    }

    mongoose.disconnect();
  })
  .catch(console.error);
