import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, CheckCircle, Clock, XCircle, Trash2, Phone, MapPin, Filter, Download } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert('Erreur lors du changement de statut.');
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la commande #${orderId} ?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
      }
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'Tous' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter(o => o.status === 'Livré')
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

  const pendingCount = orders.filter(o => o.status === 'En attente').length;
  const confirmedCount = orders.filter(o => o.status === 'Confirmé').length;
  const deliveredCount = orders.filter(o => o.status === 'Livré').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Commandes</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{orders.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase">En Attente de Confirmation</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-blue-600 uppercase">Confirmées & En cours</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{confirmedCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase">Chiffre d'Affaires Encaissé</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalRevenue.toLocaleString('fr-FR')} FCFA</p>
          <span className="text-[10px] text-gray-400">({deliveredCount} commandes livrées)</span>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Rechercher nom, tel, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 text-sm font-medium border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Confirmé">Confirmé</option>
              <option value="Livré">Livré</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-2.5 rounded-lg transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-300 text-xs uppercase">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Client & Contact</th>
                <th className="p-3.5">Ville & Adresse</th>
                <th className="p-3.5">Offre & Quantité</th>
                <th className="p-3.5">Montant Total</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400 text-sm">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900">#{order.id}</td>
                    <td className="p-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{order.full_name}</div>
                      <a href={`tel:${order.phone}`} className="text-xs text-pink-600 hover:underline flex items-center gap-1 mt-0.5 font-semibold">
                        <Phone className="w-3 h-3" /> {order.phone}
                      </a>
                    </td>
                    <td className="p-3.5 text-xs">
                      <span className="font-bold text-slate-900 block">{order.city}</span>
                      <span className="text-gray-500">{order.address}</span>
                    </td>
                    <td className="p-3.5 text-xs">
                      <span className="bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded">
                        {order.bundle_quantity} Unit.
                      </span>
                    </td>
                    <td className="p-3.5 font-extrabold text-pink-600 whitespace-nowrap">
                      {order.total_price.toLocaleString('fr-FR')} {order.currency || 'FCFA'}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none border ${
                          order.status === 'Livré'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : order.status === 'Confirmé'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : order.status === 'Annulé'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="En attente">⏳ En attente</option>
                        <option value="Confirmé">📞 Confirmé</option>
                        <option value="Livré">✅ Livré</option>
                        <option value="Annulé">❌ Annulé</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDelete(order.id)}
                        title="Supprimer la commande"
                        className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
