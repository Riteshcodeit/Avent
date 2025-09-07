import React, { useEffect, useState } from "react";
import { useThreatIntelStore } from "../store/threatIntelStore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { StatsSection } from "./StatsSection";

export default function Dashboard() {
  const {
    iocs,
    counts,
    stats,
    loading,
    fetchIOCs,
    fetchCounts,
    fetchStats,
    refreshFeeds,
    exportIOCs,
    setFilters,
    filters,
    totalPages,
    hasNext,
    hasPrev,
  } = useThreatIntelStore();

  const [query, setQuery] = useState(filters.q || "");

  useEffect(() => {
    fetchIOCs();
    fetchCounts();
    fetchStats();
  }, [filters]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-3xl font-extrabold text-center mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        ⚡ Threat Intel Dashboard
      </motion.h1>

      {/* Controls */}
      <motion.div
        className="flex gap-4 items-center flex-wrap justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="🔍 Search IOCs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setFilters({ q: query });
          }}
          className="border px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 transition"
        />

        <select
          value={filters.type || ""}
          onChange={(e) => setFilters({ type: e.target.value || null })}
          className="border px-3 py-2 rounded shadow-sm"
        >
          <option value="">All Types</option>
          <option value="ip">IP</option>
          <option value="subnet">Subnet</option>
          <option value="url">URL</option>
          <option value="domain">Domain</option>
          <option value="hash">Hash</option>
        </select>

        <select
          value={filters.source || ""}
          onChange={(e) => setFilters({ source: e.target.value || null })}
          className="border px-3 py-2 rounded shadow-sm"
        >
          <option value="">All Sources</option>
          <option value="spamhaus">Spamhaus</option>
          <option value="blocklist.de">Blocklist.de</option>
          <option value="digitalside">Digitalside</option>
        </select>

        <select
          value={filters.sort || "latest"}
          onChange={(e) => setFilters({ sort: e.target.value })}
          className="border px-3 py-2 rounded shadow-sm"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="alpha">A → Z</option>
          <option value="alpha-desc">Z → A</option>
        </select>

        {/* Buttons with motion */}
        <motion.button
          onClick={() => refreshFeeds()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Refresh Feeds
        </motion.button>

        <motion.button
          onClick={() => exportIOCs("csv")}
          className="px-4 py-2 bg-green-600 text-white rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬇ Export CSV
        </motion.button>

        <motion.button
          onClick={() => exportIOCs("json")}
          className="px-4 py-2 bg-purple-600 text-white rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬇ Export JSON
        </motion.button>
      </motion.div>

      {loading && <p className="text-center animate-pulse">Loading data...</p>}

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {counts && counts.byType && (
          <motion.div
            className="bg-gray-900 text-white p-4 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="font-semibold mb-2">By Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(counts.byType).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {Object.keys(counts.byType).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {counts && counts.bySource && (
          <motion.div
            className="bg-gray-900 text-white p-4 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="font-semibold mb-2">By Source</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(counts.bySource).map(
                    ([name, value]) => ({
                      name,
                      value,
                    })
                  )}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {Object.keys(counts.bySource).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </motion.div>

      {/* IOC Table */}
      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 border">Value</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Source</th>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Confidence</th>
            </tr>
          </thead>
          <motion.tbody layout>
            {iocs.map((ioc, index) => (
              <motion.tr
                key={ioc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-700 text-white"
              >
                <td className="p-2 border">{ioc.value}</td>
                <td className="p-2 border">{ioc.type}</td>
                <td className="p-2 border">{ioc.source}</td>
                <td className="p-2 border">{ioc.timestamp}</td>
                <td className="p-2 border">{ioc.confidence ?? "-"}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>

      {stats && counts && <StatsSection stats={stats} counts={counts} />}

      {/* Pagination */}
      <motion.div
        className="flex justify-between items-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          disabled={!hasPrev}
          onClick={() => setFilters({ page: filters.page - 1 })}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          whileHover={{ scale: hasPrev ? 1.05 : 1 }}
          whileTap={{ scale: hasPrev ? 0.95 : 1 }}
        >
          ⬅ Prev
        </motion.button>
        <span className="text-white">
          Page {filters.page} of {totalPages}
        </span>
        <motion.button
          disabled={!hasNext}
          onClick={() => setFilters({ page: filters.page + 1 })}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          whileHover={{ scale: hasNext ? 1.05 : 1 }}
          whileTap={{ scale: hasNext ? 0.95 : 1 }}
        >
          Next ➡
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
