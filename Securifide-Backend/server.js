

import express from 'express'
import cors from 'cors'
import iocRoutes from './routes/iocRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Enhanced CORS configuration for frontend development
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://aventsecurifide.netlify.app/'] 
        : ['http://localhost:5173'],
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

app.listen(PORT , ()=>{
    console.log(`Server is running on the port ${PORT}`);
    
})