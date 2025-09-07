import { motion, AnimatePresence } from "framer-motion";

function AnimatedCounter({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      key={value} // re-animate on change
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

export function StatsSection({ stats, counts }: { stats: any; counts: any }) {
  if (!stats || !counts) return null;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg text-center"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-lg font-semibold">Total IOCs</h3>
        <p className="text-3xl font-bold">
          <AnimatedCounter value={counts.total || 0} />
        </p>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl shadow-lg text-center"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-lg font-semibold">New (Last 24h)</h3>
        <p className="text-3xl font-bold">
          <AnimatedCounter value={stats.recentActivity?.lastDay || 0} />
        </p>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg text-center"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-lg font-semibold">New (Last 1h)</h3>
        <p className="text-3xl font-bold">
          <AnimatedCounter value={stats.recentActivity?.lastHour || 0} />
        </p>
      </motion.div>
    </motion.div>
  );
}
