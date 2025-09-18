import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-full p-6 mb-6">
        <ApperIcon name="Search" size={48} className="text-primary-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || "No properties found"}
      </h3>
      
      <p className="text-secondary-600 mb-6 max-w-md">
        {message || "We couldn't find any properties matching your criteria. Try adjusting your search filters or exploring different locations."}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {onAction && (
          <Button onClick={onAction}>
            <ApperIcon name="Filter" size={16} className="mr-2" />
            {actionLabel || "Adjust Filters"}
          </Button>
        )}
        
        <Button variant="secondary" onClick={() => window.location.reload()}>
          <ApperIcon name="RotateCcw" size={16} className="mr-2" />
          Clear All Filters
        </Button>
      </div>
      
      <div className="bg-background rounded-lg p-6 max-w-md">
        <h4 className="font-semibold text-gray-900 mb-3">Search Tips:</h4>
        <ul className="text-left text-sm text-secondary-600 space-y-2">
          <li className="flex items-center gap-2">
            <ApperIcon name="Check" size={14} className="text-success" />
            Try searching in nearby cities or ZIP codes
          </li>
          <li className="flex items-center gap-2">
            <ApperIcon name="Check" size={14} className="text-success" />
            Increase your price range
          </li>
          <li className="flex items-center gap-2">
            <ApperIcon name="Check" size={14} className="text-success" />
            Consider different property types
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Empty;