import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

function NavBar({ searchQuery, setSearchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleNavigationToCharacters = () => {
    setSearchQuery("");

    if (location.pathname === "/" || location.pathname === "/characters") {
      window.dispatchEvent(new CustomEvent("resetCharactersFilters"));
    }

    navigate("/characters");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-space-900 border-b border-surface-700 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8 flex-1">
            <button
              onClick={handleNavigationToCharacters}
              className="cursor-pointer focus:outline-none"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg"
                alt="Rick & Morty"
                className="h-10 w-auto hidden xs:block sm:block hover:opacity-80 transition"
              />
            </button>

            {location.pathname === "/" ||
            location.pathname === "/characters" ? (
              <input
                type="text"
                placeholder="Search Characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-800 text-text-primary placeholder-text-muted px-4 py-2 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-portal-500 focus:shadow-portal-glow w-32 sm:w-40 md:w-56
                           max-w-md focus:max-w-3xl flex-1 transition-all duration-300 ease-in-out"
              />
            ) : (
              <div className="flex-1"></div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 mx-4">
              <button
                onClick={handleNavigationToCharacters}
                className={`transition-colors cursor-pointer ${
                  isActive("/characters") || isActive("/")
                    ? "text-portal-500"
                    : "text-text-muted hover:text-portal-500"
                }`}
              >
                Characters
              </button>
              <Link
                to="/episodes"
                className={`transition-colors ${
                  isActive("/episodes")
                    ? "text-portal-500"
                    : "text-text-muted hover:text-portal-500"
                }`}
              >
                Episodes
              </Link>
              <Link
                to="/locations"
                className={`transition-colors ${
                  isActive("/locations")
                    ? "text-portal-500"
                    : "text-text-muted hover:text-portal-500"
                }`}
              >
                Locations
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-text-primary hover:text-portal-500 focus:outline-none m-4"
              >
                {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface-800 absolute top-16 left-0 w-full shadow-lg z-20">
          <div className="flex flex-col p-4 gap-4">
            <button
              onClick={handleNavigationToCharacters}
              className={`transition text-left cursor-pointer ${
                isActive("/characters") || isActive("/")
                  ? "text-portal-500"
                  : "text-text-primary hover:text-portal-500"
              }`}
            >
              Characters
            </button>
            <Link
              to="/episodes"
              onClick={() => setMenuOpen(false)}
              className={`transition ${
                isActive("/episodes")
                  ? "text-portal-500"
                  : "text-text-primary hover:text-portal-500"
              }`}
            >
              Episodes
            </Link>
            <Link
              to="/locations"
              onClick={() => setMenuOpen(false)}
              className={`transition ${
                isActive("/locations")
                  ? "text-portal-500"
                  : "text-text-primary hover:text-portal-500"
              }`}
            >
              Locations
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
