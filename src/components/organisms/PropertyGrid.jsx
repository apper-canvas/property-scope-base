import React from "react";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  favorites,
  onViewDetails,
  onToggleFavorite,
  onRetry
}) => {
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;
  if (!properties || properties.length === 0) return <Empty />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.Id}
          property={property}
          onViewDetails={onViewDetails}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(property.Id)}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;