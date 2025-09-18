import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import FilterPanel from "@/components/molecules/FilterPanel";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import PropertyModal from "@/components/molecules/PropertyModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { toast } from "react-toastify";

const SearchPage = ({ 
  favorites, 
  onToggleFavorite, 
  comparisonItems, 
  onAddToComparison,
  onRemoveFromComparison 
}) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(property => 
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.zipCode.includes(searchQuery) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
    setSearchQuery("");
    setFilteredProperties(properties);
    toast.info("Filters cleared");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Apply filters will be called by the apply filters button
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

  const handleAddToComparison = (propertyId) => {
    if (comparisonItems.length >= 3) {
      toast.warning("You can compare up to 3 properties at once");
      return;
    }
    
    const property = properties.find(p => p.Id === propertyId);
    if (property) {
      onAddToComparison(property);
      toast.success(`${property.title} added to comparison`);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== null && value !== "").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Home
        </h1>
        <p className="text-lg text-secondary-600 mb-6">
          Discover properties that match your lifestyle and budget
        </p>
        <SearchBar onSearch={handleSearch} />
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
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ApperIcon name="LayoutGrid" size={16} className="mr-1" />
            Grid
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="List" size={16} className="mr-1" />
            List
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

      {/* Results */}
      <PropertyGrid
        properties={filteredProperties}
        loading={loading}
        error={error}
        favorites={favorites}
        onViewDetails={handleViewDetails}
        onToggleFavorite={onToggleFavorite}
        onRetry={loadProperties}
      />

      {/* Quick Add to Comparison */}
      {!loading && filteredProperties.length > 0 && (
        <div className="fixed bottom-6 right-6 z-30">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">
                Quick Compare ({comparisonItems.length}/3)
              </span>
              {comparisonItems.length > 0 && (
                <Button size="sm" onClick={() => window.location.href = "/comparison"}>
                  <ApperIcon name="Scale" size={14} className="mr-1" />
                  Compare
                </Button>
              )}
            </div>
            <p className="text-xs text-secondary-600">
              Click properties to compare side-by-side
            </p>
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

export default SearchPage;