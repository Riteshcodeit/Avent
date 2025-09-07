// import { fetchFeeds, getFeeds } from "../Services/iocServices.js"

// //Get IOCS
// export const getIOcs= (req,res)=>{
//     const {type, source, q, page = 1, limit = 50, sort} = req.query
//     const results = getFeeds({type,source,q,page,limit,sort})
//     res.json(results)
// } 
// // Refresh IOCS
// export const refreshFeeds = async(req,res)=>{
//     try {
//         await fetchFeeds()
//         res.json({ status: "ok" });
//     } catch (error) {
//         res.status(500).json({ error: err.message });
        
//     }
// }

// //Get Counts
// export const getCounts = (req,res)=>{
//     const { total, byType, bySource } = getFeeds({ countsOnly: true });
//   res.json({ total, byType, bySource });
// }

import { fetchFeeds, getFeeds, getFeedsStats } from "../Services/iocServices.js"

// Get IOCs with comprehensive filtering and pagination
export const getIOCs = (req, res) => {
    try {
        const {
            type,
            source,
            q,
            page = 1,
            limit = 50,
            sort = 'latest'
        } = req.query

        // Validate parameters
        const pageNum = Math.max(1, parseInt(page))
        const limitNum = Math.min(1000, Math.max(1, parseInt(limit))) // Max 1000 items per page

        const results = getFeeds({
            type,
            source,
            q,
            page: pageNum,
            limit: limitNum,
            sort
        })

        res.json({
            success: true,
            data: results,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Error in getIOCs:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve IOCs',
            message: error.message
        })
    }
}

// Refresh feeds from all sources
export const refreshFeeds = async (req, res) => {
    try {
        console.log('🔄 Manual refresh triggered')
        const startTime = Date.now()
        
        await fetchFeeds()
        
        const duration = Date.now() - startTime
        console.log(`✅ Refresh completed in ${duration}ms`)
        
        res.json({
            success: true,
            message: "Feeds refreshed successfully",
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('❌ Error in refreshFeeds:', error)
        res.status(500).json({
            success: false,
            error: "Failed to refresh feeds",
            message: error.message
        })
    }
}

// Get counts by type and source
export const getCounts = (req, res) => {
    try {
        const { total, byType, bySource } = getFeeds({ countsOnly: true })
        
        res.json({
            success: true,
            data: {
                total,
                byType,
                bySource,
                lastUpdated: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('Error in getCounts:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to get counts',
            message: error.message
        })
    }
}

// Get detailed statistics
export const getStats = (req, res) => {
    try {
        const stats = getFeedsStats()
        
        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Error in getStats:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to get statistics',
            message: error.message
        })
    }
}

// Export IOCs in different formats
export const exportIOCs = (req, res) => {
    try {
        const { format = 'json', type, source } = req.query
        
        const results = getFeeds({ type, source, page: 1, limit: 10000 })
        
        if (format === 'csv') {
            const csvHeader = 'value,type,source,timestamp\n'
            const csvData = results.results.map(ioc => 
                `"${ioc.value}","${ioc.type}","${ioc.source}","${ioc.timestamp}"`
            ).join('\n')
            
            res.setHeader('Content-Type', 'text/csv')
            res.setHeader('Content-Disposition', `attachment; filename="iocs-${Date.now()}.csv"`)
            res.send(csvHeader + csvData)
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Content-Disposition', `attachment; filename="iocs-${Date.now()}.json"`)
            res.json({
                exported_at: new Date().toISOString(),
                total: results.total,
                data: results.results
            })
        }
    } catch (error) {
        console.error('Error in exportIOCs:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to export IOCs',
            message: error.message
        })
    }
}