const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Stagiaire routes
router.post('/add-stagiaire', authController.addStagiaire);
router.get('/modify-stagiaire/:id', authController.modifyStagiaireForm);
router.post('/modify-stagiaire/:id', authController.modifyStagiaire);
router.get('/delete-stagiaire/:id', authController.deleteStagiaire);

// Encadrant routes
router.post('/add-encadrant', authController.addEncadrant);
router.get('/modify-encadrant/:id', authController.modifyEncadrantForm); // Added for fetching the modify form
router.post('/modify-encadrant/:id', authController.modifyEncadrant);
router.get('/delete-encadrant/:id', authController.deleteEncadrant);

// Chef routes

router.post('/add-chef', authController.addChef);
router.get('/modify-chef/:id', authController.modifyChefForm); // Added for fetching the modify form
router.post('/modify-chef/:id', authController.modifyChef);
router.get('/delete-chef/:id', authController.deleteChef);

// Dashboard route
router.get('/dashboard', authController.fetchDashboardData, authController.dashboard);

module.exports = router;
