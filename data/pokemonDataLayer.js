const axios = require('axios');
const NodeCache = require('node-cache');

class PokemonDataLayer {
  constructor() {
    this.baseURL = process.env.POKEAPI_BASE_URL;
    this.cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 3600 });
  }

  async getPokemonData(pokemonName) {
    const cacheKey = `pokemon_${pokemonName.toLowerCase()}`;
    
    // Check cache first
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(`${this.baseURL}/pokemon/${pokemonName.toLowerCase()}`);
      const pokemon = response.data;
      
      // Get species data for legendary flag
      const speciesResponse = await axios.get(pokemon.species.url);
      const speciesData = speciesResponse.data;

      const pokemonData = {
        name: pokemon.name,
        types: pokemon.types.map(type => type.type.name),
        hp: pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat,
        image: pokemon.sprites.front_default,
        isLegendary: speciesData.is_legendary
      };

      // Cache the result
      this.cache.set(cacheKey, pokemonData);
      return pokemonData;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Pokémon '${pokemonName}' not found`);
        return null;
      }
      console.error(`Failed to fetch Pokémon data: ${error.message}`);
      return null;
    }
  }

  async validatePokemonExists(pokemonName) {
    try {
      const data = await this.getPokemonData(pokemonName);
      return !!data;
    } catch {
      return false;
    }
  }

  async getBulkPokemonData(pokemonNames) {
    const promises = pokemonNames.map(name => this.getPokemonData(name));
    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Failed to fetch data for ${pokemonNames[index]}:`, result.reason?.message || 'Unknown error');
        return null;
      }
    }).filter(data => data !== null);
  }
}

module.exports = new PokemonDataLayer();