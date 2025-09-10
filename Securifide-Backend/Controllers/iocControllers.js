// ----------------------------------------------------------------------------------------

// Import the mock data - you'll need to create this file in your backend
import { 
    mockIOCs, 
    mockCounts, 
    mockStats, 
    chartData, 
    threatTypeChartData, 
    sourceChartData, 
    geographicData 
} from "../data/DashboardMockData.js"

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
        const limitNum = Math.min(1000, Math.max(1, parseInt(limit)))

        // Filter mockIOCs based on query parameters
        let filteredIOCs = mockIOCs.filter(ioc => {
            const matchesQuery = !q || 
                ioc.value.toLowerCase().includes(q.toLowerCase()) ||
                ioc.type.toLowerCase().includes(q.toLowerCase()) ||
                ioc.source.toLowerCase().includes(q.toLowerCase())
            
            const matchesType = !type || ioc.type === type
            const matchesSource = !source || ioc.source === source
            
            return matchesQuery && matchesType && matchesSource
        })

        // Sort filtered results
        filteredIOCs.sort((a, b) => {
            switch (sort) {
                case 'latest':
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                case 'oldest':
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                case 'alpha':
                    return a.value.localeCompare(b.value)
                case 'alpha-desc':
                    return b.value.localeCompare(a.value)
                case 'confidence':
                    return b.confidence - a.confidence
                case 'confidence-asc':
                    return a.confidence - b.confidence
                default:
                    return 0
            }
        })

        // Pagination
        const total = filteredIOCs.length
        const totalPages = Math.ceil(total / limitNum)
        const startIndex = (pageNum - 1) * limitNum
        const endIndex = startIndex + limitNum
        const results = filteredIOCs.slice(startIndex, endIndex)

        const response = {
            results,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
        }

        res.json({
            success: true,
            data: response,
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
        
        // Simulate refresh delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
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
        res.json({
            success: true,
            data: {
                total: mockCounts.total,
                byType: mockCounts.byType,
                bySource: mockCounts.bySource,
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
        const stats = {
            ...mockStats,
            chartData,
            threatTypeChartData,
            sourceChartData,
            geographicData,
            lastUpdated: new Date().toISOString()
        }
        
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
        const { format = 'json', type, source, q } = req.query
        
        // Filter IOCs based on export parameters
        let filteredIOCs = mockIOCs.filter(ioc => {
            const matchesQuery = !q || 
                ioc.value.toLowerCase().includes(q.toLowerCase()) ||
                ioc.type.toLowerCase().includes(q.toLowerCase()) ||
                ioc.source.toLowerCase().includes(q.toLowerCase())
            
            const matchesType = !type || ioc.type === type
            const matchesSource = !source || ioc.source === source
            
            return matchesQuery && matchesType && matchesSource
        })
        
        if (format === 'csv') {
            const csvHeader = 'value,type,source,timestamp,confidence\n'
            const csvData = filteredIOCs.map(ioc => 
                `"${ioc.value}","${ioc.type}","${ioc.source}","${ioc.timestamp}","${ioc.confidence}"`
            ).join('\n')
            
            res.setHeader('Content-Type', 'text/csv')
            res.setHeader('Content-Disposition', `attachment; filename="iocs-${Date.now()}.csv"`)
            res.send(csvHeader + csvData)
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Content-Disposition', `attachment; filename="iocs-${Date.now()}.json"`)
            res.json({
                exported_at: new Date().toISOString(),
                total: filteredIOCs.length,
                data: filteredIOCs
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