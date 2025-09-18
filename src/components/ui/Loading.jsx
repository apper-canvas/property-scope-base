import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        <ApperIcon 
          name="Home" 
          size={20} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500" 
        />
      </div>
      <p className="mt-4 text-secondary-600">Loading properties...</p>
      
      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 w-full max-w-7xl">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="flex gap-4 mb-4">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;