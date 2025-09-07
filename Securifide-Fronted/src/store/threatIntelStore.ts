// // store/threatIntelStore.ts
// import React from 'react'
// import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

// export interface IOC {
//   id: string
//   value: string
//   type: 'ip' | 'subnet' | 'url' | 'domain' | 'hash'
//   source: 'blocklist.de' | 'spamhaus' | 'digitalside'
//   timestamp: string
//   confidence?: number
// }

// export interface IOCStats {
//   total: number
//   byType: Record<string, number>
//   bySource: Record<string, number>
//   lastUpdated?: string
// }

// export interface DetailedStats {
//   total: number
//   lastFetchTime: string | null
//   fetchStats: {
//     totalFetches: number
//     successfulFetches: number
//     failedFetches: number
//     lastError: string | null
//   }
//   breakdown: {
//     byType: Record<string, number>
//     bySource: Record<string, number>
//     byHour: Record<string, number>
//   }
//   recentActivity: {
//     lastHour: number
//     lastDay: number
//   }
//   oldestEntry: string | null
//   newestEntry: string | null
// }

// export interface FilterState {
//   type: string
//   source: string
//   search: string
//   sort: 'latest' | 'oldest' | 'alpha' | 'alpha-desc'
//   page: number
//   limit: number
// }

// export interface ThreatIntelState {
//   // Data
//   iocs: IOC[]
//   stats: IOCStats | null
//   detailedStats: DetailedStats | null
  
//   // UI State
//   isLoading: boolean
//   isRefreshing: boolean
//   error: string | null
  
//   // Filters & Pagination
//   filters: FilterState
//   totalPages: number
//   hasNext: boolean
//   hasPrev: boolean
  
//   // Settings
//   autoRefreshEnabled: boolean
//   autoRefreshInterval: number // in minutes
//   darkMode: boolean
  
//   // Actions
//   fetchIOCs: () => Promise<void>
//   refreshFeeds: () => Promise<void>
//   fetchStats: () => Promise<void>
//   fetchDetailedStats: () => Promise<void>
  
//   // Filter actions
//   setFilter: (key: keyof FilterState, value: any) => void
//   clearFilters: () => void
//   setPage: (page: number) => void
  
//   // Settings actions
//   toggleAutoRefresh: () => void
//   setAutoRefreshInterval: (minutes: number) => void
//   toggleDarkMode: () => void
  
//   // Utility actions
//   clearError: () => void
//   exportData: (format: 'json' | 'csv') => Promise<void>
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// const initialFilters: FilterState = {
//   type: '',
//   source: '',
//   search: '',
//   sort: 'latest',
//   page: 1,
//   limit: 50
// }

// export const useThreatIntelStore = create<ThreatIntelState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         // Initial state
//         iocs: [],
//         stats: null,
//         detailedStats: null,
//         isLoading: false,
//         isRefreshing: false,
//         error: null,
//         filters: initialFilters,
//         totalPages: 0,
//         hasNext: false,
//         hasPrev: false,
//         autoRefreshEnabled: false,
//         autoRefreshInterval: 5,
//         darkMode: true,

//         // Fetch IOCs with current filters
//         fetchIOCs: async () => {
//           const state = get()
//           set({ isLoading: true, error: null })

//           try {
//             const params = new URLSearchParams()
            
//             if (state.filters.type) params.append('type', state.filters.type)
//             if (state.filters.source) params.append('source', state.filters.source)
//             if (state.filters.search) params.append('q', state.filters.search)
//             if (state.filters.sort) params.append('sort', state.filters.sort)
//             params.append('page', state.filters.page.toString())
//             params.append('limit', state.filters.limit.toString())

//             const response = await fetch(`${API_BASE_URL}/iocs?${params}`)
            
//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`)
//             }

//             const data = await response.json()

//             if (data.success) {
//               set({
//                 iocs: data.data.results,
//                 totalPages: data.data.totalPages,
//                 hasNext: data.data.hasNext,
//                 hasPrev: data.data.hasPrev,
//                 isLoading: false
//               })
//             } else {
//               throw new Error(data.error || 'Failed to fetch IOCs')
//             }
//           } catch (error) {
//             console.error('Error fetching IOCs:', error)
//             set({
//               error: error instanceof Error ? error.message : 'Unknown error occurred',
//               isLoading: false
//             })
//           }
//         },

//         // Refresh feeds from sources
//         refreshFeeds: async () => {
//           set({ isRefreshing: true, error: null })

//           try {
//             const response = await fetch(`${API_BASE_URL}/iocs/refresh`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json'
//               }
//             })

//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`)
//             }

//             const data = await response.json()

//             if (data.success) {
//               set({ isRefreshing: false })
//               // Refetch IOCs and stats after successful refresh
//               await get().fetchIOCs()
//               await get().fetchStats()
//             } else {
//               throw new Error(data.error || 'Failed to refresh feeds')
//             }
//           } catch (error) {
//             console.error('Error refreshing feeds:', error)
//             set({
//               error: error instanceof Error ? error.message : 'Unknown error occurred',
//               isRefreshing: false
//             })
//           }
//         },

//         // Fetch basic statistics
//         fetchStats: async () => {
//           try {
//             const response = await fetch(`${API_BASE_URL}/iocs/counts`)
            
//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`)
//             }

//             const data = await response.json()

//             if (data.success) {
//               set({ stats: data.data })
//             }
//           } catch (error) {
//             console.error('Error fetching stats:', error)
//           }
//         },

//         // Fetch detailed statistics
//         fetchDetailedStats: async () => {
//           try {
//             const response = await fetch(`${API_BASE_URL}/iocs/stats`)
            
//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`)
//             }

//             const data = await response.json()

//             if (data.success) {
//               set({ detailedStats: data.data })
//             }
//           } catch (error) {
//             console.error('Error fetching detailed stats:', error)
//           }
//         },

//         // Filter management
//         setFilter: (key, value) => {
//           set((state) => ({
//             filters: {
//               ...state.filters,
//               [key]: value,
//               // Reset page when changing filters (except page itself)
//               page: key === 'page' ? value : 1
//             }
//           }))
          
//           // Auto-fetch with new filters
//           setTimeout(() => get().fetchIOCs(), 0)
//         },

//         clearFilters: () => {
//           set({ filters: initialFilters })
//           setTimeout(() => get().fetchIOCs(), 0)
//         },

//         setPage: (page) => {
//           set((state) => ({
//             filters: { ...state.filters, page }
//           }))
//           setTimeout(() => get().fetchIOCs(), 0)
//         },

//         // Settings management
//         toggleAutoRefresh: () => {
//           set((state) => ({ autoRefreshEnabled: !state.autoRefreshEnabled }))
//         },

//         setAutoRefreshInterval: (minutes) => {
//           set({ autoRefreshInterval: minutes })
//         },

//         toggleDarkMode: () => {
//           set((state) => ({ darkMode: !state.darkMode }))
//         },

//         // Utility actions
//         clearError: () => {
//           set({ error: null })
//         },

//         // Export data
//         exportData: async (format) => {
//           try {
//             const state = get()
//             const params = new URLSearchParams()
            
//             params.append('format', format)
//             if (state.filters.type) params.append('type', state.filters.type)
//             if (state.filters.source) params.append('source', state.filters.source)

//             const response = await fetch(`${API_BASE_URL}/iocs/export?${params}`)
            
//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`)
//             }

//             // Handle file download
//             const blob = await response.blob()
//             const url = window.URL.createObjectURL(blob)
//             const a = document.createElement('a')
//             a.href = url
//             a.download = `threat-intel-${Date.now()}.${format}`
//             document.body.appendChild(a)
//             a.click()
//             window.URL.revokeObjectURL(url)
//             document.body.removeChild(a)
//           } catch (error) {
//             console.error('Error exporting data:', error)
//             set({
//               error: error instanceof Error ? error.message : 'Export failed'
//             })
//           }
//         }
//       }),
//       {
//         name: 'threat-intel-storage',
//         partialize: (state) => ({
//           filters: state.filters,
//           autoRefreshEnabled: state.autoRefreshEnabled,
//           autoRefreshInterval: state.autoRefreshInterval,
//           darkMode: state.darkMode
//         })
//       }
//     ),
//     { name: 'threat-intel-store' }
//   )
// )

// // Auto-refresh hook
// export const useAutoRefresh = () => {
//   const { autoRefreshEnabled, autoRefreshInterval, refreshFeeds } = useThreatIntelStore()

//   React.useEffect(() => {
//     if (!autoRefreshEnabled) return

//     const interval = setInterval(() => {
//       refreshFeeds()
//     }, autoRefreshInterval * 60 * 1000) // Convert minutes to milliseconds

//     return () => clearInterval(interval)
//   }, [autoRefreshEnabled, autoRefreshInterval, refreshFeeds])
// }


// ------------------------------------------------------------------


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

interface Filters {
  type?: string | null;
  source?: string | null;
  q?: string | null;
  sort?: string;
  page: number;
  limit: number;
}

interface ThreatIntelState {
  iocs: IOC[];
  counts: any;
  stats: any;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  loading: boolean;
  filters: Filters;

  // Actions
  setFilters: (updates: Partial<Filters>) => void;
  fetchIOCs: () => Promise<void>;
  fetchCounts: () => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshFeeds: () => Promise<void>;
  exportIOCs: (format: "csv" | "json") => Promise<void>;
}

// === Store ===
export const useThreatIntelStore = create<ThreatIntelState>()(
  persist(
    (set, get) => ({
      iocs: [],
      counts: null,
      stats: null,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
      loading: false,
      filters: {
        type: null,
        source: null,
        q: null,
        sort: "latest",
        page: 1,
        limit: 20,
      },

      // Update filters
      setFilters: (updates) => {
        const current = get().filters;
        set({
          filters: { ...current, ...updates, page: updates.page ?? 1 },
        });
        get().fetchIOCs();
      },

      // === API Calls ===
      fetchIOCs: async () => {
        const { filters } = get();
        set({ loading: true });

        try {
          const res = await axios.get("http://localhost:3000/api/iocs", {
            params: filters,
          });

          const data = res.data.data;
          set({
            iocs: data.results || [],
            total: data.total,
            totalPages: data.totalPages,
            hasNext: data.hasNext,
            hasPrev: data.hasPrev,
            loading: false,
          });
        } catch (err) {
          console.error("❌ Error fetching IOCs:", err);
          set({ loading: false });
        }
      },

      fetchCounts: async () => {
        try {
          const res = await axios.get("http://localhost:3000/api/iocs/counts");
          set({ counts: res.data.data });
        } catch (err) {
          console.error("❌ Error fetching counts:", err);
        }
      },

      fetchStats: async () => {
        try {
          const res = await axios.get("http://localhost:3000/api/iocs/stats");
          set({ stats: res.data.data });
        } catch (err) {
          console.error("❌ Error fetching stats:", err);
        }
      },

      refreshFeeds: async () => {
        try {
          await axios.get("http://localhost:3000/api/iocs/refresh");
          get().fetchIOCs();
          get().fetchCounts();
          get().fetchStats();
        } catch (err) {
          console.error("❌ Error refreshing feeds:", err);
        }
      },

      // === Export IOCs ===
      exportIOCs: async (format: "csv" | "json") => {
        try {
          const { filters } = get();
          const res = await axios.get("http://localhost:3000/api/iocs/export", {
            params: { ...filters, format },
            responseType: "blob", // important for file download
          });

          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `iocs-${Date.now()}.${format}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err) {
          console.error("❌ Error exporting IOCs:", err);
        }
      },
    }),
    {
      name: "threat-intel-storage",
      getStorage: () => localStorage,
    }
  )
);
