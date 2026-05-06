import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading.jsx";

function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    async function fetchLocations() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `https://rickandmortyapi.com/api/location?page=${page}`,
        );
        setLocations(res.data.results);
        setTotalPages(res.data.info.pages);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLocations();
  }, [page]);
  if (isLoading) return <Loading fullScreen />;
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Locations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-surface-700 border border-portal-500/60 rounded-2xl p-5 hover:bg-surface-600 
                       transition-all duration-300 hover:-translate-y-2 hover:shadow-portal-glow"
          >
            <h2 className="text-xl font-semibold text-portal-400 mb-2">
              {location.name}
            </h2>
            <p className="text-text-muted text-sm">
              Type: {location.type} — Dimension: {location.dimension}
            </p>
            <p className="text-text-muted text-xs mt-2">
              🧑‍🤝‍🧑 {location.residents.length} residents
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-surface-700 text-text-primary rounded hover:bg-surface-600 transition disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-2 text-text-primary">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-surface-700 text-text-primary rounded hover:bg-surface-600 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
export default LocationsPage;
