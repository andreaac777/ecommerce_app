import { Navigate, Routes, Route } from 'react-router';
import { useAuth, useUser } from '@clerk/clerk-react';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import CouponsPage from './pages/CouponsPage';

import DashboardLayout from './layouts/DashboardLayout';
import PageLoader from './components/PageLoader';

function App() {
    const { isSignedIn, isLoaded } = useAuth();
    const { user, isLoaded: userLoaded } = useUser();

    if (!isLoaded || !userLoaded) {
        return <PageLoader />;
    }
    const isAdmin = user?.publicMetadata?.role === 'admin';

    if (import.meta.env.DEV) {
        console.log('Auth check:', {
            email: user?.primaryEmailAddress?.emailAddress,
            role: user?.publicMetadata?.role,
            isAdmin,
            isSignedIn
        });
    }

    return (
        <Routes>
            <Route 
                path="/login" 
                element={
                    isSignedIn 
                        ? (isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/unauthorized" />) 
                        : <LoginPage />
                }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route 
                path="/" 
                element={
                    !isSignedIn ? (
                        <Navigate to="/login" />
                    ) : !isAdmin ? (
                        <Navigate to="/unauthorized" replace />
                    ) : (
                        <DashboardLayout />
                    )
                }
            >
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="coupons" element={<CouponsPage />} />
            </Route>
        </Routes>      
    );
}

export default App;