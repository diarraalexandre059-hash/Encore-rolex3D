import React, { useState, useEffect } from 'react';
import {
  CheckCircle, ShieldCheck, Truck, Star, Sparkles,
  ArrowDown, PhoneCall, RefreshCw, Scissors, Flame,
  HelpCircle, ChevronDown, Eye, Layers, Check, Zap, ShoppingBag, Download, FileCode
} from 'lucide-react';
import OrderForm from './components/OrderForm';
import AdminDashboard from './components/AdminDashboard';

const CURRENCIES = {
  XOF: { symbol: 'FCFA', rate: 1, label: 'FCFA (Burkina, Sénégal, CI...)' },
  EUR: { symbol: '€', rate: 0.00152, label: 'EUR (€)' },
  USD: { symbol: '$', rate: 0.00165, label: 'USD ($)' },
  GHS: { symbol: 'GH₵', rate: 0.025, label: 'GHS (Ghana)' },
  NGN: { symbol: '₦', rate: 2.5, label: 'NGN (Nigeria)' }
};

const FAQ_ITEMS = [
  {
    question: "La poudre ALIVER résiste-t-elle à la sueur et à la chaleur ?",
    answer: "Oui ! La formule à base de pigments minéraux micro-finis est spécialement conçue pour être 100% Waterproof et Sweatproof. Elle ne coule pas, même sous une forte chaleur ou lors d'activités physiques intenses."
  },
  {
    question: "Est-ce adapté pour la barbe des hommes et les cheveux des femmes ?",
    answer: "Absolument. Elle est universelle : pour les femmes, elle masque les racines blanches et redonne de l'épaisseur aux bordures fragilisées par les tresses. Pour les hommes, elle comble parfaitement les trous dans la barbe et ajuste les contours de la chevelure."
  },
  {
    question: "Comment s'enlève la poudre ?",
    answer: "La poudre s'élimine de manière très simple lors de votre shampooing habituel avec de l'eau tiède et du savon ou shampooing. Elle ne laisse aucun résidu collant ni tache."
  },
  {
    question: "Combien de temps dure un flacon de 0.14 oz (4g) ?",
    answer: "Pour une utilisation quotidienne sur les racines ou la barbe, un flacon dure en moyenne entre 2 et 3 mois."
  },
  {
    question: "Comment se passe la livraison à Ouagadougou et en province ?",
    answer: "La livraison est GRATUITE à Ouagadougou en 24h. Vous payez en espèces au livreur après avoir vérifié votre colis. Pour les autres villes du Burkina ou de la sous-région, des expéditions express sont organisées."
  }
];

const PRODUCT_VIEWS = [
  {
    id: 'main',
    title: 'Vue Principale',
    badge: 'Packaging & Compact',
    src: '/images/aliver-hair-shadow-black.jpeg',
    description: 'Format compact tout-en-un élégant couleur Noir Intense'
  },
  {
    id: 'mirror',
    title: 'Miroir & Poudre',
    badge: 'Boîtier Ouvert',
    src: '/images/aliver-hair-shadow-black.jpeg',
    description: 'Ouverture supérieure avec miroir haute définition pour retouches express'
  },
  {
    id: 'puff',
    title: 'Houpette Éponge',
    badge: 'Base Applicatrice',
    src: '/images/aliver-hair-shadow-black.jpeg',
    description: 'Éponge douce amovible intégrée sous le boîtier pour un dosage précis'
  },
  {
    id: 'usage',
    title: 'Rendu Avant / Après',
    badge: 'Application Hairline',
    src: '/images/aliver-hair-shadow-black.jpeg',
    description: 'Résultat immédiat : densité naturelle sur la barbe et la ligne frontale'
  }
];

export default function App() {
  const [currency, setCurrency] = useState('XOF');
  const [selectedBundle, setSelectedBundle] = useState(1);
  const [isAdminView, setIsAdminView] = useState(window.location.pathname === '/admin');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
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

  const activeView = PRODUCT_VIEWS[activeImageIndex];

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-16 md:pb-0">
      {/* Top Notification Bar with Direct Download Link */}
      <div className="bg-pink-600 text-white text-xs sm:text-sm py-2 px-4 text-center font-semibold flex flex-wrap items-center justify-center gap-3 shadow-inner">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 animate-bounce" />
          <span>PROMOTION SPÉCIALE : -25% RÉDUCTION + LIVRAISON GRATUITE À OUAGADOUGOU !</span>
        </div>
        <a
          href="/aliver-ecommerce-site.zip"
          download="aliver-ecommerce-site.zip"
          className="bg-white text-pink-700 hover:bg-pink-50 font-black text-xs px-3 py-1 rounded-full shadow flex items-center gap-1.5 transition border border-pink-200"
        >
          <Download className="w-3.5 h-3.5" />
          Télécharger le projet complet (.ZIP)
        </a>
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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct ZIP Download Link */}
            <a
              href="/aliver-ecommerce-site.zip"
              download="aliver-ecommerce-site.zip"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow flex items-center gap-1.5 transition border border-slate-800"
              title="Télécharger l'archive ZIP du site"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Télécharger ZIP</span>
            </a>

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
              className="bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow-md hover:shadow-pink-200 transition"
            >
              Commander
            </button>
          </div>
        </div>
      </header>

      {/* Direct Source Download Callout Banner */}
      <div className="bg-slate-900 text-white py-3 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold flex-shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Code Source & Projet Complet Prêt à Déployer</p>
              <p className="text-[11px] text-slate-400">Contient le frontend React/Tailwind, le backend Express/SQLite, la base de données et l'espace Admin.</p>
            </div>
          </div>
          <a
            href="/aliver-ecommerce-site.zip"
            download="aliver-ecommerce-site.zip"
            className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-extrabold text-xs px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2 flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            Télécharger aliver-ecommerce-site.zip
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white pt-6 pb-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Interactive Multi-View Gallery */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="rounded-2xl overflow-hidden border-2 border-pink-100 shadow-2xl bg-slate-950 p-2">
                <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-900 relative flex items-center justify-center">
                  <img
                    src={activeView.src}
                    alt={`ALIVER Hair Shadow - ${activeView.title}`}
                    className="w-full h-full object-cover object-center rounded-xl transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-pink-500/40 text-pink-400 font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                    {activeView.badge}
                  </div>
                </div>
              </div>

              {/* View Selection Thumbnails */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                {PRODUCT_VIEWS.map((view, index) => (
                  <button
                    key={view.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative rounded-xl overflow-hidden border-2 p-1 text-left transition duration-200 bg-white ${
                      activeImageIndex === index
                        ? 'border-pink-600 shadow-md ring-2 ring-pink-500/20'
                        : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 relative">
                      <img src={view.src} alt={view.title} className="w-full h-full object-cover" />
                      {activeImageIndex === index && (
                        <div className="absolute inset-0 bg-pink-600/10" />
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-800 mt-1 truncate text-center">
                      {view.title}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-600 bg-gray-100 py-2.5 px-3 rounded-xl border border-gray-200">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Miroir & Éponge Intégrés</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500" /> Teinte : Noir Intense</span>
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
              Une formule poudre minérale naturelle de haute précision couleur Noir Intense.
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
                  <span><strong>Rendu Ultra Discret :</strong> La poudre s'intègre naturally sans effet peinture ni traces.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to use - Enhanced with Rich Visual Illustrations */}
      <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="bg-pink-100 text-pink-700 font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              FACILE & RAPIDE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Mode d'Emploi Illustré en 3 Étapes
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Un résultat naturel en moins de 10 secondes grâce à son design tout-en-un breveté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-100 rounded-full opacity-50 group-hover:scale-150 transition duration-500" />

              <div>
                <div className="bg-slate-900 text-white rounded-xl p-5 mb-5 h-44 flex flex-col items-center justify-center relative border border-slate-800 shadow-inner">
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">1</span>

                  <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 border-2 border-pink-500/80 rounded-full flex items-center justify-center bg-slate-800 shadow-lg animate-bounce">
                      <Layers className="w-8 h-8 text-pink-400" />
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-pink-300 bg-pink-950/80 px-2.5 py-1 rounded-md border border-pink-800">
                      Déclipsez la houpette
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-2">1. Ouvrir le Boîtier</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Ouvrez le capuchon supérieur pour accéder au miroir et détachez la douce éponge applicatrice intégrée sous la base de la bouteille.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-pink-600">
                <Check className="w-4 h-4 mr-1" /> Éponge & Miroir 100% intégrés
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-100 rounded-full opacity-50 group-hover:scale-150 transition duration-500" />

              <div>
                <div className="bg-slate-900 text-white rounded-xl p-5 mb-5 h-44 flex flex-col items-center justify-center relative border border-slate-800 shadow-inner">
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">2</span>

                  <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 border-2 border-amber-500/80 rounded-full flex items-center justify-center bg-slate-800 shadow-lg">
                      <Zap className="w-8 h-8 text-amber-400 animate-pulse" />
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800">
                      Tapotez doucement
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-2">2. Tamponner la Poudre</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Prenez un peu de poudre avec la houpette puis tapotez délicatement sur les zones dégarnies, les racines blanches ou les trous de la barbe.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-pink-600">
                <Check className="w-4 h-4 mr-1" /> Application propre sans coulure
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-100 rounded-full opacity-50 group-hover:scale-150 transition duration-500" />

              <div>
                <div className="bg-slate-900 text-white rounded-xl p-5 mb-5 h-44 flex flex-col items-center justify-center relative border border-slate-800 shadow-inner">
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">3</span>

                  <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 border-2 border-emerald-500/80 rounded-full flex items-center justify-center bg-slate-800 shadow-lg">
                      <Eye className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                      Densité 100% Naturelle
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-2">3. Admirer le Résultat</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Contrôlez le rendu à l'aide du miroir intégré. Vos cheveux et votre barbe paraissent immédiatement denses, épais et structurés.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-pink-600">
                <Check className="w-4 h-4 mr-1" /> Tient jusqu'au prochain shampooing
              </div>
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

      {/* FAQ Section */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="bg-pink-100 text-pink-700 font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              QUESTIONS FRÉQUENTES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-pink-600" />
              Foire Aux Questions (FAQ)
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Des réponses claires à vos interrogations avant de passer commande.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 font-bold text-slate-900 flex justify-between items-center hover:bg-gray-100/80 transition text-sm sm:text-base"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={`w-5 h-5 text-pink-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200/60 bg-white">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Sticky Mobile Quick Order CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-200 p-3 shadow-2xl md:hidden flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Promo ALIVER Noir</p>
          <p className="text-lg font-black text-slate-900 leading-none">{formatPrice(7500)}</p>
        </div>
        <button
          onClick={scrollToForm}
          className="flex-1 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          Commander (Payer à la Livraison)
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 text-center text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p>© {new Date().getFullYear()} ALIVER Hair & Beard Care - Tous droits réservés.</p>
            <p className="text-slate-500 mt-1">Livraison express disponible à Ouagadougou et expédition dans la sous-région.</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/aliver-ecommerce-site.zip"
              download="aliver-ecommerce-site.zip"
              className="text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 underline"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger le Projet (.ZIP)
            </a>
            <span className="text-slate-700">|</span>
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
