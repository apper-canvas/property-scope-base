import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';
import Callback from '@/components/pages/Callback';
import ErrorPage from '@/components/pages/ErrorPage';
import Header from "@/components/organisms/Header";
import SearchPage from "@/components/pages/SearchPage";
import MapPage from "@/components/pages/MapPage";
import FavoritesPage from "@/components/pages/FavoritesPage";
import ComparisonPage from "@/components/pages/ComparisonPage";
import { ToastContainer } from "react-toastify";

// Create auth context
export const AuthContext = createContext(null);
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [comparisonItems, setComparisonItems] = useState([]);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const addToComparison = (property) => {
    if (comparisonItems.length >= 3) return;
    if (!comparisonItems.find(item => item.Id === property.Id)) {
      setComparisonItems(prev => [...prev, property]);
    }
  };

  const removeFromComparison = (propertyId) => {
    setComparisonItems(prev => prev.filter(item => item.Id !== propertyId));
  };
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route 
          path="/" 
          element={
            <div className="min-h-screen bg-background">
              <Header comparisonCount={comparisonItems.length} />
              <main>
                <SearchPage 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  comparisonItems={comparisonItems}
                  onAddToComparison={addToComparison}
                  onRemoveFromComparison={removeFromComparison}
                />
              </main>
            </div>
          } 
        />
        <Route 
          path="/map" 
          element={
            <div className="min-h-screen bg-background">
              <Header comparisonCount={comparisonItems.length} />
              <main>
                <MapPage 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </main>
            </div>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <div className="min-h-screen bg-background">
              <Header comparisonCount={comparisonItems.length} />
              <main>
                <FavoritesPage 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  comparisonItems={comparisonItems}
                  onAddToComparison={addToComparison}
                />
              </main>
            </div>
          } 
        />
        <Route 
          path="/comparison" 
          element={
            <div className="min-h-screen bg-background">
              <Header comparisonCount={comparisonItems.length} />
              <main>
                <ComparisonPage 
                  comparisonItems={comparisonItems}
                  onRemoveFromComparison={removeFromComparison}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </main>
            </div>
          } 
        />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </AuthContext.Provider>
  );
}

export default App;