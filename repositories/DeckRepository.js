const Deck = require('../Models/deck');
class DeckRepository {
  async create(deckData) {
    try {
      const deck = new Deck(deckData);
      return await deck.save();
    } catch (error) {
      console.error('Error creating deck:', error.message);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await Deck.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error finding decks by userId:', error.message);
      throw error;
    }
  }

  async findById(deckId) {
    try {
      return await Deck.findById(deckId);
    } catch (error) {
      console.error('Error finding deck by ID:', error.message);
      throw error;
    }
  }

  async update(deckId, updateData) {
    try {
      return await Deck.findByIdAndUpdate(deckId, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating deck:', error.message);
      throw error;
    }
  }

  async delete(deckId) {
    try {
      return await Deck.findByIdAndDelete(deckId);
    } catch (error) {
      console.error('Error deleting deck:', error.message);
      throw error;
    }
  }

  async findByUserIdAndName(userId, name) {
    try {
      return await Deck.findOne({ userId, name });
    } catch (error) {
      console.error('Error finding deck by userId and name:', error.message);
      throw error;
    }
  }
}

module.exports = new DeckRepository();