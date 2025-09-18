import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MapView from "@/components/organisms/MapView";
import PropertyModal from "@/components/molecules/PropertyModal";
import FilterPanel from "@/components/molecules/FilterPanel";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { toast } from "react-toastify";

const MapPage = ({ favorites, onToggleFavorite }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null,
    propertyType: null,
    location: null,
  });

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await propertyService.getAll();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const applyFilters = () => {
    let filtered = [...properties];

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.state.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.zipCode.includes(filters.location)
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
    }

    // Apply bedroom filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }

    // Apply bathroom filter
    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.bathrooms));
    }

    // Apply property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType);
    }

    setFilteredProperties(filtered);
    toast.success(`Found ${filtered.length} properties`);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
      bathrooms: null,
      propertyType: null,
      location: null,
    });
    setFilteredProperties(properties);
    toast.info("Filters cleared");
  };

  const handleViewDetails = async (propertyId) => {
    try {
      const property = await propertyService.getById(propertyId);
      setSelectedProperty(property);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to load property details");
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== null && value !== "").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Property Map View
        </h1>
        <p className="text-secondary-600">
          Explore properties by location and find homes in your preferred neighborhoods
        </p>
      </motion.div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant={isFilterOpen ? "primary" : "secondary"}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="accent" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <div className="text-sm text-secondary-600">
            Viewing {filteredProperties.length} properties on map
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <ApperIcon name="Layers" size={16} className="mr-1" />
            Layers
          </Button>
          <Button variant="secondary" size="sm">
            <ApperIcon name="Navigation" size={16} className="mr-1" />
            My Location
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        isOpen={isFilterOpen}
      />

      {/* Map View */}
      <MapView
        properties={filteredProperties}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
        onRetry={loadProperties}
      />

      {/* Map Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
            <span className="text-secondary-600">Property Locations</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="MapPin" size={16} className="text-red-500" />
            <span className="text-secondary-600">Schools</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="ShoppingCart" size={16} className="text-blue-500" />
            <span className="text-secondary-600">Shopping</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Car" size={16} className="text-green-500" />
            <span className="text-secondary-600">Transit</span>
          </div>
        </div>
      </div>

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

export default MapPage;