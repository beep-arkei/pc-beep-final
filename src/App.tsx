/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { PCBuilder } from './pages/PCBuilder';
import { Auth } from './pages/Auth';
import { Cart } from './pages/Cart';
import { Credits } from './pages/Credits';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrderDetailsDashboard } from './pages/OrderDetailsDashboard';
import { CustomerDetailsDashboard } from './pages/CustomerDetailsDashboard';
import { Support } from './pages/Support';
import { Checkout } from './pages/Checkout';
import { TrackOrder } from './pages/TrackOrder';
import { OrderTrackingDetails } from './pages/OrderTrackingDetails';
import { ProfileDashboard } from './pages/ProfileDashboard';
import { AddressDashboard } from './pages/AddressDashboard';
import { HelpCenter } from './pages/HelpCenter';
import { NotFound } from './pages/NotFound';
import { BeepBot } from './components/BeepBot';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export default function App() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const fetchProfile = async (sessionUser: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();
      
      let finalProfile = data;
      
      // If profile is missing, create a temporary one
      if (!data) {
        finalProfile = {
          id: sessionUser.id,
          username: sessionUser.user_metadata?.username || sessionUser.email?.split('@')[0] || 'User',
          role: 'buyer',
          created_at: new Date().toISOString()
        };
      }

      // Force roles for specific test accounts
      let roleChanged = false;
      if (sessionUser.email === 'ryankaitobeppu@gmail.com') {
        if (finalProfile.role !== 'owner') {
          finalProfile.role = 'owner';
          roleChanged = true;
        }
      } else if (sessionUser.email === 'rkbeppu@gmail.com') {
        if (finalProfile.role !== 'admin') {
          finalProfile.role = 'admin';
          roleChanged = true;
        }
      } else if (sessionUser.email === 'rkpbeppu@universityofbohol.edu.ph') {
        if (finalProfile.role !== 'buyer') {
          finalProfile.role = 'buyer';
          roleChanged = true;
        }
      }

      // Persist the profile to the database if it's new or the role was forced
      // This is crucial for Storage RLS policies to recognize the user's role
      if (!data || roleChanged) {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(finalProfile);
        
        if (upsertError) {
          console.error('Error syncing profile to database:', upsertError);
          // If upsert fails (likely RLS), we still use the local profile so the app remains usable
        }
      }
      
      setUser(finalProfile);
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const isOwner = user?.role === 'owner';

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/builder" element={<PCBuilder />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/track/:id" element={<OrderTrackingDetails />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<ProfileDashboard />} />
          <Route path="/dashboard/addresses" element={<AddressDashboard />} />
          <Route path="/dashboard/orders/:id" element={isAdmin ? <OrderDetailsDashboard /> : <Dashboard />} />
          <Route path="/dashboard/customers/:id" element={isAdmin ? <CustomerDetailsDashboard /> : <Dashboard />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Dashboard />} />
          <Route path="/owner" element={<Navigate to="/admin" replace />} />
          <Route path="/owner-dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/support" element={<Support />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BeepBot />
        <Toaster position="bottom-right" />
      </Layout>
    </Router>
  );
}
