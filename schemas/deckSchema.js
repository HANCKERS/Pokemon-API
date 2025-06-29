const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  pokemons: [{
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }]
}, {
  timestamps: true
});

// Validate pokemon array length
deckSchema.pre('save', function(next) {
  if (this.pokemons.length > 6) {
    const error = new Error('A deck cannot contain more than 6 Pokémon');
    error.status = 400;
    return next(error);
  }
  next();
});

// Add compound index for user queries
deckSchema.index({ userId: 1, name: 1 });

module.exports = deckSchema;