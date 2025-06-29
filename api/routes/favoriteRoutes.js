const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const router = express.Router();

// Add a favorite Pokémon
router.post('/', favoriteController.addFavorite);

// Get all favorites for a user
router.get('/user/:userId', favoriteController.getUserFavorites);

// Get low-HP favorites for a user
router.get('/user/:userId/low-hp', favoriteController.getFavoritesWithLowHP);

// Get legendary favorites for a user
router.get('/user/:userId/legendary', favoriteController.getLegendaryFavorites);

// Remove a favorite Pokémon
router.delete('/user/:userId/pokemon/:pokemon', favoriteController.removeFavorite);

module.exports = router;
