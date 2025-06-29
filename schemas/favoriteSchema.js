const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  pokemon: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate favorites
favoriteSchema.index({ userId: 1, pokemon: 1 }, { unique: true });

module.exports = favoriteSchema;
