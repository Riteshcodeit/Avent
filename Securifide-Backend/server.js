// import express from 'express'
// import cors from 'cors'
// import iocRoutes from './routes/iocRoutes.js'
// import { fetchFeeds } from './Services/iocServices.js'

// const app = express()
// const PORT = process.env.PORT || 3000

// app.use(cors())
// app.use(express.json())

// app.use('/iocs',iocRoutes)

// app.get('/',(req,res)=>{
//     res.send(`Welcome to the Server ..........   `)
// })

// app.listen(PORT, ()=>{
//     console.log(`Server is running on port ${PORT}`)
// })



import express from 'express'
import cors from 'cors'
import iocRoutes from './routes/iocRoutes.js'
import { fetchFeeds } from './Services/iocServices.js'

const app = express()
const PORT = process.env.PORT || 3000

// Enhanced CORS configuration for frontend development
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true
}))

app.use(express.json())

// IOC routes
app.use('/api/iocs', iocRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/', (req, res) => {
    res.json({ 
        message: 'Threat Intelligence API Server',
        endpoints: {
            health: '/health',
            iocs: '/api/iocs',
            refresh: '/api/iocs/refresh',
            counts: '/api/iocs/counts'
        }
    })
})

// Initial data fetch on server start
async function initializeServer() {
    try {
        console.log('🔄 Initializing server with threat intelligence data...')
        await fetchFeeds()
        console.log('✅ Initial threat intelligence data loaded')
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`)
            console.log(`📊 API endpoints available at http://localhost:${PORT}/api/iocs`)
        })
    } catch (error) {
        console.error('❌ Failed to initialize server:', error)
        process.exit(1)
    }
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('🔄 Shutting down server gracefully...')
    process.exit(0)
})

process.on('SIGINT', () => {
    console.log('🔄 Shutting down server gracefully...')
    process.exit(0)
})

initializeServer()