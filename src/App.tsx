import { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import MarketAnalyzer from './components/MarketAnalyzer';
import AITools from './components/AITools';
import Ebook from './components/Ebook';
import Newsletter from './components/Newsletter';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicy from './components/PrivacyPolicy';
import AIToolModal from './components/modals/AIToolModal';
import EbookModal from './components/modals/EbookModal';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { AccountPage } from '@/pages/AccountPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { UpdatePasswordPage } from '@/pages/UpdatePasswordPage';
import { ProductCard } from '@/components/ProductCard';
import { stripeProducts } from '@/stripe-config';

function HomePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showEbookPayment, setShowEbookPayment] = useState(false);

  const aiToolConfigs = {
    explain: {
      title: 'AI Crypto Explainer',
      description: 'Wytłumaczenie projektu kryptowalutowego w prostym, zrozumiałym języku',
      placeholder: 'Wpisz nazwę projektu kryptowalutowego, np. "Ethereum", "Bitcoin", "Solana"...',
      endpoint: 'crypto-explain',
    },
    risk: {
      title: 'AI Risk Overview',
      description: 'Ocena ryzyk technologicznych i ogólnych (bez porad inwestycyjnych)',
      placeholder: 'Wpisz nazwę projektu lub opisz sytuację, którą chcesz przeanalizować...',
      endpoint: 'crypto-risk',
    },
    summary: {
      title: 'AI Market Summary',
      description: 'Neutralne, edukacyjne streszczenie wydarzeń rynkowych',
      placeholder: 'Wpisz temat lub pytanie o rynku krypto, np. "co dzieje się na rynku Bitcoin?"...',
      endpoint: 'crypto-summary',
    },
    whitepaper: {
      title: 'AI Simplified Whitepaper',
      description: 'Uproszczone streszczenie fragmentu technicznego whitepapera',
      placeholder: 'Wklej fragment whitepapera lub tekst techniczny do uproszczenia...',
      endpoint: 'crypto-whitepaper',
    },
  };

  const handleOpenTool = (toolId: string) => {
    setActiveModal(toolId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setShowEbookPayment(false);
  };

  const handleEbookPurchase = () => {
    setShowEbookPayment(true);
  };

  const currentToolConfig = activeModal && activeModal !== 'ebook' && activeModal !== 'privacy' && aiToolConfigs[activeModal as keyof typeof aiToolConfigs];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <Hero onOpenEbook={() => setActiveModal('ebook')} />
      <MarketAnalyzer />
      <AITools onOpenTool={handleOpenTool} />
      <Ebook onDownloadSample={() => setActiveModal('ebook')} onPurchase={handleEbookPurchase} />
      <Newsletter />
      <FAQ />
      <Footer onOpenPrivacy={() => setActiveModal('privacy')} />

      {currentToolConfig && (
        <AIToolModal
          title={currentToolConfig.title}
          description={currentToolConfig.description}
          placeholder={currentToolConfig.placeholder}
          endpoint={currentToolConfig.endpoint}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'ebook' && <EbookModal onClose={handleCloseModal} />}

      {activeModal === 'privacy' && <PrivacyPolicy onClose={handleCloseModal} />}

      {showEbookPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kup e-book</h2>
            {stripeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      <CookieBanner />
    </div>
  );
}

function App() {
  const { user, loading, signOut } = useAuth();

  return (
    <Router>
      <div className="min-h-screen">
        {loading ? (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-300">Ładowanie...</p>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/account" element={user ? <AccountPage /> : <Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
