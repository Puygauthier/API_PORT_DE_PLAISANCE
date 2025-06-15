const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = "mongodb+srv://puygauthiernathalie:gRwKGWCGXbRQHU44@cluster0.gembtqn.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("API_PORT_DE_PLAISANCE");

    const password = 'motdepasse123';  // Choisis un mot de passe simple à tester
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      nom: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      password: hashedPassword
    };

    const result = await db.collection('users').insertOne(user);
    console.log('Utilisateur inséré avec ID:', result.insertedId);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
