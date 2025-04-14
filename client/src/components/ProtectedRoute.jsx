import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsAuthChecked } from '../store/authStore.store';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const isAuthChecked = useAuthStore(selectIsAuthChecked);

   

    if (!isAuthenticated && isAuthChecked) {
    
        return <Navigate to="/login" replace />;
    }

 
    return children ? children : <Outlet />;
};

export default ProtectedRoute;