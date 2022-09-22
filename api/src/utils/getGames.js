require('dotenv').config();
const axios = require('axios');
const { Videogame, Genre, Op } = require('../db');
const { API_KEY } = process.env;

async function getGamesApi(game) {
  let infoApi = []
  if (!game) {
    let url = `https://api.rawg.io/api/games?key=${API_KEY}`
    let page = 1
    while (page <= 5) {
      infoApiCurrent = await axios.get(url)
      infoApi = infoApi.concat(infoApiCurrent.data.results)
      url = infoApiCurrent.data.next
      page++
    }
  } else {
    let infoApiGames = await axios.get(`https://api.rawg.io/api/games?search=${game}&key=${API_KEY}`)
    infoApi = infoApiGames.data.results.slice(0, 15)
  }

  let infoSelected = infoApi.map(g => {
    // return g.name
    return {
      id: g.id,
      name: g.name,
      rating: g.rating,
      background_image: g.background_image,
      Genres: g.genres.map(genre => genre.name),
      created: false
    }
  })

  return infoSelected
}

async function getGamesDb(game) {
  let infoDb = []

  infoDb = await Videogame.findAll({
    attributes: ["id", "background_image", "name", "created", "rating"],
    where: game ? {
      name: {
        [Op.iLike]: `%${game}%`
      }
    } : {},
    include: {
      model: Genre,
      attributes: ["name"],
      through: { attributes: [] }
    }
  })

  infoDb = infoDb.map(game => {
    return {
      id: game.id,
      name: game.name,
      background_image: game.background_image,
      genres: game.Genres.map(g => g.name),
      created: true,
      rating: game.rating
    }
  })

  return infoDb
}

async function getGames(game) {
  try {
    let gamesApi = await getGamesApi(game);
    let gamesDb = await getGamesDb(game);

    // let games = gamesApi.concat(gamesDb);
    let games = gamesDb.concat(gamesApi);

    if (game && games.length === 0) return `No se encontraron juegos con el nombre: ${game}`;

    return games;
  }

  catch (e) {
    return { msgError: "Hubo un error al intentar obtener la información requerida" }
  }
}

module.exports = {
  getGamesApi,
  getGamesDb,
  getGames
}