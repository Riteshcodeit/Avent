// -------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, Download, RefreshCw, Eye, TrendingUp, AlertTriangle, Globe, Hash, Link, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useThreatIntelStore } from '../store/threatIntelStore';

function AnimatedCounter({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      key={value}
      className="font-bold text-3xl"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

function GlassmorphicCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl ${className}`}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

type IconType = 'ip' | 'domain' | 'url' | 'hash' | 'subnet';

function TypeIcon({ type }: { type: string }) {
  const icons: Record<IconType, React.ComponentType<{ className?: string }>> = {
    ip: Globe,
    domain: Globe,
    url: Link,
    hash: Hash,
    subnet: Globe
  };
  const Icon = (icons[type as IconType] ?? Globe);
  return <Icon className="w-4 h-4" />;
}

// Error Display Component
function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <GlassmorphicCard className="text-center border-red-500/50 bg-red-500/10">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <h3 className="text-lg font-semibold text-red-300">Error Loading Data</h3>
        <p className="text-red-200/80 text-sm max-w-md">{error}</p>
        <motion.button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/20 border border-red-400/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </div>
    </GlassmorphicCard>
  );
}

// Pagination Component
function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange 
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-white/20">
      <div className="flex items-center gap-2">
        <span className="text-white/70 text-sm">Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-white/70 text-sm">per page</span>
      </div>

      <div className="text-white/70 text-sm">
        Showing {startItem}-{endItem} of {totalItems.toLocaleString()} items
      </div>

      <div className="flex items-center gap-1">
        <motion.button
          className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </motion.button>

        <motion.button
          className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-white/50">...</span>
              ) : (
                <motion.button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.button
          className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
          whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        <motion.button
          className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
          whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // Zustand store
  const {
    iocs,
    counts,
    stats,
    total,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    fetchIOCs,
    fetchCounts,
    fetchStats,
    refreshFeeds,
    exportIOCs,
    clearError,
    resetFilters
  } = useThreatIntelStore();

  // Local state for search input
  const [searchQuery, setSearchQuery] = useState(filters.q || '');

  const COLORS = ['#00D9FF', '#FF6B9D', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchIOCs(),
        fetchCounts(),
        fetchStats()
      ]);
    };
    
    loadData();
  }, []);

  // Sync search input with filter
  useEffect(() => {
    setSearchQuery(filters.q || '');
  }, [filters.q]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilters({ q: searchQuery || null });
    }
  };

  const handleRefresh = async () => {
    clearError();
    await refreshFeeds();
  };

  const handleExport = async (format: 'csv' | 'json') => {
    await exportIOCs(format);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setFilters({ limit: newLimit, page: 1 });
  };

  const handleRetry = () => {
    clearError();
    fetchIOCs();
    fetchCounts();
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-4">
            <motion.div
              className="p-4 rounded-full bg-green-500 shadow-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h2
              className="text-5xl md:text-6xl font-extrabold leading-tight font-heading 
                 bg-gradient-to-r from-white via-gray-300 to-gray-500 
                 bg-clip-text text-transparent"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Threat Intel{" "}
              <span className="text-5xl md:text-6xl font-extrabold leading-tight font-heading text-green-500">
                Dashboard
              </span>
            </motion.h2>
          </div>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Real-time threat intelligence monitoring with advanced analytics and pagination
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ErrorDisplay error={error} onRetry={handleRetry} />
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassmorphicCard className="mb-8" hover={false}>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform-translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search IOCs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                />
              </div>

              <select
                value={filters.type || ''}
                onChange={(e) => setFilters({ type: e.target.value || null })}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <option className='bg-black' value="">All Types</option>
                <option className='bg-black' value="ip">IP Address</option>
                <option className='bg-black' value="domain">Domain</option>
                <option className='bg-black' value="url">URL</option>
                <option className='bg-black' value="hash">Hash</option>
                <option className='bg-black' value="subnet">Subnet</option>
              </select>

              <select
                value={filters.source || ''}
                onChange={(e) => setFilters({ source: e.target.value || null })}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <option className='bg-black' value="">All Sources</option>
                <option className='bg-black' value="spamhaus">Spamhaus</option>
                <option className='bg-black' value="blocklist.de">Blocklist.de</option>
                <option className='bg-black' value="digitalside">Digitalside</option>
                <option className='bg-black' value="malwaredomainlist">Malware Domain List</option>
                <option className='bg-black' value="phishtank">PhishTank</option>
                <option className='bg-black' value="urlvoid">URLVoid</option>
                <option className='bg-black' value="virustotal">VirusTotal</option>
                <option className='bg-black' value="abuse.ch">Abuse.ch</option>
              </select>

              <select
                value={filters.sort || 'latest'}
                onChange={(e) => setFilters({ sort: e.target.value })}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <option className='bg-black' value="latest">Latest First</option>
                <option className='bg-black' value="oldest">Oldest First</option>
                <option className='bg-black' value="alpha">A → Z</option>
                <option className='bg-black' value="alpha-desc">Z → A</option>
                <option className='bg-black' value="confidence">High Confidence</option>
                <option className='bg-black' value="confidence-asc">Low Confidence</option>
              </select>

              <motion.button
                onClick={handleRefresh}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </motion.button>

              <motion.button
                onClick={() => handleExport('csv')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </motion.button>

              <motion.button
                onClick={() => handleExport('json')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </motion.button>

              <motion.button
                onClick={resetFilters}
                className="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GlassmorphicCard className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-cyan-500/20">
                  <Eye className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Total IOCs</h3>
              <AnimatedCounter value={counts?.total || 0} />
              <p className="text-sm text-white/60 mt-2">Active indicators</p>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-emerald-500/20">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Filtered Results</h3>
              <AnimatedCounter value={total} />
              <p className="text-sm text-white/60 mt-2">Matching criteria</p>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-pink-500/20">
                  <AlertTriangle className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Last Hour</h3>
              <AnimatedCounter value={stats?.recentActivity?.lastHour || 0} />
              <p className="text-sm text-white/60 mt-2">Recent activity</p>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-orange-500/20">
                  <Shield className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Current Page</h3>
              <div className="font-bold text-3xl text-white">
                {filters.page} / {totalPages}
              </div>
              <p className="text-sm text-white/60 mt-2">Page navigation</p>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Charts */}
        {counts && stats && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <GlassmorphicCard>
              <h3 className="text-xl font-semibold text-white mb-4">Threats by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(counts.byType).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                  >
                    {Object.keys(counts.byType).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </GlassmorphicCard>

            <GlassmorphicCard>
              <h3 className="text-xl font-semibold text-white mb-4">Threat Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.chartData || []}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00D9FF"
                    fillOpacity={1}
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassmorphicCard>
          </motion.div>
        )}

        {/* IOC Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassmorphicCard hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Indicators of Compromise</h3>
              <div className="text-sm text-white/60">
                Showing {Math.min(filters.limit, iocs.length)} of {total} results
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-2 text-white/80 font-medium">Indicator</th>
                    <th className="text-left py-4 px-2 text-white/80 font-medium">Type</th>
                    <th className="text-left py-4 px-2 text-white/80 font-medium">Source</th>
                    <th className="text-left py-4 px-2 text-white/80 font-medium">Timestamp</th>
                    <th className="text-left py-4 px-2 text-white/80 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/10"
                      >
                        <td colSpan={5} className="py-8 px-2 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                            <span className="text-white/60">Loading IOCs...</span>
                          </div>
                        </td>
                      </motion.tr>
                    ) : iocs.length > 0 ? (
                      iocs.map((ioc, index) => (
                        <motion.tr
                          key={`${filters.page}-${ioc.id}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-3">
                              <div className="p-1 rounded bg-white/10">
                                <TypeIcon type={ioc.type} />
                              </div>
                              <span className="text-white font-mono text-sm break-all">{ioc.value}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium uppercase">
                              {ioc.type}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-white/70">{ioc.source}</span>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-white/60 text-sm">{ioc.timestamp}</span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-white/20 rounded-full h-2">
                                <div
                                  className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                                  style={{ width: `${ioc.confidence}%` }}
                                />
                              </div>
                              <span className="text-white/70 text-sm">{ioc.confidence}%</span>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/10"
                      >
                        <td colSpan={5} className="py-8 px-2 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <Search className="w-12 h-12 text-white/30" />
                            <span className="text-white/60">No IOCs match your current filters</span>
                            <button
                              onClick={resetFilters}
                              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm"
                            >
                              Clear Filters
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            {total > 0 && (
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={filters.limit}
                onPageChange={(page) => setFilters({ page })}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </GlassmorphicCard>
        </motion.div>

        {/* Quick Stats Footer */}
        {counts && stats && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <GlassmorphicCard className="text-center p-4">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {Object.keys(counts.byType).length}
              </div>
              <div className="text-sm text-white/70">IOC Types</div>
            </GlassmorphicCard>

            <GlassmorphicCard className="text-center p-4">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {Object.keys(counts.bySource).length}
              </div>
              <div className="text-sm text-white/70">Threat Sources</div>
            </GlassmorphicCard>

            <GlassmorphicCard className="text-center p-4">
              <div className="text-2xl font-bold text-pink-400 mb-1">
                {stats.recentActivity?.lastDay || 0}
              </div>
              <div className="text-sm text-white/70">Last 24h</div>
            </GlassmorphicCard>

            <GlassmorphicCard className="text-center p-4">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {Math.round((iocs.reduce((sum, ioc) => sum + (ioc.confidence || 0), 0) / iocs.length) || 0)}%
              </div>
              <div className="text-sm text-white/70">Avg Confidence</div>
            </GlassmorphicCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}