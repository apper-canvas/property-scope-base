import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PropertyCard = ({ property, onViewDetails, onToggleFavorite, isFavorite = false }) => {
  const [imageError, setImageError] = useState(false);

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
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
    >
      <div className="relative">
        <img
          src={imageError ? "/api/placeholder/400/250" : property.images?.[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
        <button
          onClick={() => onToggleFavorite(property.Id)}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200",
            isFavorite 
              ? "bg-red-500 text-white" 
              : "bg-white text-secondary-600 hover:bg-red-50 hover:text-red-500"
          )}
        >
          <ApperIcon 
            name={isFavorite ? "Heart" : "Heart"} 
            size={18} 
            className={isFavorite ? "fill-current" : ""}
          />
        </button>
        <div className="absolute top-3 left-3">
          <Badge variant="accent" className="text-sm font-semibold">
            {property.status || "For Sale"}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {property.title}
          </h3>
        </div>
        
        <p className="text-2xl font-bold text-accent-600 mb-2">
          {formatPrice(property.price)}
        </p>
        
        <p className="text-secondary-600 text-sm mb-3 line-clamp-1">
          {property.address}, {property.city}, {property.state} {property.zipCode}
        </p>
        
        <div className="flex items-center gap-4 text-secondary-600 text-sm mb-4">
          <div className="flex items-center gap-1">
            <ApperIcon name="Bed" size={16} />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Bath" size={16} />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Square" size={16} />
            <span>{formatSquareFootage(property.squareFootage)} sqft</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onViewDetails(property.Id)}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default PropertyCard;