import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function CharacterList({ characters, onFavoriteToggle, favorites }) {
  const toggleFavorite = (e, characterId) => {
    e.preventDefault();
    e.stopPropagation();

    let newFavorites;
    if (favorites.includes(characterId)) {
      newFavorites = favorites.filter((id) => id !== characterId);
    } else {
      newFavorites = [...favorites, characterId];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    window.dispatchEvent(new Event("favoritesUpdated"));

    if (onFavoriteToggle) {
      onFavoriteToggle(newFavorites);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {characters.map((item) => (
          <div key={item.id} className="relative group">
            <Link to={`/character/${item.id}`}>
              <div
                className="bg-surface-700 border border-portal-500/60 rounded-2xl overflow-hidden
                          transition-all duration-300 hover:bg-surface-600 hover:-translate-y-2 hover:shadow-portal-glow"
              >
                <div className="overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-52 object-cover transition-transform duration-500
                              group-hover:scale-110"
                  />

                  {/* Favorite Button on Card */}
                  <button
                    onClick={(e) => toggleFavorite(e, item.id)}
                    className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm p-2 rounded-full
                               hover:scale-110 transition-transform duration-200"
                  >
                    {favorites.includes(item.id) ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-white text-xl hover:text-red-500" />
                    )}
                  </button>
                </div>

                <div className="p-5">
                  <h2
                    className="text-lg font-semibold text-text-primary transition-colors duration-300
                              group-hover:text-portal-400"
                  >
                    {item.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        item.status === "Alive"
                          ? "bg-status-alive"
                          : item.status === "Dead"
                            ? "bg-status-dead"
                            : "bg-status-unknown"
                      }`}
                    ></span>
                    <span className="text-sm text-text-muted">
                      {item.status} — {item.species}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-3">
                    Origin: {item.origin?.name}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterList;
