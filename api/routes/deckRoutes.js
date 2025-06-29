const express = require('express');
const deckController = require('../controllers/deckController');
const router = express.Router();

// Create a new deck
router.post('/', deckController.createDeck);

// Get all decks for a user by userId
router.get('/user/:userId', deckController.getUserDecks);

// Get a specific deck by deckId
router.get('/:deckId', deckController.getDeck);
    
// Update a specific deck by deckId
router.put('/:deckId', deckController.updateDeck);

// Delete a specific deck by deckId
router.delete('/:deckId', deckController.deleteDeck);

module.exports = router;
