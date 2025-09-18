import React, { useState } from "react";
import { motion } from "framer-motion";
import ComparisonTable from "@/components/molecules/ComparisonTable";
import PropertyModal from "@/components/molecules/PropertyModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { toast } from "react-toastify";

const ComparisonPage = ({ 
  comparisonItems, 
  onRemoveFromComparison,
  favorites,
  onToggleFavorite 
}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProperty = async (propertyId) => {
    try {
      const property = await propertyService.getById(propertyId);
      setSelectedProperty(property);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to load property details");
    }
  };

  const handleRemoveProperty = (propertyId) => {
    const property = comparisonItems.find(p => p.Id === propertyId);
    if (property) {
      onRemoveFromComparison(propertyId);
      toast.success(`${property.title} removed from comparison`);
    }
  };

  const handleClearAll = () => {
    comparisonItems.forEach(property => {
      onRemoveFromComparison(property.Id);
    });
    toast.success("Comparison cleared");
  };

  const handleShare = () => {
    const propertyTitles = comparisonItems.map(p => p.title).join(", ");
    if (navigator.share) {
      navigator.share({
        title: "Property Comparison - PropertyScope",
        text: `Compare these properties: ${propertyTitles}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Comparison link copied to clipboard");
    }
  };

  const handlePrint = () => {
    window.print();
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
              Property Comparison
            </h1>
            <p className="text-secondary-600">
              Compare properties side-by-side to make informed decisions
            </p>
          </div>
          
          {comparisonItems.length > 0 && (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleShare}>
                <ApperIcon name="Share" size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="secondary" onClick={handlePrint}>
                <ApperIcon name="Printer" size={16} className="mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleClearAll}>
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Comparison Stats */}
      {comparisonItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-lg p-3">
                <ApperIcon name="Scale" size={24} className="text-primary-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {comparisonItems.length}
                </div>
                <div className="text-secondary-600">Properties</div>
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
                  ${Math.abs(Math.max(...comparisonItems.map(p => p.price)) - Math.min(...comparisonItems.map(p => p.price))) / 1000}K
                </div>
                <div className="text-secondary-600">Price Range</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <ApperIcon name="Home" size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(comparisonItems.reduce((sum, prop) => sum + prop.squareFootage, 0) / comparisonItems.length)}
                </div>
                <div className="text-secondary-600">Avg Sq Ft</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <ApperIcon name="Calendar" size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(comparisonItems.reduce((sum, prop) => sum + prop.yearBuilt, 0) / comparisonItems.length)}
                </div>
                <div className="text-secondary-600">Avg Year</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Side-by-Side Comparison
            </h2>
            <div className="text-sm text-secondary-600">
              {comparisonItems.length}/3 properties selected
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <ComparisonTable
            properties={comparisonItems}
            onRemoveProperty={handleRemoveProperty}
            onViewProperty={handleViewProperty}
          />
        </div>
      </motion.div>

      {/* Empty State */}
      {comparisonItems.length === 0 && (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-full p-6 mb-6">
            <ApperIcon name="Scale" size={48} className="text-primary-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No properties to compare yet
          </h3>
          
          <p className="text-secondary-600 mb-6 max-w-md">
            Start browsing properties and add them to comparison to see a side-by-side analysis. 
            You can compare up to 3 properties at once.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button onClick={() => window.location.href = "/"}>
              <ApperIcon name="Search" size={16} className="mr-2" />
              Browse Properties
            </Button>
            
            <Button variant="secondary" onClick={() => window.location.href = "/favorites"}>
              <ApperIcon name="Heart" size={16} className="mr-2" />
              View Favorites
            </Button>
          </div>
          
          <div className="bg-background rounded-lg p-6 max-w-md">
            <h4 className="font-semibold text-gray-900 mb-3">Comparison Tips:</h4>
            <ul className="text-left text-sm text-secondary-600 space-y-2">
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-success" />
                Compare properties in similar price ranges
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-success" />
                Look for differences in square footage and lot size
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-success" />
                Consider location and neighborhood amenities
              </li>
            </ul>
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

export default ComparisonPage;