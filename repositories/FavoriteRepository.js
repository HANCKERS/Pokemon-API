const Favorite = require('../Models/Favourite');

class FavoriteRepository {
  async create(favoriteData) {
    try {
      const favorite = new Favorite(favoriteData);
      return await favorite.save();
    } catch (error) {
      if (error.code === 11000) {
        const duplicateError = new Error('Pokémon is already in favorites');
        duplicateError.status = 409;
        throw duplicateError;
      }
      console.error('Error creating favorite:', error.message);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await Favorite.find({ userId }).sort({ dateAdded: -1 });
    } catch (error) {
      console.error('Error finding favorites by userId:', error.message);
      throw error;
    }
  }

  async findByUserIdAndPokemon(userId, pokemon) {
    try {
      return await Favorite.findOne({ userId, pokemon: pokemon.toLowerCase() });
    } catch (error) {
      console.error('Error finding favorite by userId and Pokémon:', error.message);
      throw error;
    }
  }

  async delete(userId, pokemon) {
    try {
      return await Favorite.findOneAndDelete({ userId, pokemon: pokemon.toLowerCase() });
    } catch (error) {
      console.error('Error deleting favorite:', error.message);
      throw error;
    }
  }

  async exists(userId, pokemon) {
    try {
      const favorite = await Favorite.findOne({ userId, pokemon: pokemon.toLowerCase() });
      return !!favorite;
    } catch (error) {
      console.error('Error checking existence of favorite:', error.message);
      throw error;
    }
  }
}

module.exports = new FavoriteRepository();