import { lazy, Suspense } from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import NavBar from "./layout/NavBar.jsx";
import Loading from "./components/Loading.jsx";
const CharactersPage = lazy(() => import("./pages/CharactersPage.jsx"));
const CharacterDetailPage = lazy(
  () => import("./pages/CharacterDetailsPage.jsx"),
);
const EpisodesPage = lazy(() => import("./pages/EpisodesPage.jsx"));
const LocationsPage = lazy(() => import("./pages/LocationsPage.jsx"));
function App() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Layout>
      <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          <Route
            path="/"
            element={<CharactersPage searchQuery={searchQuery} />}
          />
          <Route
            path="/characters"
            element={<CharactersPage searchQuery={searchQuery} />}
          />
          <Route path="/character/:id" element={<CharacterDetailPage />} />
          <Route path="/episodes" element={<EpisodesPage />} />
          <Route path="/locations" element={<LocationsPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
export default App;
