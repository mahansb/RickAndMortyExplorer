import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CharacterList from "../components/CharacterList.jsx";
import Loading from "../components/Loading.jsx";
import FilterBar from "../layout/FilterBar.jsx";
import {
  showErrorToast,
  showRateLimitToast,
  showInfoToast,
} from "../utils/toastHelpers.js";
function CharactersPage({ searchQuery, setSearchQuery }) {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const hasShown404Toast = useRef(false);
  const debounceTimer = useRef(null);
  const loadFavorites = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);
    return favs;
  };
  useEffect(() => {
    loadFavorites();
  }, []);
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      const updatedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(updatedFavs);
      if (showFavorites) {
        setRefreshTrigger((prev) => prev + 1);
      }
    };
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, [showFavorites]);
  useEffect(() => {
    setPage(1);
    hasShown404Toast.current = false;
  }, [searchQuery, statusFilter, speciesFilter, showFavorites]);
  useEffect(() => {
    if (searchQuery && searchQuery.length > 0 && searchQuery.length < 3) {
      setCharacters([]);
      setIsLoading(false);
      return;
    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      async function fetchCharacters() {
        setIsLoading(true);
        try {
          if (showFavorites) {
            const currentFavorites = JSON.parse(
              localStorage.getItem("favorites") || "[]",
            );
            if (currentFavorites.length === 0) {
              setCharacters([]);
              setTotalPages(1);
              setIsLoading(false);
              return;
            }
            const favoritePromises = currentFavorites.map((id) =>
              axios.get(`https://rickandmortyapi.com/api/character/${id}`),
            );
            const responses = await Promise.all(favoritePromises);
            let favCharacters = responses.map((res) => res.data);
            if (searchQuery) {
              favCharacters = favCharacters.filter((char) =>
                char.name.toLowerCase().includes(searchQuery.toLowerCase()),
              );
            }
            if (statusFilter) {
              favCharacters = favCharacters.filter(
                (char) =>
                  char.status.toLowerCase() === statusFilter.toLowerCase(),
              );
            }
            if (speciesFilter) {
              favCharacters = favCharacters.filter(
                (char) =>
                  char.species.toLowerCase() === speciesFilter.toLowerCase(),
              );
            }
            setCharacters(favCharacters);
            setTotalPages(1);
          } else {
            const params = new URLSearchParams();
            params.append("page", page);
            if (searchQuery) params.append("name", searchQuery);
            if (statusFilter)
              params.append("status", statusFilter.toLowerCase());
            if (speciesFilter)
              params.append("species", speciesFilter.toLowerCase());
            const res = await axios.get(
              `https://rickandmortyapi.com/api/character?${params.toString()}`,
            );
            setCharacters(res.data.results);
            setTotalPages(res.data.info.pages);
            hasShown404Toast.current = false;
          }
        } catch (err) {
          console.error("Error fetching characters:", err);
          if (err.response?.status === 429) {
            showRateLimitToast(() => {
              setRefreshTrigger((prev) => prev + 1);
            });
          } else if (err.response?.status === 404) {
            setCharacters([]);
            setTotalPages(1);
            if (
              !hasShown404Toast.current &&
              searchQuery &&
              searchQuery.length >= 3
            ) {
              hasShown404Toast.current = true;
              showInfoToast("No characters found in this dimension");
            }
          } else {
            showErrorToast(err);
          }
        } finally {
          setIsLoading(false);
        }
      }
      fetchCharacters();
    }, 500);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [
    page,
    searchQuery,
    statusFilter,
    speciesFilter,
    showFavorites,
    refreshTrigger,
  ]);
  useEffect(() => {
    const handleResetFilters = () => {
      setStatusFilter("");
      setSpeciesFilter("");
      setShowFavorites(false);
      setSearchQuery("");
      setPage(1);
    };
    window.addEventListener("resetCharactersFilters", handleResetFilters);
    return () => {
      window.removeEventListener("resetCharactersFilters", handleResetFilters);
    };
  }, [setSearchQuery]);
  const handleFavoriteToggle = (newFavorites) => {
    setFavorites(newFavorites);
  };
  if (isLoading) {
    return <Loading fullScreen={true} />;
  }
  return (
    <div className="bg-surface-900 min-h-screen">
      <FilterBar
        status={statusFilter}
        setStatus={setStatusFilter}
        species={speciesFilter}
        setSpecies={setSpeciesFilter}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
      />

      {characters.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          {showFavorites
            ? "No favorite characters yet. ❤️ Click the heart on any character to add them!"
            : searchQuery && searchQuery.length > 0 && searchQuery.length < 3
              ? "🔍 Enter at least 3 characters to search"
              : "No characters found in this dimension!"}
        </div>
      ) : (
        <>
          <CharacterList
            characters={characters}
            onFavoriteToggle={handleFavoriteToggle}
            favorites={favorites}
          />
          {!showFavorites && (
            <div className="flex justify-center gap-4 mt-10 pb-10">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || isLoading}
                className="px-4 py-2 bg-surface-700 text-text-primary rounded hover:bg-surface-600 transition disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-2 text-text-primary">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || isLoading}
                className="px-4 py-2 bg-surface-700 text-text-primary rounded hover:bg-surface-600 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default CharactersPage;
