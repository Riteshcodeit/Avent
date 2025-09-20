// -----------------------------------------------------------------------------------

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

export default router