
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// === Types ===
interface IOC {
  id: string;
  value: string;
  type: string;
  source: string;
  timestamp: string;
  confidence?: number;
}

interface CountData {
  total: number;
  byType: Record<string, number>;
  bySource: Record<string, number>;
  lastUpdated: string;
}

interface StatsData {
  recentActivity: {
    lastHour: number;
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
  };
  threatCategories: Record<string, number>;
  riskLevels: Record<string, number>;
  topCountries: Record<string, number>;
  chartData?: any[];
  threatTypeChartData?: any[];
  sourceChartData?: any[];
  geographicData?: any[];
  lastUpdated: string;
}

interface Filters {
  type?: string | null;
  source?: string | null;
  q?: string | null;
  sort?: string;
  page: number;
  limit: number;
}

interface ThreatIntelState {
  // Data
  iocs: IOC[];
  counts: CountData | null;
  stats: StatsData | null;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  
  // UI State
  loading: boolean;
  error: string | null;
  filters: Filters;

  // Actions
  setFilters: (updates: Partial<Filters>) => void;
  fetchIOCs: () => Promise<void>;
  fetchCounts: () => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshFeeds: () => Promise<void>;
  exportIOCs: (format: "csv" | "json") => Promise<void>;
  clearError: () => void;
  resetFilters: () => void;
}

// API Configuration
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://avent.onrender.com";
// Default filters
const defaultFilters: Filters = {
  type: null,
  source: null,
  q: null,
  sort: "latest",
  page: 1,
  limit: 20,
};

// === Store ===
export const useThreatIntelStore = create<ThreatIntelState>()(
  persist(
    (set, get) => ({
      // Initial state
      iocs: [],
      counts: null,
      stats: null,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
      loading: false,
      error: null,
      filters: defaultFilters,

      // Clear error
      clearError: () => set({ error: null }),

      // Reset filters to default
      resetFilters: () => {
        set({ filters: defaultFilters });
        get().fetchIOCs();
      },

      // Update filters and reset page if not page change
      setFilters: (updates) => {
        const current = get().filters;
        const newFilters = { 
          ...current, 
          ...updates, 
          page: updates.page !== undefined ? updates.page : 1 
        };
        
        set({ filters: newFilters, error: null });
        get().fetchIOCs();
      },

      // === API Calls ===
      fetchIOCs: async () => {
        const { filters } = get();
        set({ loading: true, error: null });

        try {
          const params = new URLSearchParams();
          
          if (filters.type) params.append('type', filters.type);
          if (filters.source) params.append('source', filters.source);
          if (filters.q) params.append('q', filters.q);
          if (filters.sort) params.append('sort', filters.sort);
          params.append('page', filters.page.toString());
          params.append('limit', filters.limit.toString());

          const response = await axios.get(`${API_BASE_URL}/iocs?${params}`);

          if (response.data.success) {
            const data = response.data.data;
            set({
              iocs: data.results || [],
              total: data.total || 0,
              totalPages: data.totalPages || 1,
              hasNext: data.hasNext || false,
              hasPrev: data.hasPrev || false,
              loading: false,
            });
          } else {
            throw new Error(response.data.error || 'Failed to fetch IOCs');
          }
        } catch (err: any) {
          console.error("❌ Error fetching IOCs:", err);
          set({ 
            loading: false, 
            error: err.response?.data?.message || err.message || 'Failed to fetch IOCs',
            iocs: [],
            total: 0
          });
        }
      },

      fetchCounts: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/iocs/counts`);
          
          if (response.data.success) {
            set({ counts: response.data.data });
          } else {
            throw new Error(response.data.error || 'Failed to fetch counts');
          }
        } catch (err: any) {
          console.error("❌ Error fetching counts:", err);
          set({ error: err.response?.data?.message || err.message || 'Failed to fetch counts' });
        }
      },

      fetchStats: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/iocs/stats`);
          
          if (response.data.success) {
            set({ stats: response.data.data });
          } else {
            throw new Error(response.data.error || 'Failed to fetch stats');
          }
        } catch (err: any) {
          console.error("❌ Error fetching stats:", err);
          set({ error: err.response?.data?.message || err.message || 'Failed to fetch stats' });
        }
      },

      refreshFeeds: async () => {
        set({ loading: true, error: null });
        
        try {
          const response = await axios.post(`${API_BASE_URL}/iocs/refresh`);
          
          if (response.data.success) {
            // Refresh all data after successful feed refresh
            await Promise.all([
              get().fetchIOCs(),
              get().fetchCounts(),
              get().fetchStats()
            ]);
          } else {
            throw new Error(response.data.error || 'Failed to refresh feeds');
          }
        } catch (err: any) {
          console.error("❌ Error refreshing feeds:", err);
          set({ 
            loading: false, 
            error: err.response?.data?.message || err.message || 'Failed to refresh feeds' 
          });
        }
      },

      // === Export IOCs ===
      exportIOCs: async (format: "csv" | "json") => {
        try {
          const { filters } = get();
          const params = new URLSearchParams();
          
          params.append('format', format);
          if (filters.type) params.append('type', filters.type);
          if (filters.source) params.append('source', filters.source);
          if (filters.q) params.append('q', filters.q);

          const response = await axios.get(`${API_BASE_URL}/iocs/export?${params}`, {
            responseType: 'blob',
          });

          // Create download link
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `threat-intel-${Date.now()}.${format}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
        } catch (err: any) {
          console.error("❌ Error exporting IOCs:", err);
          set({ error: err.response?.data?.message || err.message || 'Failed to export IOCs' });
        }
      },
    }),
    {
      name: "threat-intel-storage",
      // Only persist filters and settings, not the actual data
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

// Custom hooks for easier usage
export const useIOCs = () => {
  const store = useThreatIntelStore();
  return {
    iocs: store.iocs,
    loading: store.loading,
    error: store.error,
    total: store.total,
    totalPages: store.totalPages,
    hasNext: store.hasNext,
    hasPrev: store.hasPrev,
    fetchIOCs: store.fetchIOCs,
  };
};

export const useCounts = () => {
  const store = useThreatIntelStore();
  return {
    counts: store.counts,
    fetchCounts: store.fetchCounts,
  };
};

export const useStats = () => {
  const store = useThreatIntelStore();
  return {
    stats: store.stats,
    fetchStats: store.fetchStats,
  };
};

export const useFilters = () => {
  const store = useThreatIntelStore();
  return {
    filters: store.filters,
    setFilters: store.setFilters,
    resetFilters: store.resetFilters,
  };
};