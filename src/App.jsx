import React, { useState, useEffect } from 'react';
import {
  CheckCircle, ShieldCheck, Truck, Star, Sparkles,
  ArrowDown, PhoneCall, RefreshCw, Scissors, Flame
} from 'lucide-react';
import OrderForm from './components/OrderForm';
import AdminDashboard from './components/AdminDashboard';

const CURRENCIES = {
  XOF: { symbol: 'FCFA', rate: 1, label: 'FCFA (Burkina, Ségal, CI...)' },
  EUR: { symbol: '€', rate: 0.00152, label: 'EUR (€)' },
  USD: { symbol: '$', rate: 0.00165, label: 'USD ($)' },
  GHS: { symbol: 'GH₵', rate: 0.025, label: 'GHS (Ghana)' },
  NGN: { symbol: '₦', rate: 2.5, label: 'NGN (Nigeria)' }
};

export default function App() {
  const [currency, setCurrency] = useState('XOF');
  const [selectedBundle, setSelectedBundle] = useState(1);
  const [isAdminView, setIsAdminView] = useState(window.location.pathname === '/admin');

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminView(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const formatPrice = (xofAmount) => {
    const curr = CURRENCIES[currency];
    const converted = xofAmount * curr.rate;
    if (currency === 'XOF') {
      return `${xofAmount.toLocaleString('fr-FR')} ${curr.symbol}`;
    } else if (currency === 'EUR' || currency === 'USD') {
      return `${converted.toFixed(2)} ${curr.symbol}`;
    } else {
      return `${Math.round(converted).toLocaleString('fr-FR')} ${curr.symbol}`;
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('order-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isAdminView) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center px-6">
          <div className="flex items-center gap-2">
            <span className="bg-pink-600 text-white font-black px-2 py-1 rounded text-sm">ALIVER</span>
            <h1 className="font-bold text-lg">Tableau de Bord Administrateur</h1>
          </div>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              setIsAdminView(false);
            }}
            className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition border border-slate-700"
          >
            ← Retour à la boutique
          </button>
        </header>
        <main className="max-w-7xl mx-auto py-8 px-4">
          <AdminDashboard />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Notification Bar */}
      <div className="bg-pink-600 text-white text-xs sm:text-sm py-2 px-4 text-center font-semibold flex items-center justify-center gap-2 shadow-inner">
        <Flame className="w-4 h-4 animate-bounce" />
        <span>PROMOTION SPÉCIALE : -25% REDUCTION + LIVRAISON GRATUITE À OUAGADOUGOU !</span>
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-pink-500 font-extrabold text-lg px-2.5 py-1 rounded-lg tracking-wider">
              AL'IVER
            </span>
            <span className="font-bold text-slate-800 hidden sm:inline text-sm">Hair & Beard Care</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-100 text-xs sm:text-sm font-semibold text-slate-800 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {Object.entries(CURRENCIES).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.label}
                </option>
              ))}
            </select>

            <button
              onClick={scrollToForm}
              className="bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-pink-200 transition"
            >
              Commander
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white pt-6 pb-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* Product Image Showcase */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -top-4 -left-4 bg-pink-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-lg z-10 animate-pulse">
                ★ BEST-SELLER RETOUCHE
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-2xl bg-slate-950 p-2">
                <img
                  src="/images/aliver-hair-shadow-black.jpeg"
                  alt="ALIVER Hair Shadow Powder Noir"
                  className="w-full object-cover rounded-xl max-h-[480px]"
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs font-semibold text-gray-600 bg-gray-100 py-2 rounded-xl">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Miroir & Éponge Intégrés</span>
                <span className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-amber-500" /> Teinte : Noir Intense</span>
              </div>
            </div>

            {/* Product Details & Pitch */}
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-slate-600 font-bold text-sm ml-2">4.9/5 (248+ avis clients)</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Poudre de Retouche Racines, Cheveux & Barbe <span className="text-pink-600">ALIVER (Noir)</span>
              </h1>

              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Retrouvez instantanément une chevelure dense et une barbe parfaitement tracée ! Masque les chevelures clairsemées, les zones dégarnies et les cheveux blancs en moins de 10 secondes.
              </p>

              {/* Price Tag */}
              <div className="mt-6 p-4 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-pink-700 uppercase tracking-wider block">Prix Spécial Promotionnel</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-slate-900">{formatPrice(7500)}</span>
                    <span className="text-lg line-through text-gray-400 font-semibold">{formatPrice(10000)}</span>
                  </div>
                </div>
                <span className="bg-pink-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-sm">
                  -25% DE RÉDUCTION
                </span>
              </div>

              {/* Quick Benefits Bullet points */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    <strong>Pour les Femmes :</strong> Cache les zones fines devant (bordures/baby hair fragiles dues aux tresses) & les racines blanches.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    <strong>Pour les Hommes :</strong> Comble les trous dans la barbe et redessine parfaitement les contouring / golfes.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    <strong>Résistant à l'eau & la sueur :</strong> Tient toute la journée même sous forte chaleur.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    <strong>Format Compact Tout-en-un :</strong> Houpette-éponge douce sous la bouteille + miroir intégré.
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-lg py-4 px-6 rounded-xl shadow-xl hover:shadow-pink-200 transition flex items-center justify-center gap-2 animate-pulse-subtle"
                >
                  Commander Maintenant (Payer à la Livraison)
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <Truck className="w-4 h-4 text-pink-600" />
                  <span>Livraison Rapide 24h-48h</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-pink-600" />
                  <span>Paiement Cash à la Réception</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences Highlight Section */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-pink-500 font-bold text-xs tracking-wider uppercase bg-pink-950/80 px-3 py-1 rounded-full border border-pink-800">
              Solution Polyvalente
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">
              Conçu pour Elle & pour Lui
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Une formule poudre minérale naturelle d'haute précision couleur Noir Intense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Women Card */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
              <div className="w-12 h-12 bg-pink-600/20 text-pink-500 rounded-xl flex items-center justify-center font-bold mb-4">
                👩
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pour les Femmes</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span><strong>Devanture & Baby Hair :</strong> Restaure l'apparence des cheveux fins sur les bordures fragilisées par les tresses serrées ou tissages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span><strong>Camouflage des Racines :</strong> Masque les cheveux blancs entre deux teintures en quelques secondes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span><strong>Raies & Cuir Chevelu :</strong> Redonne du volume aux raies trop visibles.</span>
                </li>
              </ul>
            </div>

            {/* Men Card */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center font-bold mb-4">
                🧔
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pour les Hommes</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Barbe Dégarnie :</strong> Comble les trous et zones clairsemées dans la barbe pour un aspect plus fourni et homogène.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Golfes & Hairline :</strong> Redessine la ligne de contour des cheveux pour une coupe toujours fraîche.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Rendu Ultra Discret :</strong> La poudre s'intègre naturellement sans effet peinture ni traces.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pourquoi tout le monde adore ALIVER ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Effet Instantané</h4>
              <p className="text-xs text-gray-500">Appliquez avec la houpette et obtenez un résultat naturel en moins de 10 secondes.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Anti-Transpiration</h4>
              <p className="text-xs text-gray-500">Résiste à la chaleur, la sueur et la pluie. Ne coule pas au cours de la journée.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Scissors className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Ingrédients Doux</h4>
              <p className="text-xs text-gray-500">Formule naturelle non agressive qui n'obstrue pas les pores et respecte le cuir chevelu.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Facile à Laver</h4>
              <p className="text-xs text-gray-500">S'élimine très facilement lors de votre shampooing habituel sans laisser de résidus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900 mb-8">
            Comment l'utiliser en 3 étapes simples ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl text-center relative border border-gray-100">
              <span className="w-8 h-8 bg-pink-600 text-white font-extrabold rounded-full flex items-center justify-center mx-auto mb-4 text-sm shadow">1</span>
              <h3 className="font-bold text-slate-900 mb-2">Ouvrir le boîtier</h3>
              <p className="text-xs text-gray-600">Ouvrez le capuchon supérieur et détachez l'éponge applicatrice située en bas de la bouteille.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center relative border border-gray-100">
              <span className="w-8 h-8 bg-pink-600 text-white font-extrabold rounded-full flex items-center justify-center mx-auto mb-4 text-sm shadow">2</span>
              <h3 className="font-bold text-slate-900 mb-2">Tamponner la poudre</h3>
              <p className="text-xs text-gray-600">Prenez un peu de poudre avec la houpette puis tapotez doucement sur les zones dégarnies ou les racines.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center relative border border-gray-100">
              <span className="w-8 h-8 bg-pink-600 text-white font-extrabold rounded-full flex items-center justify-center mx-auto mb-4 text-sm shadow">3</span>
              <h3 className="font-bold text-slate-900 mb-2">Admirer le résultat !</h3>
              <p className="text-xs text-gray-600">Utilisez le miroir intégré pour vérifier. Vos cheveux et votre barbe paraissent plus denses instantanément.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section with Bundle Selection */}
      <section id="order-section" className="py-12 bg-slate-900 text-white scroll-mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="bg-pink-600 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              OFFRE LIMITÉE - OFFRES PACKS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3">
              Passez votre Commande Directe
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Remplissez le formulaire ci-dessous. Paiement au livreur à la réception de votre colis !
            </p>
          </div>

          <OrderForm
            currency={currency}
            formatPrice={formatPrice}
            selectedBundle={selectedBundle}
            setSelectedBundle={setSelectedBundle}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 text-center text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p>© {new Date().getFullYear()} ALIVER Hair & Beard Care - Tous droits réservés.</p>
            <p className="text-slate-500 mt-1">Livraison express disponible à Ouagadougou et expédition dans la sous-région.</p>
          </div>
          <div>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/admin');
                setIsAdminView(true);
              }}
              className="text-slate-500 hover:text-slate-300 underline text-xs"
            >
              Espace Administrateur
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
