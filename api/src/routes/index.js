const { Router } = require('express');


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const routesGenres = require('./routesGenres.js');
const routesVideogameId = require('./routesVideogameId');
const routesVideogames = require('./routesVideogames');
const routesPlatforms = require('./routesPlatforms');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/genres', routesGenres);
router.use('/videogame', routesVideogameId);
router.use('/videogames', routesVideogames);
router.use('/platforms', routesPlatforms);

module.exports = router;
