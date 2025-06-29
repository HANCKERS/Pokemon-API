const mongoose = require('mongoose');
const deckSchema = require('../schemas/deckSchema');

// Ensure proper export of the Deck model
const Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;