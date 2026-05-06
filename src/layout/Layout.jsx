import { useEffect } from "react";

function Layout({ children }) {
  useEffect(() => {
    document.title = "Rick & Morty Portal | Character Explorer";
  }, []);

  return (
    <div className="min-h-screen bg-space-950 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-portal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-alien-500/5 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 bg-space-900/50 border-t border-surface-700 mt-20 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-text-muted text-sm">
          <p>
            Data provided by{" "}
            <a
              href="https://rickandmortyapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-portal-500 hover:text-portal-400 transition"
            >
              Rick & Morty API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
