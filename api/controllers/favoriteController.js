const favoriteRepository = require('../../repositories/favoriteRepository');
const pokemonDataLayer = require('../../data/pokemonDataLayer');

const addFavorite = async (req, res, next) => {
  try {
    const { userId, pokemon } = req.body;

    if (!userId || !pokemon) {
      return res.status(400).json({ error: 'userId and pokemon are required' });
    }

    // Validate Pokemon exists
    const isValidPokemon = await pokemonDataLayer.validatePokemonExists(pokemon);
    if (!isValidPokemon) {
      return res.status(400).json({ error: `Pokémon '${pokemon}' not found` });
    }

    const favorite = await favoriteRepository.create({
      userId,
      pokemon: pokemon.toLowerCase()
    });

    res.status(201).json({
      message: 'Pokémon added to favorites',
      favorite: {
        pokemon: favorite.pokemon,
        dateAdded: favorite.dateAdded
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUserFavorites = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const favorites = await favoriteRepository.findByUserId(userId);

    if (favorites.length === 0) {
      return res.json([]);
    }

    // Fetch Pokemon data from API
    const pokemonNames = favorites.map(fav => fav.pokemon);
    const pokemonDataArray = await pokemonDataLayer.getBulkPokemonData(pokemonNames);

    const favoritesWithData = favorites.map(favorite => {
      const pokemonData = pokemonDataArray.find(data => data && data.name === favorite.pokemon);

      if (!pokemonData) {
        return {
          name: favorite.pokemon,
          dateAdded: favorite.dateAdded.toISOString().split('T')[0],
          error: 'Data not available'
        };
      }

      return {
        name: pokemonData.name,
        types: pokemonData.types,
        hp: pokemonData.hp,
        image: pokemonData.image,
        dateAdded: favorite.dateAdded.toISOString().split('T')[0]
      };
    });

    res.json(favoritesWithData);
  } catch (error) {
    next(error);
  }
};

const getFavoritesWithLowHP = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const favorites = await favoriteRepository.findByUserId(userId);

    if (favorites.length === 0) {
      return res.json([]);
    }

    // Fetch Pokemon data from API
    const pokemonNames = favorites.map(fav => fav.pokemon);
    const pokemonDataArray = await pokemonDataLayer.getBulkPokemonData(pokemonNames);

    const lowHPFavorites = favorites
      .map(favorite => {
        const pokemonData = pokemonDataArray.find(data => data && data.name === favorite.pokemon);

        if (!pokemonData) return null;

        return {
          name: pokemonData.name,
          types: pokemonData.types,
          hp: pokemonData.hp,
          image: pokemonData.image,
          dateAdded: favorite.dateAdded.toISOString().split('T')[0]
        };
      })
      .filter(pokemon => pokemon && pokemon.hp < 50);

    res.json(lowHPFavorites);
  } catch (error) {
    next(error);
  }
};

const getLegendaryFavorites = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const favorites = await favoriteRepository.findByUserId(userId);

    if (favorites.length === 0) {
      return res.json([]);
    }

    // Fetch Pokemon data from API
    const pokemonNames = favorites.map(fav => fav.pokemon);
    const pokemonDataArray = await pokemonDataLayer.getBulkPokemonData(pokemonNames);

    const legendaryFavorites = favorites
      .map(favorite => {
        const pokemonData = pokemonDataArray.find(data => data && data.name === favorite.pokemon);

        if (!pokemonData) return null;

        return {
          name: pokemonData.name,
          types: pokemonData.types,
          hp: pokemonData.hp,
          image: pokemonData.image,
          isLegendary: pokemonData.isLegendary,
          dateAdded: favorite.dateAdded.toISOString().split('T')[0]
        };
      })
      .filter(pokemon => pokemon && pokemon.isLegendary);

    res.json(legendaryFavorites);
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { userId, pokemon } = req.params;

    if (!userId || !pokemon) {
      return res.status(400).json({ error: 'userId and pokemon are required' });
    }

    const favorite = await favoriteRepository.delete(userId, pokemon);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Pokémon removed from favorites' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  getUserFavorites,
  getFavoritesWithLowHP,
  getLegendaryFavorites,
  removeFavorite
};