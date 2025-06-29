// README.md
# Pokédex API - 3-Tier Architecture

A RESTful API for managing Pokémon decks and favorites with integration to the PokéAPI.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. Run the Application**
   ```bash
   npm start
   ```

## API Endpoints

### Deck Management

#### Create Deck
- **POST** `/api/decks`
- **Body:**
  ```json
  {
    "userId": "abc123",
    "name": "My Fire Team",
    "pokemons": ["charizard", "magmar", "arcanine"]
  }
  ```

#### Update Deck
- **PUT** `/api/decks/:deckId`
- **Body:**
  ```json
  {
    "name": "Updated Team Name",
    "pokemons": ["pikachu", "charizard"]
  }
  ```

#### Delete Deck
- **DELETE** `/api/decks/:deckId`

### Favorites Management

#### Add to Favorites
- **POST** `/api/favorites`
- **Body:**
  ```json
  {
    "userId": "abc123",
    "pokemon": "bulbasaur"
  }
  ```

#### Get User Favorites
- **GET** `/api/favorites/user/:userId/favorites`
- **Response:**
  ```json
  [
    {
      "name": "bulbasaur",
      "types": ["grass", "poison"],
      "hp": 45,
      "image": "https://...",
      "dateAdded": "2025-06-20"
    }
  ]
  ```

#### Get Low HP Favorites (HP < 50)
- **GET** `/api/favorites/user/:userId/favorites/low-hp`

#### Get Legendary Favorites
- **GET** `/api/favorites/user/:userId/favorites/legendary`

#### Remove from Favorites
- **DELETE** `/api/favorites/user/:userId/pokemon/:pokemon`

### please check postman collection

## Architecture

### 3-Tier Structure
1. **API Layer** (`/api`) - Controllers and routes
2. **Repository Layer** (`/repositories`) - Data access abstraction
3. **Data Layer** (`/data`) - External API integration
