import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import PropertyModal from "@/components/molecules/PropertyModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { toast } from "react-toastify";

const FavoritesPage = ({ 
  favorites, 
  onToggleFavorite,
  comparisonItems,
  onAddToComparison 
}) => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadFavoriteProperties = async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (favorites.length === 0) {
        setFavoriteProperties([]);
        setLoading(false);
        return;
      }

      const allProperties = await propertyService.getAll();
      const favoriteProps = allProperties.filter(property => 
        favorites.includes(property.Id)
      );
      
      setFavoriteProperties(favoriteProps);
    } catch (err) {
      setError("Failed to load favorite properties. Please try again.");
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteProperties();
  }, [favorites]);

  const handleViewDetails = async (propertyId) => {
    try {
      const property = await propertyService.getById(propertyId);
      setSelectedProperty(property);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to load property details");
    }
  };

  const handleRemoveFromFavorites = (propertyId) => {
    onToggleFavorite(propertyId);
    toast.success("Property removed from favorites");
  };

  const handleAddAllToComparison = () => {
    const availableSlots = 3 - comparisonItems.length;
    if (availableSlots <= 0) {
      toast.warning("Comparison list is full. Remove some properties first.");
      return;
    }

    const propertiesToAdd = favoriteProperties.slice(0, availableSlots);
    propertiesToAdd.forEach(property => {
      if (!comparisonItems.find(item => item.Id === property.Id)) {
        onAddToComparison(property);
      }
    });
    
    toast.success(`Added ${propertiesToAdd.length} properties to comparison`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Favorite Properties
            </h1>
            <p className="text-secondary-600">
              Properties you've saved for future consideration
            </p>
          </div>
          
          {favoriteProperties.length > 0 && (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleAddAllToComparison}>
                <ApperIcon name="Scale" size={16} className="mr-2" />
                Add to Compare
              </Button>
              <Button>
                <ApperIcon name="Share" size={16} className="mr-2" />
                Share List
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      {!loading && favoriteProperties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-lg p-3">
                <ApperIcon name="Heart" size={24} className="text-primary-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {favoriteProperties.length}
                </div>
                <div className="text-secondary-600">Saved Properties</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-accent-100 rounded-lg p-3">
                <ApperIcon name="DollarSign" size={24} className="text-accent-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${Math.round(favoriteProperties.reduce((sum, prop) => sum + prop.price, 0) / favoriteProperties.length / 1000)}K
                </div>
                <div className="text-secondary-600">Average Price</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(favoriteProperties.reduce((sum, prop) => sum + prop.squareFootage, 0) / favoriteProperties.length)}
                </div>
                <div className="text-secondary-600">Avg Sq Ft</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Properties Grid */}
      <PropertyGrid
        properties={favoriteProperties}
        loading={loading}
        error={error}
        favorites={favorites}
        onViewDetails={handleViewDetails}
        onToggleFavorite={handleRemoveFromFavorites}
        onRetry={loadFavoriteProperties}
      />

      {/* Empty State Override for Favorites */}
      {!loading && !error && favoriteProperties.length === 0 && (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-full p-6 mb-6">
            <ApperIcon name="Heart" size={48} className="text-red-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No favorite properties yet
          </h3>
          
          <p className="text-secondary-600 mb-6 max-w-md">
            Start exploring properties and save the ones you like by clicking the heart icon. 
            Your favorites will appear here for easy access.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => window.location.href = "/"}>
              <ApperIcon name="Search" size={16} className="mr-2" />
              Browse Properties
            </Button>
            
            <Button variant="secondary" onClick={() => window.location.href = "/map"}>
              <ApperIcon name="Map" size={16} className="mr-2" />
              Explore Map
            </Button>
          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleFavorite={onToggleFavorite}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.Id) : false}
      />
    </div>
  );
};

export default FavoritesPage;