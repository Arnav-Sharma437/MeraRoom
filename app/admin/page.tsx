'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Home as HomeIcon,
  Clock,
  Users,
  IndianRupee,
  Star,
  Shield,
  MessageCircle,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { cn, formatRent, getWhatsAppLink } from '@/lib/utils';
import Loader from '@/components/ui/Loader';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface Stat {
  totalRooms: number;
  pendingRooms: number;
  totalUsers: number;
  totalRevenue: number;
  featuredRooms: number;
  verifiedRooms: number;
  inquiriesToday: number;
}

interface AreaChartItem {
  name: string;
  rooms: number;
}

interface InqChartItem {
  day: string;
  date: string;
  inquiries: number;
}

interface RoomRecord {
  _id: string;
  title: string;
  area: string;
  rent: number;
  deposit: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  owner: {
    _id: string;
    name: string;
    phone: string;
  };
}

export default function AdminOverview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat | null>(null);
  const [areaChart, setAreaChart] = useState<AreaChartItem[]>([]);
  const [inqChart, setInqChart] = useState<InqChartItem[]>([]);
  const [recentListings, setRecentListings] = useState<RoomRecord[]>([]);
  const [dateTime, setDateTime] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data.stats);
        setAreaChart(json.data.charts.roomsByArea);
        setInqChart(json.data.charts.inquiriesByDay);
        setRecentListings(json.data.recentListings);
      } else {
        toast.error('Failed to load dashboard statistics');
      }
    } catch {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Clock display
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setDateTime(new Date().toLocaleDateString('en-IN', options));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/rooms/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Listing approved and live!');
        setRecentListings((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'approved' } : r))
        );
        fetchStats(); // Update stats summary counts
      } else {
        toast.error(json.error ?? 'Approval failed');
      }
    } catch {
      toast.error('Approval failed');
    }
  };

  const handleRejectClick = (id: string) => {
    setActionId(id);
    setRejectionReason('');
    setRejectionModalOpen(true);
  };

  const submitRejection = async () => {
    if (!actionId) return;
    try {
      const res = await fetch(`/api/rooms/${actionId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', reason: rejectionReason }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Listing rejected.');
        setRecentListings((prev) =>
          prev.map((r) => (r._id === actionId ? { ...r, status: 'rejected' } : r))
        );
        setRejectionModalOpen(false);
        setActionId(null);
        fetchStats(); // Update stats summary counts
      } else {
        toast.error(json.error ?? 'Rejection failed');
      }
    } catch {
      toast.error('Rejection failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader size="lg" className="border-brand-green border-t-transparent" />
        <p className="mt-4 text-gray-500 font-medium text-sm">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  // Custom tooltips matching dark-green / gold theme
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F2E1E] text-white border border-[#D4AF37]/35 rounded-xl p-3 shadow-xl text-xs font-sans">
          <p className="font-semibold mb-1 text-[#D4AF37]">{label}</p>
          <p className="opacity-90">{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible" className="space-y-8">
      {/* Page Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-[#1F2E1F] pb-6">
        <div>
          <h1 className="font-display text-3xl text-[#0F2E1E] dark:text-white">Good morning, Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Here is a overview of MeraRoom property listings and inquiries.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-full px-4 py-2 shadow-sm shrink-0 self-start sm:self-center">
          {dateTime}
        </div>
      </motion.div>

      {/* Row 1 Stats Cards: 2x2 mobile, 4 columns desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Rooms */}
        <motion.div variants={fadeInUp} className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-10 h-10 bg-[#0F2E1E]/10 rounded-xl flex items-center justify-center text-[#0F2E1E] dark:text-white shrink-0">
            <HomeIcon size={20} />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Rooms</p>
          <h2 className="font-display text-4xl text-[#0F2E1E] dark:text-white mt-3 font-bold">{stats?.totalRooms}</h2>
          <p className="text-green-500 text-xs font-semibold mt-2 flex items-center gap-1">
            <span>+5 this week</span>
          </p>
        </motion.div>

        {/* Card 2: Pending Approval */}
        <motion.div
          variants={fadeInUp}
          onClick={() => router.push('/admin/approvals')}
          className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-4 right-4 w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
            <Clock size={20} />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Pending Approval</p>
          <h2 className="font-display text-4xl text-amber-500 mt-3 font-bold">{stats?.pendingRooms}</h2>
          <p className="text-amber-500 text-xs font-semibold mt-2">Needs attention</p>
        </motion.div>

        {/* Card 3: Total Users */}
        <motion.div variants={fadeInUp} className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-[#16A34A] shrink-0">
            <Users size={20} />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Users</p>
          <h2 className="font-display text-4xl text-[#16A34A] mt-3 font-bold">{stats?.totalUsers}</h2>
          <p className="text-gray-500 text-xs mt-2">Room seekers</p>
        </motion.div>

        {/* Card 4: Revenue */}
        <motion.div
          variants={fadeInUp}
          onClick={() => router.push('/admin/payments')}
          className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-4 right-4 w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] shrink-0">
            <IndianRupee size={20} />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Manual Revenue</p>
          <h2 className="font-display text-4xl text-[#D4AF37] mt-3 font-bold">₹{stats?.totalRevenue?.toLocaleString('en-IN')}</h2>
          <p className="text-gray-400 text-xs mt-2">This month</p>
        </motion.div>
      </div>

      {/* Row 2 Stats Secondary: 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Featured Stays */}
        <motion.div
          variants={fadeInUp}
          onClick={() => router.push('/admin/featured')}
          className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm hover:shadow-md flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Featured Stays</p>
            <h3 className="font-semibold text-2xl text-[#0F2E1E] dark:text-white mt-1">{stats?.featuredRooms}</h3>
          </div>
        </motion.div>

        {/* Verified Badges */}
        <motion.div
          variants={fadeInUp}
          onClick={() => router.push('/admin/verified')}
          className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm hover:shadow-md flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Shield size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Verified Badges</p>
            <h3 className="font-semibold text-2xl text-[#0F2E1E] dark:text-white mt-1">{stats?.verifiedRooms}</h3>
          </div>
        </motion.div>

        {/* New Inquiries Today */}
        <motion.div
          variants={fadeInUp}
          onClick={() => router.push('/admin/inquiries')}
          className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm hover:shadow-md flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-[#16A34A] shrink-0">
            <MessageCircle size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Inquiries Today</p>
            <h3 className="font-semibold text-2xl text-[#0F2E1E] dark:text-white mt-1">{stats?.inquiriesToday}</h3>
          </div>
        </motion.div>
      </div>

      {/* Row 3 Charts Row: side-by-side on desktop, 100% on tablet/mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Rooms by Area BarChart */}
        <motion.div variants={fadeInUp} className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <h3 className="font-semibold text-base text-[#0F2E1E] dark:text-white mb-4">Rooms by Area</h3>
          <div className="w-full h-48 sm:h-64">
            {areaChart.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No area stats data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaChart} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(22, 163, 74, 0.05)' }} />
                  <Bar dataKey="rooms" name="Rooms Count" fill="#16A34A" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Chart 2: Weekly Inquiries LineChart */}
        <motion.div variants={fadeInUp} className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <h3 className="font-semibold text-base text-[#0F2E1E] dark:text-white mb-4">Weekly Inquiries Trend</h3>
          <div className="w-full h-48 sm:h-64">
            {inqChart.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No inquiry stats data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inqChart} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Line type="monotone" dataKey="inquiries" name="Inquiries Count" stroke="#D4AF37" strokeWidth={3} dot={{ stroke: '#D4AF37', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Row 4: Recent Listings */}
      <motion.section variants={fadeInUp} className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-base text-[#0F2E1E] dark:text-white">Recent Room Postings</h3>
          <Link href="/admin/rooms" className="text-[#16A34A] text-sm font-semibold hover:text-[#D4AF37] transition-colors">
            View All Rooms →
          </Link>
        </div>

        {recentListings.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">No properties listed yet.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#1F2E1F] text-gray-400 text-xs font-semibold uppercase">
                    <th className="pb-3">Room Title</th>
                    <th className="pb-3">Area</th>
                    <th className="pb-3">Owner</th>
                    <th className="pb-3">Rent</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#1F2E1F]">
                  {recentListings.map((room) => (
                    <tr key={room._id} className="hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/10 transition-colors">
                      <td className="py-4 font-semibold text-[#0F2E1E] dark:text-white max-w-[200px] truncate">{room.title}</td>
                      <td className="py-4 text-gray-500 dark:text-gray-400">{room.area}</td>
                      <td className="py-4">
                        <div className="text-xs">
                          <p className="font-medium text-gray-700 dark:text-gray-300">{room.owner?.name}</p>
                          <p className="text-gray-400 mt-0.5">{room.owner?.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-gray-800 dark:text-gray-200">{formatRent(room.rent)}</td>
                      <td className="py-4">
                        <span
                          className={cn(
                            'text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block',
                            room.status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                            room.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                            room.status === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          )}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400 text-xs">
                        {new Date(room.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-4 text-right space-x-1 whitespace-nowrap">
                        <Link href={`/rooms/${room._id}`} target="_blank" className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-[#16A34A] hover:bg-gray-100 dark:hover:bg-[#0F2E1E]/50 rounded-lg min-h-[36px] min-w-[36px]">
                          <ExternalLink size={16} />
                        </Link>
                        {room.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(room._id)} className="inline-flex items-center justify-center p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg min-h-[36px] min-w-[36px]" title="Approve">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => handleRejectClick(room._id)} className="inline-flex items-center justify-center p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg min-h-[36px] min-w-[36px]" title="Reject">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {recentListings.map((room) => (
                <div key={room._id} className="border border-gray-100 dark:border-[#1F2E1F] rounded-2xl p-4 bg-gray-50/50 dark:bg-[#0F2E1E]/5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white line-clamp-1">{room.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{room.area} · {formatRent(room.rent)}</p>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full capitalize',
                        room.status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                        room.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                        room.status === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      )}
                    >
                      {room.status}
                    </span>
                  </div>

                  <div className="text-[11px] border-t border-gray-100 dark:border-[#1F2E1F] pt-2 flex items-center justify-between text-gray-500">
                    <p>Owner: {room.owner?.name}</p>
                    <p>
                      {new Date(room.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-[#1F2E1F]">
                    <Link href={`/rooms/${room._id}`} target="_blank" className="flex-1 flex items-center justify-center gap-1 bg-white border dark:bg-[#111A11] dark:border-white/10 text-xs py-2 rounded-xl min-h-[36px]">
                      <ExternalLink size={12} /> View
                    </Link>
                    {room.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(room._id)} className="flex-1 bg-green-600 text-white text-xs font-semibold py-2 rounded-xl min-h-[36px]">
                          Approve
                        </button>
                        <button onClick={() => handleRejectClick(room._id)} className="flex-1 bg-red-50 text-red-500 border border-red-200 text-xs font-semibold py-2 rounded-xl min-h-[36px]">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.section>

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {rejectionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-2">Rejection Reason</h3>
              <p className="text-gray-500 text-sm mb-4">Provide a reason for rejection (optional) which will be displayed to the listing owner.</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please upload higher quality photos of the kitchen..."
                rows={4}
                className="w-full rounded-2xl px-4 py-3 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm focus:border-red-500 focus:outline-none resize-none mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRejectionReason('');
                    submitRejection(); // Submit with empty reason
                  }}
                  className="flex-1 border border-gray-200 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-3 text-sm font-semibold"
                >
                  Skip Reason
                </button>
                <button
                  onClick={submitRejection}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 text-sm font-semibold"
                >
                  Send Rejection
                </button>
              </div>
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="w-full text-center mt-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-semibold py-2"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
