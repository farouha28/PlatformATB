const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Home page route
router.get('/', (req, res) => {
    res.render("index");
});

// Registration page route
router.get('/register', (req, res) => {
    res.render("register");
});

// Login page route
router.get('/login', (req, res) => {
    res.render("login");
});

// Add stagiaire page route with encadrants fetching
router.get('/add-stagiaire', authController.getAddStagiairePage);

// Add encadrant page route
router.get('/add-encadrant', (req, res) => {
    res.render("add-encadrant");
});

// Add chef de département page route
router.get('/add-chef', (req, res) => {
    res.render("add-chef");
});

// Updated dashboard route
router.get('/dashboard', authController.dashboard);

// Stagiaire routes
router.get('/modify-stagiaire/:id', authController.getModifyStagiairePage); // Update this line
router.post('/modify-stagiaire/:id', authController.modifyStagiaire);
router.get('/delete-stagiaire/:id', authController.deleteStagiaire);
router.get('/send-email-to-encadrant/:stagiaireId', authController.sendEmailToEncadrant);

// Encadrant routes
router.get('/modify-encadrant/:id', authController.modifyEncadrantForm);
router.post('/modify-encadrant/:id', authController.modifyEncadrant);
router.get('/delete-encadrant/:id', authController.deleteEncadrant);

// Chef de département routes
router.get('/modify-chef/:id', authController.modifyChefForm);
router.post('/modify-chef/:id', authController.modifyChef);
router.get('/delete-chef/:id', authController.deleteChef);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
