import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading.jsx";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  showErrorToast,
  showSuccessToast,
  showRateLimitToast,
} from "../utils/toastHelpers.js";

function CharacterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const [episodesToShow, setEpisodesToShow] = useState(10);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(parseInt(id)));
  }, [id]);

  useEffect(() => {
    async function fetchCharacterDetails() {
      setIsLoading(true);
      try {
        const characterRes = await axios.get(
          `https://rickandmortyapi.com/api/character/${id}`,
        );
        setCharacter(characterRes.data);

        const episodeUrls = characterRes.data.episode;
        const episodePromises = episodeUrls.map((url) => axios.get(url));
        const episodeResponses = await Promise.all(episodePromises);
        setEpisodes(episodeResponses.map((res) => res.data));

        if (episodeUrls.length <= 10) {
          setEpisodesToShow(episodeUrls.length);
        }
      } catch (err) {
        console.error("Error fetching character details:", err);

        if (err.response?.status === 429) {
          showRateLimitToast(() => {
            // Auto retry
            fetchCharacterDetails();
          });
        } else {
          showErrorToast(err);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchCharacterDetails();
  }, [id]);

  const toggleFavorite = () => {
    if (!character) return;

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    const wasFavorite = favorites.includes(character.id);

    if (wasFavorite) {
      newFavorites = favorites.filter((favId) => favId !== character.id);
      showSuccessToast("💔 Removed from favorites");
    } else {
      newFavorites = [...favorites, character.id];
      showSuccessToast("⭐ Added to favorites!");
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  if (isLoading) return <Loading fullScreen />;
  if (!character)
    return (
      <div className="min-h-screen bg-surface-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-muted hover:text-portal-500 transition mb-6"
          >
            <FaArrowLeft /> Back to Characters
          </button>
          <div className="text-center py-20 text-text-muted">
            Character not found in this dimension! 🔍
          </div>
        </div>
      </div>
    );

  const displayedEpisodes = showAllEpisodes
    ? episodes
    : episodes.slice(0, episodesToShow);
  const hasMoreEpisodes = episodes.length > episodesToShow;

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-portal-500 transition mb-6"
        >
          <FaArrowLeft /> Back to Characters
        </button>

        <div className="bg-surface-800 rounded-2xl border border-portal-500/60 overflow-hidden shadow-portal-glow">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">
                    {character.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        character.status === "Alive"
                          ? "bg-status-alive"
                          : character.status === "Dead"
                            ? "bg-status-dead"
                            : "bg-status-unknown"
                      }`}
                    ></span>
                    <span className="text-text-muted">
                      {character.status} — {character.species}
                    </span>
                  </div>
                </div>

                <button
                  onClick={toggleFavorite}
                  className="text-3xl hover:scale-110 transition-transform"
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-text-muted hover:text-red-500" />
                  )}
                </button>
              </div>

              <div className="space-y-3 mt-6">
                <p className="text-text-primary">
                  <span className="text-portal-500">Type:</span>{" "}
                  {character.type || "Unknown"}
                </p>
                <p className="text-text-primary">
                  <span className="text-portal-500">Gender:</span>{" "}
                  {character.gender}
                </p>
                <p className="text-text-primary">
                  <span className="text-portal-500">Origin:</span>{" "}
                  {character.origin?.name}
                </p>
                <p className="text-text-primary">
                  <span className="text-portal-500">Location:</span>{" "}
                  {character.location?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-text-primary">
              Episodes Appeared In ({episodes.length})
            </h2>

            <div className="bg-portal-500/20 text-portal-400 px-3 py-1 rounded-full text-sm">
              {episodes.length} {episodes.length === 1 ? "Episode" : "Episodes"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedEpisodes.map((episode, index) => (
              <div
                key={index}
                className="bg-surface-700 border border-surface-600 rounded-lg p-4 hover:bg-surface-600 
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-portal-glow"
              >
                <h3 className="text-portal-400 font-semibold">
                  {episode.name}
                </h3>
                <p className="text-text-muted text-sm mt-1">
                  {episode.episode} — {episode.air_date}
                </p>
              </div>
            ))}
          </div>

          {hasMoreEpisodes && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                className="flex items-center gap-2 px-6 py-2 bg-surface-700 text-text-primary 
                           rounded-lg hover:bg-surface-600 transition-all duration-300
                           hover:shadow-portal-glow"
              >
                {showAllEpisodes ? (
                  <>
                    <FaChevronUp /> Show Less
                  </>
                ) : (
                  <>
                    <FaChevronDown /> Show All {episodes.length} Episodes
                  </>
                )}
              </button>
            </div>
          )}

          {!showAllEpisodes && episodes.length > episodesToShow && (
            <div className="mt-4 text-center text-text-muted text-sm">
              Showing {episodesToShow} of {episodes.length} episodes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterDetailPage;
