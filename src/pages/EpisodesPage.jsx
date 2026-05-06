import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading.jsx";

function EpisodesPage() {
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    async function fetchEpisodes() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `https://rickandmortyapi.com/api/episode?page=${page}`,
        );
        setEpisodes(res.data.results);
        setTotalPages(res.data.info.pages);
      } catch (err) {
        console.error("Error fetching episodes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEpisodes();
  }, [page]);
  if (isLoading) return <Loading fullScreen />;
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Episodes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="bg-surface-700 border border-portal-500/60 rounded-2xl p-5 hover:bg-surface-600 
                       transition-all duration-300 hover:-translate-y-2 hover:shadow-portal-glow"
          >
            <h2 className="text-xl font-semibold text-portal-400 mb-2">
              {episode.name}
            </h2>
            <p className="text-text-muted text-sm">
              {episode.episode} — {episode.air_date}
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
export default EpisodesPage;
