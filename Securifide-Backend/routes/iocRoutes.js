// import express from 'express'
// import { getCounts, getIOcs, refreshFeeds } from '../Controllers/iocControllers.js'

// const router = express.Router()

// router.get('/',getIOcs)
// router.post('/ioc',refreshFeeds)
// router.get('/counts',getCounts)

// export default router


import express from 'express'
import { getCounts, getIOCs, refreshFeeds, getStats, exportIOCs } from '../Controllers/iocControllers.js'

const router = express.Router()

// Get IOCs with filtering, pagination, and sorting
router.get('/', getIOCs)

// Refresh feeds from sources
router.post('/refresh', refreshFeeds)

// Get counts by type and source
router.get('/counts', getCounts)

// Get detailed statistics
router.get('/stats', getStats)

// Export IOCs (CSV, JSON)
router.get('/export', exportIOCs)

// Get available sources and types
router.get('/metadata', (req, res) => {
    res.json({
        sources: ['blocklist.de', 'spamhaus', 'digitalside'],
        types: ['ip', 'subnet', 'url'],
        sortOptions: ['latest', 'oldest', 'alpha', 'alpha-desc']
    })
})

export default router