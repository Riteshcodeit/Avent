// import axios from "axios";
// import { normalizeEntry, mergeAndDedupe } from "../utils/normalizer.js";

// let feeds = []; // in-memory store of all IOCs

// // === Fetch from sources ===
// async function fetchBlocklist() {
//   try {
//     const res = await axios.get("https://lists.blocklist.de/lists/all.txt");
//     return res.data
//       .split("\n")
//       .filter(line => line.trim() && !line.startsWith("#"))
//       .map(ip => normalizeEntry({ value: ip, type: "ip", source: "blocklist.de" }));
//   } catch {
//     return [];
//   }
// }

// async function fetchSpamhaus() {
//   try {
//     const res = await axios.get("https://www.spamhaus.org/drop/drop.txt");
//     return res.data
//       .split("\n")
//       .filter(line => line.trim() && !line.startsWith(";"))
//       .map(row => {
//         const subnet = row.split(";")[0].trim();
//         return normalizeEntry({ value: subnet, type: "subnet", source: "spamhaus" });
//       });
//   } catch {
//     return [];
//   }
// }

// async function fetchDigitalside() {
//   try {
//     const res = await axios.get("https://osint.digitalside.it/Threat-Intel/digitalside-misp-feed.json");
//     return res.data.map(item =>
//       normalizeEntry({
//         value: item.url || item.value || "unknown",
//         type: "url",
//         source: "digitalside",
//         timestamp: item.date
//       })
//     );
//   } catch {
//     return [];
//   }
// }

// // === Service Functions ===

// // Refresh feeds (pull from all sources + merge)
// export async function fetchFeeds() {
//   const [blocklist, spamhaus, digitalside] = await Promise.all([
//     fetchBlocklist(),
//     fetchSpamhaus(),
//     fetchDigitalside()
//   ]);
//   feeds = mergeAndDedupe(feeds, [...blocklist, ...spamhaus, ...digitalside]);
// }

// // Get feeds (with filters / counts / pagination)
// export function getFeeds({ type, source, q, page = 1, limit = 50, sort, countsOnly = false }) {
//   let results = feeds;

//   // === Filtering ===
//   if (type) results = results.filter(r => r.type === type.toLowerCase());
//   if (source) results = results.filter(r => r.source === source.toLowerCase());
//   if (q) results = results.filter(r => r.value.toLowerCase().includes(q.toLowerCase()));

//   // === Counts only ===
//   if (countsOnly) {
//     const byType = {};
//     const bySource = {};
//     results.forEach(r => {
//       byType[r.type] = (byType[r.type] || 0) + 1;
//       bySource[r.source] = (bySource[r.source] || 0) + 1;
//     });
//     return { total: results.length, byType, bySource };
//   }

//   // === Sorting ===
//   if (sort === "latest") results = results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//   if (sort === "alpha") results = results.sort((a, b) => a.value.localeCompare(b.value));

//   // === Pagination ===
//   const start = (page - 1) * limit;
//   const paged = results.slice(start, start + limit);

//   return { total: results.length, page, limit, results: paged };
// }


import axios from "axios";
import { normalizeEntry, mergeAndDedupe } from "../utils/normalizer.js";

let feeds = []; // in-memory store of all IOCs
let lastFetchTime = null;
let fetchStats = {
    totalFetches: 0,
    successfulFetches: 0,
    failedFetches: 0,
    lastError: null
};

// Enhanced fetch functions with better error handling and logging

async function fetchBlocklist() {
    try {
        console.log('📡 Fetching from Blocklist.de...')
        const res = await axios.get("https://lists.blocklist.de/lists/all.txt", {
            timeout: 30000,
            headers: { 'User-Agent': 'ThreatIntel-Dashboard/1.0' }
        });
        
        const entries = res.data
            .split("\n")
            .filter(line => line.trim() && !line.startsWith("#"))
            .map(ip => normalizeEntry({ 
                value: ip.trim(), 
                type: "ip", 
                source: "blocklist.de" 
            }));
        
        console.log(`✅ Blocklist.de: ${entries.length} IPs fetched`)
        return entries;
    } catch (error) {
        console.error('❌ Blocklist.de fetch failed:', error.message)
        return [];
    }
}

async function fetchSpamhaus() {
    try {
        console.log('📡 Fetching from Spamhaus...')
        const res = await axios.get("https://www.spamhaus.org/drop/drop.txt", {
            timeout: 30000,
            headers: { 'User-Agent': 'ThreatIntel-Dashboard/1.0' }
        });
        
        const entries = res.data
            .split("\n")
            .filter(line => line.trim() && !line.startsWith(";"))
            .map(row => {
                const parts = row.split(";");
                const subnet = parts[0]?.trim();
                if (!subnet) return null;
                
                return normalizeEntry({ 
                    value: subnet, 
                    type: "subnet", 
                    source: "spamhaus" 
                });
            })
            .filter(Boolean);
        
        console.log(`✅ Spamhaus: ${entries.length} subnets fetched`)
        return entries;
    } catch (error) {
        console.error('❌ Spamhaus fetch failed:', error.message)
        return [];
    }
}

async function fetchDigitalside() {
    try {
        console.log('📡 Fetching from Digitalside...')
        const res = await axios.get("https://osint.digitalside.it/Threat-Intel/digitalside-misp-feed.json", {
            timeout: 30000,
            headers: { 'User-Agent': 'ThreatIntel-Dashboard/1.0' }
        });
        
        const entries = res.data
            .filter(item => item && (item.url || item.value))
            .map(item => normalizeEntry({
                value: item.url || item.value || "unknown",
                type: "url",
                source: "digitalside",
                timestamp: item.date || item.timestamp
            }));
        
        console.log(`✅ Digitalside: ${entries.length} URLs fetched`)
        return entries;
    } catch (error) {
        console.error('❌ Digitalside fetch failed:', error.message)
        return [];
    }
}

// === Service Functions ===

// Refresh feeds (pull from all sources + merge)
export async function fetchFeeds() {
    const startTime = Date.now();
    fetchStats.totalFetches++;
    
    try {
        console.log('🔄 Starting threat intelligence feed refresh...')
        
        const [blocklist, spamhaus, digitalside] = await Promise.all([
            fetchBlocklist(),
            fetchSpamhaus(),
            fetchDigitalside()
        ]);
        
        const newFeeds = [...blocklist, ...spamhaus, ...digitalside];
        const beforeCount = feeds.length;
        
        feeds = mergeAndDedupe(feeds, newFeeds);
        
        const duration = Date.now() - startTime;
        lastFetchTime = new Date().toISOString();
        fetchStats.successfulFetches++;
        fetchStats.lastError = null;
        
        console.log(`✅ Refresh completed: ${feeds.length} total IOCs (${feeds.length - beforeCount} new/updated) in ${duration}ms`)
        
        return {
            success: true,
            total: feeds.length,
            newEntries: feeds.length - beforeCount,
            duration,
            timestamp: lastFetchTime
        };
    } catch (error) {
        fetchStats.failedFetches++;
        fetchStats.lastError = error.message;
        console.error('❌ Feed refresh failed:', error)
        throw error;
    }
}

// Get feeds (with filters / counts / pagination)
export function getFeeds({ 
    type, 
    source, 
    q, 
    page = 1, 
    limit = 50, 
    sort = 'latest', 
    countsOnly = false 
}) {
    let results = [...feeds]; // Create a copy to avoid mutations

    // === Filtering ===
    if (type) {
        const typeFilter = type.toLowerCase();
        results = results.filter(r => r.type === typeFilter);
    }
    
    if (source) {
        const sourceFilter = source.toLowerCase();
        results = results.filter(r => r.source === sourceFilter);
    }
    
    if (q) {
        const query = q.toLowerCase();
        results = results.filter(r => 
            r.value.toLowerCase().includes(query) ||
            r.type.toLowerCase().includes(query) ||
            r.source.toLowerCase().includes(query)
        );
    }

    // === Counts only ===
    if (countsOnly) {
        const byType = {};
        const bySource = {};
        
        results.forEach(r => {
            byType[r.type] = (byType[r.type] || 0) + 1;
            bySource[r.source] = (bySource[r.source] || 0) + 1;
        });
        
        return { 
            total: results.length, 
            byType, 
            bySource 
        };
    }

    // === Sorting ===
    switch (sort) {
        case 'latest':
            results = results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            break;
        case 'oldest':
            results = results.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            break;
        case 'alpha':
            results = results.sort((a, b) => a.value.localeCompare(b.value));
            break;
        case 'alpha-desc':
            results = results.sort((a, b) => b.value.localeCompare(a.value));
            break;
        default:
            // Keep original order
            break;
    }

    // === Pagination ===
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limit);
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    return {
        total: totalResults,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        results: paged
    };
}

// Get detailed statistics
export function getFeedsStats() {
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    
    const recentHour = feeds.filter(f => new Date(f.timestamp) > oneHourAgo).length;
    const recentDay = feeds.filter(f => new Date(f.timestamp) > oneDayAgo).length;
    
    const byType = {};
    const bySource = {};
    const byHour = {};
    
    feeds.forEach(feed => {
        // Count by type
        byType[feed.type] = (byType[feed.type] || 0) + 1;
        
        // Count by source
        bySource[feed.source] = (bySource[feed.source] || 0) + 1;
        
        // Count by hour (last 24 hours)
        const hour = new Date(feed.timestamp).getHours();
        byHour[hour] = (byHour[hour] || 0) + 1;
    });
    
    return {
        total: feeds.length,
        lastFetchTime,
        fetchStats,
        breakdown: {
            byType,
            bySource,
            byHour
        },
        recentActivity: {
            lastHour: recentHour,
            lastDay: recentDay
        },
        oldestEntry: feeds.length > 0 ? 
            feeds.reduce((oldest, current) => 
                new Date(current.timestamp) < new Date(oldest.timestamp) ? current : oldest
            ).timestamp : null,
        newestEntry: feeds.length > 0 ?
            feeds.reduce((newest, current) => 
                new Date(current.timestamp) > new Date(newest.timestamp) ? current : newest
            ).timestamp : null
    };
}

// Get current feed count
export function getCurrentFeedCount() {
    return feeds.length;
}

// Clear all feeds (useful for testing)
export function clearFeeds() {
    feeds = [];
    console.log('🗑️ All feeds cleared')
}