import { lazy, Suspense } from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
      <Routes>
        <Route
          path="/"
          element={
            <CharactersPage
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          }
        />
        <Route
          path="/characters"
          element={
            <CharactersPage
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          }
        />
        <Route path="/character/:id" element={<CharacterDetailPage />} />
        <Route path="/episodes" element={<EpisodesPage />} />
        <Route path="/locations" element={<LocationsPage />} />
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          success: {
            duration: 2000,
          },
          error: {
            duration: 5000,
          },
        }}
      />
    </Layout>
  );
}

export default App;
