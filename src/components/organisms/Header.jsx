import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ comparisonCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: "/", label: "Search", icon: "Search" },
    { path: "/map", label: "Map", icon: "Map" },
    { path: "/favorites", label: "Favorites", icon: "Heart" },
    { path: "/comparison", label: "Compare", icon: "Scale", badge: comparisonCount },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const { ApperUI } = window.ApperSDK;
      await ApperUI.logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
              <ApperIcon name="Home" size={24} className="text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              PropertyScope
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  isActivePath(item.path)
                    ? "text-primary-600 bg-primary-50"
                    : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50"
                )}
              >
                <ApperIcon name={item.icon} size={18} className="mr-2" />
                {item.label}
                {item.badge > 0 && (
                  <span className="ml-2 bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="ml-4"
            >
              <ApperIcon name="LogOut" size={16} className="mr-2" />
              Logout
            </Button>
          </nav>

{/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
            >
              <ApperIcon name="LogOut" size={16} />
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-secondary-600 hover:text-primary-600 hover:bg-primary-50"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                    isActivePath(item.path)
                      ? "text-primary-600 bg-primary-50"
                      : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} className="mr-3" />
                  {item.label}
                  {item.badge > 0 && (
                    <span className="ml-auto bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;