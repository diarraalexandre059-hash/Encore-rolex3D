import React, { useState } from 'react';
import { Truck, Check, Phone, User, MapPin, Building, ShieldCheck, ShoppingBag } from 'lucide-react';

const BUNDLES = [
  {
    id: 1,
    title: '1 Flacon ALIVER (Noir)',
    badge: 'Offre Découverte',
    priceXOF: 7500,
    oldPriceXOF: 10000,
    savingsXOF: 2500,
    isPopular: false,
  },
  {
    id: 2,
    title: 'Pack Duo (2 Flacons)',
    badge: 'Le Plus Populaire - Économisez 7 000 FCFA',
    priceXOF: 13000,
    oldPriceXOF: 20000,
    savingsXOF: 7000,
    isPopular: true,
  },
  {
    id: 3,
    title: 'Pack Famille / Barbiers (3 Flacons)',
    badge: 'Meilleure Valeur - Économisez 12 000 FCFA',
    priceXOF: 18000,
    oldPriceXOF: 30000,
    savingsXOF: 12000,
    isPopular: false,
  }
];

export default function OrderForm({ currency, formatPrice, selectedBundle, setSelectedBundle }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: 'Ouagadougou',
    address: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentBundleObj = BUNDLES.find(b => b.id === selectedBundle) || BUNDLES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Adresse).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          bundle_quantity: selectedBundle,
          unit_price: currentBundleObj.priceXOF,
          total_price: currentBundleObj.priceXOF,
          currency: currency,
          notes: formData.notes
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessOrder({
          id: data.orderId,
          ...formData,
          bundleTitle: currentBundleObj.title,
          totalPriceFormatted: formatPrice(currentBundleObj.priceXOF)
        });
      } else {
        setErrorMsg(data.error || 'Erreur lors de la validation. Veuillez réessayer.');
      }
    } catch (err) {
      setErrorMsg('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
          Commande Confirmée avec Succès !
        </h3>
        <p className="text-sm text-emerald-700 font-bold mb-6">
          Numéro de commande : #{successOrder.id}
        </p>

        <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2.5 text-sm mb-6 border border-gray-200">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Produit sélectionné :</span>
            <span className="font-bold text-slate-900">{successOrder.bundleTitle}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Montant total à payer à la livraison :</span>
            <span className="font-extrabold text-pink-600 text-base">{successOrder.totalPriceFormatted}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Client :</span>
            <span className="font-semibold text-slate-800">{successOrder.full_name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Téléphone / WhatsApp :</span>
            <span className="font-semibold text-slate-800">{successOrder.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Adresse de livraison :</span>
            <span className="font-semibold text-slate-800">{successOrder.city}, {successOrder.address}</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs mb-6">
          📞 <strong>Prochaine étape :</strong> Un membre de notre équipe va vous contacter par appel ou WhatsApp au <strong>{successOrder.phone}</strong> pour confirmer le créneau de livraison.
        </div>

        <button
          onClick={() => setSuccessOrder(null)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition w-full text-sm"
        >
          Passer une autre commande
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Bundle Selection Step */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-pink-500" />
          1. Choisissez votre Offre :
        </h3>

        <div className="space-y-3">
          {BUNDLES.map((bundle) => {
            const isSelected = selectedBundle === bundle.id;
            return (
              <div
                key={bundle.id}
                onClick={() => setSelectedBundle(bundle.id)}
                className={`p-4 rounded-xl border-2 transition cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-800 border-pink-500 shadow-lg shadow-pink-900/20'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                {bundle.badge && (
                  <span className={`absolute -top-3 right-4 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow ${
                    bundle.isPopular ? 'bg-pink-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {bundle.badge}
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-pink-500 bg-pink-600' : 'border-slate-500'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{bundle.title}</h4>
                      <p className="text-xs text-slate-400">Teinte : Noir Intense (0.14 oz)</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-extrabold text-pink-400">
                      {formatPrice(bundle.priceXOF)}
                    </div>
                    <div className="text-xs line-through text-slate-400">
                      {formatPrice(bundle.oldPriceXOF)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
          <Truck className="w-6 h-6 text-pink-500 flex-shrink-0" />
          <p className="text-xs text-slate-300">
            <strong>Livraison Rapide Gratuite</strong> à Ouagadougou. Paiement 100% sécurisé en espèces uniquement à la réception de votre colis.
          </p>
        </div>
      </div>

      {/* Customer Form Step */}
      <div className="lg:col-span-5 bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-pink-600" />
          2. Vos Coordonnées de Livraison :
        </h3>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nom et Prénom *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Paul Sawadogo"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Numéro Téléphone / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                placeholder="Ex: +226 70 00 00 00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ville *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white font-medium text-slate-800"
              >
                <option value="Ouagadougou">Ouagadougou (Livraison 24h)</option>
                <option value="Bobo-Dioulasso">Bobo-Dioulasso</option>
                <option value="Koudougou">Koudougou</option>
                <option value="Autre Ville / Pays">Autre ville / Expédition sous-région</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Quartier / Adresse précise de livraison *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Koulouba, près de la banque CORIS"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Sous-total ({currentBundleObj.title}) :</span>
              <span>{formatPrice(currentBundleObj.priceXOF)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Frais de livraison :</span>
              <span className="text-emerald-600 font-bold">GRATUIT</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-dashed">
              <span>Total à payer à la livraison :</span>
              <span className="text-pink-600">{formatPrice(currentBundleObj.priceXOF)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-pink-200 transition text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Traitement en cours...</span>
            ) : (
              <>
                <span>VALIDER MA COMMANDE</span>
                <ShieldCheck className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Aucun paiement en ligne requis - Vous payez en espèces au livreur
          </p>
        </form>
      </div>
    </div>
  );
}
