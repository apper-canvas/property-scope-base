import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import SearchPage from "@/components/pages/SearchPage";
import MapPage from "@/components/pages/MapPage";
import FavoritesPage from "@/components/pages/FavoritesPage";
import ComparisonPage from "@/components/pages/ComparisonPage";

function App() {
  const [favorites, setFavorites] = useState([]);
  const [comparisonItems, setComparisonItems] = useState([]);

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const addToComparison = (property) => {
    if (comparisonItems.length >= 3) return;
    if (!comparisonItems.find(item => item.Id === property.Id)) {
      setComparisonItems(prev => [...prev, property]);
    }
  };

  const removeFromComparison = (propertyId) => {
    setComparisonItems(prev => prev.filter(item => item.Id !== propertyId));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header comparisonCount={comparisonItems.length} />
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <SearchPage 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  comparisonItems={comparisonItems}
                  onAddToComparison={addToComparison}
                  onRemoveFromComparison={removeFromComparison}
                />
              } 
            />
            <Route 
              path="/map" 
              element={
                <MapPage 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <FavoritesPage 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  comparisonItems={comparisonItems}
                  onAddToComparison={addToComparison}
                />
              } 
            />
            <Route 
              path="/comparison" 
              element={
                <ComparisonPage 
                  comparisonItems={comparisonItems}
                  onRemoveFromComparison={removeFromComparison}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              } 
            />
          </Routes>
        </main>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;