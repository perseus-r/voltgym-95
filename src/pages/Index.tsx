import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import SalesHero from '@/components/sections/SalesHero';
import SalesFeatures from '@/components/sections/SalesFeatures';
import SalesPricing from '@/components/sections/SalesPricing';
import Footer from '@/components/Footer';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-main text-txt">
      <SalesHero />
      <SalesFeatures />
      <SalesPricing />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;