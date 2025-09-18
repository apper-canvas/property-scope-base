import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ComparisonTable = ({ properties, onRemoveProperty, onViewProperty }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <ApperIcon name="Scale" size={48} className="mx-auto text-secondary-400 mb-3" />
        <p className="text-secondary-600">No properties selected for comparison</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFootage = (sqft) => {
    return new Intl.NumberFormat("en-US").format(sqft);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-3 bg-background font-semibold">Property</th>
            {properties.map((property) => (
              <th key={property.Id} className="p-3 bg-background min-w-[250px]">
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm truncate">
                      {property.title}
                    </span>
                    <button
                      onClick={() => onRemoveProperty(property.Id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-medium">Price</td>
            {properties.map((property) => (
              <td key={property.Id} className="p-3 font-bold text-accent-600">
                {formatPrice(property.price)}
              </td>
            ))}
          </tr>
          <tr className="border-t bg-background/50">
            <td className="p-3 font-medium">Location</td>
            {properties.map((property) => (
              <td key={property.Id} className="p-3 text-sm">
                {property.city}, {property.state}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Bedrooms</td>
            {properties.map((property) => (
              <td key={property.Id} className="p-3">
                {property.bedrooms}
              </td>
            ))}
          </tr>
          <tr className="border-t bg-background/50">
            <td className="p-3 font-medium">Bathrooms</td>
            {properties.map((property) => (
              <td key={property.Id} className="p-3">
                {property.bathrooms}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Square Footage</td>
            {properties.map((property) => (
              <td key={property.Id} className="p-3">
                {formatSquareFootage(property.squareFootage)} sqft
              </td>
            ))}
          </tr>
          <tr className="border-t bg-background/50">
            <td className="p-3 font-medium">Year Built</td>
            {properties.map((property) => (
              <td key={property.Id} className="p-3">
                {property.yearBuilt}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Property Type</td>
            {properties.map((property) => (
              <td key={property.Id} className="p-3">
                {property.propertyType}
              </td>
            ))}
          </tr>
          <tr className="border-t bg-background/50">
            <td className="p-3 font-medium">Actions</td>
            {properties.map((property) => (
              <td key={property.Id} className="p-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewProperty(property.Id)}
                >
                  View Details
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;