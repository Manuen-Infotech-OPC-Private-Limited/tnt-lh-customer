import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { BrandProvider } from './context/BrandContext';
import { Toaster } from 'react-hot-toast';
import SocketListener from './components/SocketListener';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartDrawer from './components/CartDrawer';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import SeasonalPage from './pages/SeasonalPage';
import PrivacyPage from './pages/PrivacyPage';
import Footer from './components/Footer';

// Scroll to top helper component on page transition
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Placeholder pages for those not yet created to prevent build errors
const CartPage = () => <div className="pt-32 text-center text-4xl font-bold text-emerald-600">Cart Coming Soon</div>;

const TeasRoot = () => {
  return (
    <div className="relative min-h-screen flex flex-col font-sans antialiased text-slate-800 bg-slate-50">
      <Navbar />
      <CartDrawer />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/seasonal" element={<SeasonalPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Backward compatibility redirects for legacy /teasntrees/* paths */}
          <Route path="/teasntrees" element={<Navigate to="/" replace />} />
          <Route path="/teasntrees/menu" element={<Navigate to="/menu" replace />} />
          <Route path="/teasntrees/seasonal" element={<Navigate to="/seasonal" replace />} />
          <Route path="/teasntrees/about" element={<Navigate to="/about" replace />} />
          <Route path="/teasntrees/gallery" element={<Navigate to="/gallery" replace />} />
          <Route path="/teasntrees/reviews" element={<Navigate to="/reviews" replace />} />
          <Route path="/teasntrees/contact" element={<Navigate to="/contact" replace />} />
          <Route path="/teasntrees/wishlist" element={<Navigate to="/wishlist" replace />} />
          <Route path="/teasntrees/profile" element={<Navigate to="/profile" replace />} />
          <Route path="/teasntrees/checkout" element={<Navigate to="/checkout" replace />} />
          <Route path="/teasntrees/track-order/:orderId" element={<Navigate to="/track-order/:orderId" replace />} />
          <Route path="/teasntrees/order-success/:orderId" element={<Navigate to="/order-success/:orderId" replace />} />
          <Route path="/teasntrees/privacy" element={<Navigate to="/privacy" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <BrandProvider>
          <AuthProvider>
            <SocketProvider>
              <CartProvider>
                <WishlistProvider>
                  <Toaster position="top-right" />
                  <SocketListener />
                  <TeasRoot />
                </WishlistProvider>
              </CartProvider>
            </SocketProvider>
          </AuthProvider>
        </BrandProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
