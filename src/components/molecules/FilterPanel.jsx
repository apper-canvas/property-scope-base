import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onClearFilters,
  isOpen 
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value === "" ? null : value
    });
  };

  const propertyTypes = [
    { value: "", label: "All Types" },
    { value: "House", label: "House" },
    { value: "Condo", label: "Condo" },
    { value: "Townhouse", label: "Townhouse" },
    { value: "Apartment", label: "Apartment" },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ 
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden bg-white shadow-md rounded-lg mb-6"
    >
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label className="block mb-2">Min Price</Label>
            <Input
              type="number"
              placeholder="$0"
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
          </div>
          
          <div>
            <Label className="block mb-2">Max Price</Label>
            <Input
              type="number"
              placeholder="Any"
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>
          
          <div>
            <Label className="block mb-2">Bedrooms</Label>
            <Select
              value={filters.bedrooms || ""}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </Select>
          </div>
          
          <div>
            <Label className="block mb-2">Bathrooms</Label>
            <Select
              value={filters.bathrooms || ""}
              onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </Select>
          </div>
          
          <div>
            <Label className="block mb-2">Property Type</Label>
            <Select
              value={filters.propertyType || ""}
              onChange={(e) => handleFilterChange("propertyType", e.target.value)}
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <Label className="block mb-2">Location</Label>
            <Input
              type="text"
              placeholder="City, State or ZIP"
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
          
          <div className="flex items-end gap-2 md:col-span-2">
            <Button 
              onClick={onApplyFilters}
              className="flex-1"
            >
              <ApperIcon name="Filter" size={16} className="mr-2" />
              Apply Filters
            </Button>
            <Button 
              variant="secondary" 
              onClick={onClearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;