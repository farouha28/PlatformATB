const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', (req, res) => {
    res.render("index");
});

router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/dashboard', (req, res) => {
    res.render("dashboard");
});

router.get('/add-stagiaire', (req, res) => {
    res.render("add-stagiaire");
});

router.get('/add-encadrant', (req, res) => {
    res.render("add-encadrant");
});

router.get('/add-chef', (req, res) => {
    res.render("add-chef");
});

router.get('/dashboard', authController.dashboard);
router.get('/modify-stagiaire/:id', authController.modifyStagiaireForm);
router.post('/modify-stagiaire/:id', authController.modifyStagiaire); // Define POST route for modifying stagiaire
router.get('/delete-stagiaire/:id', authController.deleteStagiaire);

router.post('/modify-encadrant/:id', authController.modifyEncadrant);
router.get('/modify-encadrant/:id', authController.modifyEncadrantForm);
router.get('/delete-encadrant/:id', authController.deleteEncadrant);

router.get('/modify-chef/:id', authController.modifyChefForm);
router.post('/modify-chef/:id', authController.modifyChef);
router.get('/delete-chef/:id', authController.deleteChef);
router.get('/logout', authController.logout);

module.exports = router;
