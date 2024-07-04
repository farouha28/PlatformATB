const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuration de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'atb' // Remplacez par le nom de votre base de données
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('MySQL Connected...');
});

// Route d'authentification
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', { username, password });

  if (!username || !password) {
    console.log('Username or password not provided');
    return res.status(400).send('Username and password are required');
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).send('Internal server error');
    }

    console.log('Database query results:', results);

    if (results.length === 0) {
      console.log('No user found with provided username');
      return res.status(401).send('Invalid username or password');
    }

    const user = results[0];
    console.log('User record:', user);

    // Comparaison sécurisée des mots de passe avec bcrypt
    const passwordIsValid = await bcrypt.compare(password, user.password);

    console.log('Password is valid:', passwordIsValid);

    if (!passwordIsValid) {
      console.log('Password does not match');
      return res.status(401).send('Invalid username or password');
    }

    // Vérification du rôle de l'utilisateur
    if (user.role !== 'stagiaire') { // Remplacez 'stagiaire' par le rôle attendu
      console.log('User role is not "stagiaire"');
      return res.status(403).send('Access denied');
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, 'Hs+9AEZst1fmKZG7fnP7wMxnVhAB927FA6QDXoIzPfT2zNK9v+YjsTIpYCP/YZN1DyTPgsPnnOKFO1nfukkkeQ==', {
      expiresIn: 86400 // expires in 24 hours
    });

    console.log('Authentication successful, token generated');
    res.status(200).send({ token });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
