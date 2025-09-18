import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const MapView = ({ properties, loading, error, onViewDetails, onRetry }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;
  if (!properties || properties.length === 0) return <Empty />;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      {/* Map Container */}
      <div className="h-[600px] bg-gradient-to-br from-green-50 to-green-100 relative">
        {/* Placeholder Map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="Map" size={64} className="mx-auto text-primary-400 mb-4" />
            <p className="text-secondary-600 mb-2">Interactive Map View</p>
            <p className="text-sm text-secondary-500">
              {properties.length} properties in this area
            </p>
          </div>
        </div>

        {/* Property Markers */}
        {properties.slice(0, 10).map((property, index) => (
          <div
            key={property.Id}
            className="absolute cursor-pointer"
            style={{
              left: `${20 + (index % 5) * 15}%`,
              top: `${30 + Math.floor(index / 5) * 20}%`,
            }}
            onClick={() => setSelectedProperty(property)}
          >
            <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg hover:bg-primary-600 transition-colors">
              {formatPrice(property.price).replace(/,/g, ",")}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary-500 mx-auto"></div>
          </div>
        ))}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="bg-white p-2 rounded-md shadow-md hover:shadow-lg transition-shadow">
            <ApperIcon name="Plus" size={20} className="text-secondary-600" />
          </button>
          <button className="bg-white p-2 rounded-md shadow-md hover:shadow-lg transition-shadow">
            <ApperIcon name="Minus" size={20} className="text-secondary-600" />
          </button>
        </div>

        {/* Property Info Popup */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm mx-auto">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex-1 pr-2">
                {selectedProperty.title}
              </h3>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="w-16 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-lg font-bold text-accent-600">
                  {formatPrice(selectedProperty.price)}
                </div>
                <div className="text-sm text-secondary-600">
                  {selectedProperty.bedrooms} bed • {selectedProperty.bathrooms} bath
                </div>
              </div>
            </div>
            
            <div className="text-sm text-secondary-600 mb-3">
              {selectedProperty.address}, {selectedProperty.city}
            </div>
            
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => onViewDetails(selectedProperty.Id)}
            >
              View Details
            </Button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-background border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-secondary-600">Properties</span>
            </div>
            <Badge variant="accent">
              {properties.length} results
            </Badge>
          </div>
          <Button variant="secondary" size="sm">
            <ApperIcon name="Maximize" size={16} className="mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapView;