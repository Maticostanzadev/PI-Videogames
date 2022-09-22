import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Card from '../Card/Card'
import Paginated from "../Paginated/Paginated"
import { Link } from "react-router-dom"
import { getGames, setPage, getGenres, filterByGenres, filterByCreated, sortGames } from '../../redux/actions'
import './cards.css'

export default function Cards() {
  //Pedir estado a redux
  let { allGames, filteredGames, currentPage, allGenres, filtersApplied } = useSelector(state => state)
  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGenres())
  }, [dispatch])

  useEffect(() => {
    if (!allGames.length) {
      dispatch(getGames())
    }
  }, [dispatch, allGames])

  //-------------- FILTERS - SORT --------------

  const [sortState, setSortState] = useState(filtersApplied.sort)

  function handleFilterGenres(e) {
    dispatch(filterByGenres(e.target.value))
    if (sortState !== "none") {
      dispatch(sortGames(sortState))
    }
  }

  function handleFilterCreated(e) {
    dispatch(filterByCreated(e.target.value))
    if (sortState !== "none") {
      dispatch(sortGames(sortState))
    }
  }

  function handleSortGames(e) {
    console.log(e.target.value)
    dispatch(sortGames(e.target.value))
    setSortState(e.target.value)
  }

  //------------- PAGINATED ------------

  const [gamesPerPage] = useState(15)
  const indexLastGame = currentPage * gamesPerPage
  const indexFirstGame = indexLastGame - gamesPerPage
  const currentGames = filteredGames.slice(indexFirstGame, indexLastGame)
  const filteredGamesLength = filteredGames.length

  function paginated(page) {
    dispatch(setPage(page))
  }

  function next() {
    if (currentPage < (filteredGamesLength / gamesPerPage)) {
      let nextPage = currentPage + 1
      dispatch(setPage(nextPage))
    }
  }

  function previous(games) {
    if (currentPage > 1) {
      let previousPage = currentPage - 1
      dispatch(setPage(previousPage))
    }
  }

  //------------- END PAGINATED ------------

  return (
    <div>
      {/* -------------------------------- FILTERS ------------------------------- */}
      <div>
        {/* ------------------------------- GENRES ------------------------------- */}
        <div>
          <label>Géneros</label>
          <select className="filterSelect" name="genres" id="genres" onChange={handleFilterGenres}>
            <option className="filterOptions" value="All" name="All">Todos</option>
            {allGenres?.map(genre => (
              <option key={genre.id} value={genre.name} name={genre.name}>{genre.name}</option>
            ))}
          </select>
        </div>
        {/* ------------------------------ END GENRES ----------------------------- */}

        {/* ------------------------------- CREATED ------------------------------- */}
        <div>
          <label>Origen</label>
          <select className="filterSelect" name="created" onChange={handleFilterCreated}>
            <option value="All" name="All">Todos</option>
            <option value="DB" name="DB">Base de datos</option>
            <option value="API" name="API">API externa</option>
          </select>
        </div>
        {/* ---------------------------- END CREATED ----------------------------- */}

        {/* -------------------------------- SORT -------------------------------- */}
        <div>
          <label>Ordenar</label>
          <select className="filterSelect" name="orderName" onChange={handleSortGames}>
            <option value="none" name="none">Ordenar por:</option>
            <option value="nameAsc" name="asc">Nombre A-Z</option>
            <option value="nameDesc" name="desc">Nombre Z-A</option>
            <option value="ratingAsc" name="asc">Rating -- ++</option>
            <option value="ratingDesc" name="desc">Rating ++ --</option>
          </select>
        </div>
        {/* ------------------------------ END SORT ------------------------------ */}
      </div>
      {/* ------------------------------ END FILTERS ----------------------------- */}

      {/* --------------------------- PAGINATED + CARDS -------------------------- */}
      <div className="totalContainer">
        <Paginated paginated={paginated} allGames={filteredGamesLength} gamesPerPage={gamesPerPage} next={next} previous={previous} />
        <div className="cardsContainer">
          {currentGames.length
            ? currentGames?.map(g =>
              <Link key={g.id} to={`/videogame/${g.id}`}>
                <Card
                  name={g.name}
                  background_image={g.background_image}
                  genres={g.genres}
                  rating={g.rating}
                />
              </Link>
            )
            : allGames.length
              ? <h1>No se encontraron juegos con esos filtros.</h1>
              : <h1>Todavía estamos buscando.</h1>}
        </div>
      </div>
      {/* --------------------------- PAGINATED + CARDS -------------------------- */}
    </div>
  )
}