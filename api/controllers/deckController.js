const deckRepository = require('../../repositories/DeckRepository');
const pokemonDataLayer = require('../../data/pokemonDataLayer');

const createDeck = async (req, res, next) => {
  try {
    const { userId, name, pokemons } = req.body;

    // Validation
    if (!userId || !name || !pokemons) {
      return res.status(400).json({ error: 'userId, name, and pokemons are required' });
    }

    if (!Array.isArray(pokemons)) {
      return res.status(400).json({ error: 'pokemons must be an array' });
    }

    if (pokemons.length > 6) {
      return res.status(400).json({ error: 'A deck cannot contain more than 6 Pokémon' });
    }

    // Check if deck name already exists for user
    const existingDeck = await deckRepository.findByUserIdAndName(userId, name);
    if (existingDeck) {
      return res.status(409).json({ error: 'A deck with this name already exists' });
    }

    // Validate all Pokemon exist
    const validationPromises = pokemons.map(pokemon => 
      pokemonDataLayer.validatePokemonExists(pokemon)
    );
    const validationResults = await Promise.all(validationPromises);
    
    const invalidPokemon = pokemons.filter((_, index) => !validationResults[index]);
    if (invalidPokemon.length > 0) {
      return res.status(400).json({ 
        error: `Invalid Pokémon: ${invalidPokemon.join(', ')}` 
      });
    }

    const deck = await deckRepository.create({
      userId,
      name,
      pokemons: pokemons.map(p => p.toLowerCase())
    });

    res.status(201).json({
      message: 'Deck created successfully',
      deck: {
        id: deck._id,
        name: deck.name,
        pokemons: deck.pokemons,
        createdAt: deck.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUserDecks = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const decks = await deckRepository.findByUserId(userId);
    
    const decksWithPlayableFlag = decks.map(deck => ({
      id: deck._id,
      name: deck.name,
      pokemons: deck.pokemons,
      isPlayable: deck.pokemons.length === 6,
      createdAt: deck.createdAt
    }));

    res.json(decksWithPlayableFlag);
  } catch (error) {
    next(error);
  }
};

const getDeck = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    
    if (!deckId) {
      return res.status(400).json({ error: 'deckId is required' });
    }

    const deck = await deckRepository.findById(deckId);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    res.json({
      id: deck._id,
      name: deck.name,
      pokemons: deck.pokemons,
      isPlayable: deck.pokemons.length === 6,
      createdAt: deck.createdAt
    });
  } catch (error) {
    next(error);
  }
};

const updateDeck = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    const { name, pokemons } = req.body;

    if (!deckId) {
      return res.status(400).json({ error: 'deckId is required' });
    }

    const deck = await deckRepository.findById(deckId);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const updateData = {};
    
    if (name) updateData.name = name;
    
    if (pokemons) {
      if (!Array.isArray(pokemons)) {
        return res.status(400).json({ error: 'pokemons must be an array' });
      }
      
      if (pokemons.length > 6) {
        return res.status(400).json({ error: 'A deck cannot contain more than 6 Pokémon' });
      }

      // Validate all Pokemon exist
      const validationPromises = pokemons.map(pokemon => 
        pokemonDataLayer.validatePokemonExists(pokemon)
      );
      const validationResults = await Promise.all(validationPromises);
      
      const invalidPokemon = pokemons.filter((_, index) => !validationResults[index]);
      if (invalidPokemon.length > 0) {
        return res.status(400).json({ 
          error: `Invalid Pokémon: ${invalidPokemon.join(', ')}` 
        });
      }

      updateData.pokemons = pokemons.map(p => p.toLowerCase());
    }

    const updatedDeck = await deckRepository.update(deckId, updateData);

    res.json({
      message: 'Deck updated successfully',
      deck: {
        id: updatedDeck._id,
        name: updatedDeck.name,
        pokemons: updatedDeck.pokemons,
        isPlayable: updatedDeck.pokemons.length === 6,
        updatedAt: updatedDeck.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteDeck = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    
    if (!deckId) {
      return res.status(400).json({ error: 'deckId is required' });
    }

    const deck = await deckRepository.delete(deckId);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDeck,
  getUserDecks,
  getDeck,
  updateDeck,
  deleteDeck
};