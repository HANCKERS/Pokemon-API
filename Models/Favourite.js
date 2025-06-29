const mongoose = require('mongoose');
const favoriteSchema = require('../schemas/favoriteSchema');

// Ensure proper export of the Favorite model
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;