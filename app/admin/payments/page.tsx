'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  IndianRupee,
  Search,
  X,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import Loader from '@/components/ui/Loader';

interface PaymentRecord {
  _id: string;
  ownerName: string;
  phone: string;
  service: 'featured' | 'verified' | 'ad';
  amount: number;
  paymentMethod: 'PhonePe' | 'GPay' | 'Cash';
  transactionId?: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stats
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingCollections, setPendingCollections] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [chartData, setChartData] = useState<{ name: string; value: number; color: string }[]>([]);

  // Modals & Forms
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState<'featured' | 'verified' | 'ad'>('featured');
  const [amount, setAmount] = useState('399');
  const [paymentMethod, setPaymentMethod] = useState<'PhonePe' | 'GPay' | 'Cash'>('PhonePe');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'overdue'>('paid');
  const [submitting, setSubmitting] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments');
      const json = await res.json();
      if (json.success && json.data) {
        const records: PaymentRecord[] = json.data;
        setPayments(records);

        // Aggregate statistics
        let paidSum = 0;
        let pendingSum = 0;
        let overdueSum = 0;
        let featSum = 0;
        let verifSum = 0;
        let adSum = 0;

        records.forEach((p) => {
          if (p.status === 'paid') {
            paidSum += p.amount;
            if (p.service === 'featured') featSum += p.amount;
            else if (p.service === 'verified') verifSum += p.amount;
            else if (p.service === 'ad') adSum += p.amount;
          } else if (p.status === 'pending') {
            pendingSum += p.amount;
          } else if (p.status === 'overdue') {
            overdueSum += p.amount;
          }
        });

        setTotalRevenue(paidSum);
        setPendingCollections(pendingSum);
        setOverdueCount(records.filter((p) => p.status === 'overdue').length);

        setChartData([
          { name: 'Featured Listings', value: featSum, color: '#D4AF37' },
          { name: 'Verified Stays', value: verifSum, color: '#0D9488' },
          { name: 'Advertisements', value: adSum, color: '#0F2E1E' },
        ].filter(d => d.value > 0)); // only show non-zero categories
      } else {
        toast.error('Failed to load payment logs');
      }
    } catch {
      toast.error('Failed to load payment logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    setPaymentDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Update default price based on service select
  useEffect(() => {
    if (service === 'featured') setAmount('399');
    else if (service === 'verified') setAmount('199');
    else if (service === 'ad') setAmount('999');
  }, [service]);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !phone.trim() || !amount) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName,
          phone,
          service,
          amount: Number(amount),
          paymentMethod,
          transactionId,
          date: paymentDate,
          status: paymentStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Payment log entry added!');
        setAddModalOpen(false);
        // Clear fields
        setOwnerName('');
        setPhone('');
        setTransactionId('');
        fetchPayments();
      } else {
        toast.error(json.error ?? 'Failed to add record');
      }
    } catch {
      toast.error('Failed to add record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'paid' | 'pending' | 'overdue') => {
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Payment status updated to ${newStatus}`);
        setPayments((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
        setStatusDropdownOpen(null);
        fetchPayments(); // Refresh sums
      } else {
        toast.error(json.error ?? 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm('Delete this payment log entry?')) return;
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Payment log deleted');
        setPayments((prev) => prev.filter((p) => p._id !== id));
        fetchPayments(); // Refresh sums
      } else {
        toast.error(json.error ?? 'Failed to delete record');
      }
    } catch {
      toast.error('Failed to delete record');
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      (p.transactionId && p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#1F2E1F] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white flex items-center gap-2">
            <CreditCard className="text-[#D4AF37]" size={24} />
            Manual UPI Payment Logs
          </h1>
          <p className="text-gray-500 text-xs mt-1">Track off-platform UPI payments collected for premium listings, verification inspections, and ad placements.</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-5 py-3 text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-center"
        >
          <Plus size={16} /> Log UPI Payment
        </button>
      </div>

      {/* Row 1: Revenue Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center text-[#16A34A]">
            <CheckCircle2 size={18} />
          </div>
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Total Earned Revenue</p>
          <h2 className="font-display text-3xl text-[#0F2E1E] dark:text-white mt-2 font-bold">₹{totalRevenue.toLocaleString('en-IN')}</h2>
          <p className="text-xs text-gray-500 mt-1">Cleared paid payments</p>
        </div>

        <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
            <AlertCircle size={18} />
          </div>
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Pending Collections</p>
          <h2 className="font-display text-3xl text-amber-500 mt-2 font-bold">₹{pendingCollections.toLocaleString('en-IN')}</h2>
          <p className="text-xs text-gray-500 mt-1">Awaiting confirmations</p>
        </div>

        <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
            <X size={18} />
          </div>
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Overdue Accounts</p>
          <h2 className="font-display text-3xl text-red-500 mt-2 font-bold">{overdueCount} Logs</h2>
          <p className="text-xs text-gray-500 mt-1">Action required</p>
        </div>
      </div>

      {/* Recharts Pie Chart & Summary Categories */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-semibold text-sm text-[#0F2E1E] dark:text-white mb-2">Revenue Breakdown by Service</h3>
            <p className="text-gray-500 text-xs leading-relaxed">UPI payments mapped to categories representing the distribution of paid premiums (Featured listings, Verification inspects, Advertisements).</p>
          </div>
          <div className="w-full md:w-80 h-44 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legends list */}
          <div className="flex flex-col gap-2 text-xs shrink-0 w-full md:w-auto">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-gray-500 truncate w-32 md:w-auto">{d.name}:</span>
                <span className="font-bold font-mono text-[#0F2E1E] dark:text-white">₹{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input bar */}
      <div className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by owner, phone, transaction..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Showing {filteredPayments.length} transactions
        </span>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center">
          <Loader size="lg" className="border-[#D4AF37] border-t-transparent" />
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl py-12 text-center border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <p className="text-gray-500 text-sm">No payment records found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-[#111A11] rounded-2xl border border-gray-100 dark:border-[#1F2E1F] overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#1F2E1F] text-gray-400 text-xs font-semibold uppercase bg-gray-50 dark:bg-[#0F2E1E]/5">
                  <th className="p-4">Owner Name</th>
                  <th className="py-4">Service</th>
                  <th className="py-4">Amount</th>
                  <th className="py-4">Method</th>
                  <th className="py-4">Transaction ID</th>
                  <th className="py-4">Date</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1F2E1F] text-xs font-medium">
                {filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-[#0F2E1E]/10 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{p.ownerName}</p>
                        <p className="text-gray-400 mt-0.5 font-mono">{p.phone}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                          p.service === 'featured' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                          p.service === 'verified' && 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
                          p.service === 'ad' && 'bg-[#0F2E1E]/10 text-[#0F2E1E] dark:bg-white/10 dark:text-white'
                        )}
                      >
                        {p.service}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900 dark:text-gray-100 font-mono">₹{p.amount}</td>
                    <td className="py-4 text-gray-500 dark:text-gray-400">{p.paymentMethod}</td>
                    <td className="py-4 text-gray-400 font-mono truncate max-w-[120px]" title={p.transactionId}>
                      {p.transactionId || 'N/A'}
                    </td>
                    <td className="py-4 text-gray-400 font-mono">
                      {new Date(p.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 relative">
                      <button
                        onClick={() => setStatusDropdownOpen(statusDropdownOpen === p._id ? null : p._id)}
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full capitalize cursor-pointer border border-transparent hover:border-gray-300',
                          p.status === 'paid' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                          p.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                          p.status === 'overdue' && 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        )}
                      >
                        {p.status}
                      </button>
                      {statusDropdownOpen === p._id && (
                        <div className="absolute left-0 mt-1 bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-xl shadow-xl py-1 z-20 min-w-[110px]">
                          {['paid', 'pending', 'overdue'].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(p._id, s as any)}
                              className="w-full text-left px-3 py-1.5 text-xs font-semibold capitalize hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/30 text-gray-700 dark:text-gray-300"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-right pr-4">
                      <button
                        onClick={() => handleDeleteRecord(p._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
                        title="Delete log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredPayments.map((p) => (
              <div key={p._id} className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{p.ownerName}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> {p.phone}</p>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-bold px-2 py-0.5 rounded uppercase border',
                      p.service === 'featured' && 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
                      p.service === 'verified' && 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400',
                      p.service === 'ad' && 'bg-[#0F2E1E]/10 text-[#0F2E1E] border-transparent dark:bg-white/10 dark:text-white'
                    )}
                  >
                    {p.service}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-50 dark:border-white/5 pt-2.5 text-xs text-gray-500">
                  <div>
                    <p className="text-[10px] text-gray-400">Amount (INR)</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100 mt-0.5 font-mono">₹{p.amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Payment Status</p>
                    <span
                      className={cn(
                        'text-[10px] font-bold rounded-full capitalize px-2 py-0.5 mt-0.5 inline-block',
                        p.status === 'paid' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                        p.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                        p.status === 'overdue' && 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      )}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Transaction ID</p>
                    <p className="font-mono text-gray-800 dark:text-gray-200 mt-0.5 truncate max-w-[120px]">{p.transactionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Payment Date</p>
                    <p className="font-mono text-gray-800 dark:text-gray-200 mt-0.5 flex items-center gap-1"><Calendar size={11} /> {new Date(p.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-50 dark:border-white/5 text-xs">
                  <div className="flex-1 flex gap-1">
                    {['paid', 'pending', 'overdue'].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(p._id, s as any)}
                        className={cn(
                          'flex-1 py-1 rounded text-[10px] capitalize font-semibold border',
                          p.status === s ? 'bg-gray-100 border-gray-300 text-gray-900 dark:bg-white/10 dark:border-white/15 dark:text-white' : 'border-transparent text-gray-400'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteRecord(p._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Payment Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setAddModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <h3 className="font-display text-lg text-[#0F2E1E] dark:text-white mb-1">Log Manual UPI Payment</h3>
              <p className="text-gray-500 text-xs mb-4">Create a tracking record for a manual payment received via GPay/PhonePe.</p>

              <form onSubmit={handleAddPayment} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Varun Sharma"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Premium Service</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value as any)}
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs focus:outline-none"
                    >
                      <option value="featured">Featured Listing (30d)</option>
                      <option value="verified">Verified Badge</option>
                      <option value="ad">Ad Banner Slot</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Amount Paid (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 399"
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs focus:outline-none"
                    >
                      <option value="PhonePe">PhonePe</option>
                      <option value="GPay">GPay</option>
                      <option value="Cash">Cash payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Transaction ID</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="T220509..."
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Payment Date</label>
                    <input
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Collection Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as any)}
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs focus:outline-none"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 border border-gray-300 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-3 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    {submitting && <Loader size="sm" className="border-white border-t-transparent" />}
                    Confirm Log
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
