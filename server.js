const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

const authController = require('./controllers/auth');

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', authController.register);
app.post('/login', authController.login);

// Middleware pour vérifier l'authentification
const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
};

// Middleware pour vérifier le rôle
const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).send('Access Denied: You do not have the correct role');
    }
    next();
};

// Routes protégées par rôle
app.get('/encadrant-only', ensureAuthenticated, checkRole(['encadrant', 'chef-departement']), (req, res) => {
    res.send('This is a protected route for Encadrants and Chef-departements');
});

app.get('/stagiaire-only', ensureAuthenticated, checkRole(['stagiaire']), (req, res) => {
    res.send('This is a protected route for Stagiaires');
});

// Routes de test
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
