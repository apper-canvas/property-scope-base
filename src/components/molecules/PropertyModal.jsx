import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PropertyModal = ({ property, isOpen, onClose, onToggleFavorite, isFavorite = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !property) return null;

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(property.Id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite 
                  ? "bg-red-500 text-white" 
                  : "bg-gray-100 text-secondary-600 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <ApperIcon 
                name="Heart" 
                size={20} 
                className={isFavorite ? "fill-current" : ""}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 text-secondary-600 hover:bg-gray-200"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Image Gallery */}
          <div className="relative mb-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                >
                  <ApperIcon name="ChevronLeft" size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                >
                  <ApperIcon name="ChevronRight" size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-accent-600 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-secondary-600">
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </div>
                </div>
                <Badge variant="accent">
                  {property.status || "For Sale"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-background rounded-lg">
                  <ApperIcon name="Bed" size={24} className="mx-auto mb-2 text-primary-500" />
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-secondary-600">Bedrooms</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <ApperIcon name="Bath" size={24} className="mx-auto mb-2 text-primary-500" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-secondary-600">Bathrooms</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <ApperIcon name="Square" size={24} className="mx-auto mb-2 text-primary-500" />
                  <div className="font-semibold">{formatSquareFootage(property.squareFootage)}</div>
                  <div className="text-sm text-secondary-600">Sq Ft</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <ApperIcon name="Calendar" size={24} className="mx-auto mb-2 text-primary-500" />
                  <div className="font-semibold">{property.yearBuilt}</div>
                  <div className="text-sm text-secondary-600">Year Built</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-secondary-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-secondary-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-background rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-3">Property Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Property Type:</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Lot Size:</span>
                    <span className="font-medium">{formatSquareFootage(property.lotSize)} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Listed:</span>
                    <span className="font-medium">{formatDate(property.listingDate)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mb-3">
                <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                Contact Agent
              </Button>
              
              <Button variant="secondary" className="w-full">
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyModal;