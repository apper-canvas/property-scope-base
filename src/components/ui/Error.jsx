import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <ApperIcon name="AlertCircle" size={48} className="text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-secondary-600 mb-6 max-w-md">
        {message || "We encountered an error while loading the properties. Please try again."}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry}>
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
        
        <Button variant="secondary" onClick={() => window.location.reload()}>
          <ApperIcon name="Home" size={16} className="mr-2" />
          Go Home
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-secondary-500">
        If the problem persists, please contact our support team.
      </div>
    </div>
  );
};

export default Error;