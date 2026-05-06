import { FaChevronDown } from "react-icons/fa";

const STATUS_OPTIONS = ["", "Alive", "Dead", "Unknown"];
const SPECIES_OPTIONS = ["", "Human", "Alien", "Humanoid", "Robot", "Animal"];

function FilterBar({
  status,
  setStatus,
  species,
  setSpecies,
  showFavorites,
  setShowFavorites,
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-surface-800 text-text-primary px-4 py-2 pr-10 rounded-lg border border-surface-700
                       focus:outline-none focus:ring-2 focus:ring-portal-500 appearance-none cursor-pointer
                       hover:border-portal-500/60 transition-colors"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt || "all"} value={opt}>
                {opt || "All Status"}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-portal-500 pointer-events-none text-sm" />
        </div>

        <div className="relative">
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="bg-surface-800 text-text-primary px-4 py-2 pr-10 rounded-lg border border-surface-700
                       focus:outline-none focus:ring-2 focus:ring-portal-500 appearance-none cursor-pointer
                       hover:border-portal-500/60 transition-colors"
          >
            {SPECIES_OPTIONS.map((opt) => (
              <option key={opt || "all"} value={opt}>
                {opt || "All Species"}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-portal-500 pointer-events-none text-sm" />
        </div>

        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer
            ${showFavorites ? "bg-portal-500/20 text-portal-400 border border-portal-500 shadow-portal-glow" : "bg-surface-800 text-text-muted border border-surface-700 hover:text-portal-400 hover:border-portal-500/60"}`}
        >
          <span>❤️</span>
          Favorites Only
        </button>
      </div>

      <button
        onClick={() => {
          setStatus("");
          setSpecies("");
          setShowFavorites(false);
        }}
        className="text-text-muted hover:text-portal-400 text-sm underline transition cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>
  );
}

export default FilterBar;
