// export function normalizeEntry({ value, type, source, timestamp }) {
//   return {
//     value: String(value).trim(),
//     type: String(type).toLowerCase(),
//     source: String(source).toLowerCase(),
//     timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString()
//   };
// }

// export function mergeAndDedupe(existing, incoming) {
//   const map = new Map();
//   [...existing, ...incoming].forEach(item => {
//     const key = `${item.source}|${item.value}`;
//     if (!map.has(key)) map.set(key, item);
//     else {
//       const prev = map.get(key);
//       if (new Date(item.timestamp) > new Date(prev.timestamp)) map.set(key, item);
//     }
//   });
//   return Array.from(map.values());
// }



// Enhanced normalizer with better validation and sanitization

export function normalizeEntry({ value, type, source, timestamp }) {
    // Validate and sanitize input
    if (!value || typeof value !== 'string') {
        console.warn('Invalid IOC value:', value)
        return null
    }

    const normalizedValue = String(value).trim()
    
    // Skip empty values
    if (!normalizedValue) {
        return null
    }

    const normalizedType = String(type || 'unknown').toLowerCase()
    const normalizedSource = String(source || 'unknown').toLowerCase()
    
    // Parse and validate timestamp
    let normalizedTimestamp
    try {
        normalizedTimestamp = timestamp 
            ? new Date(timestamp).toISOString() 
            : new Date().toISOString()
    } catch (error) {
        console.warn('Invalid timestamp:', timestamp, 'using current time')
        normalizedTimestamp = new Date().toISOString()
    }

    // Additional validation based on type
    if (!validateIOCByType(normalizedValue, normalizedType)) {
        console.warn(`Invalid ${normalizedType} format:`, normalizedValue)
        // Still include it but mark as potentially invalid
    }

    return {
        value: normalizedValue,
        type: normalizedType,
        source: normalizedSource,
        timestamp: normalizedTimestamp,
        id: generateIOCId(normalizedSource, normalizedValue), // Add unique ID
        confidence: calculateConfidence(normalizedSource), // Add confidence score
    }
}

export function mergeAndDedupe(existing, incoming) {
    const map = new Map()
    
    // Add existing items first
    existing.forEach(item => {
        if (item && item.value && item.source) {
            const key = `${item.source}|${item.value}`
            map.set(key, item)
        }
    })
    
    // Add/update with incoming items
    incoming.forEach(item => {
        if (!item || !item.value || !item.source) {
            return // Skip invalid items
        }
        
        const key = `${item.source}|${item.value}`
        
        if (!map.has(key)) {
            map.set(key, item)
        } else {
            // Update if incoming item is newer
            const existing = map.get(key)
            if (new Date(item.timestamp) > new Date(existing.timestamp)) {
                map.set(key, {
                    ...existing,
                    ...item,
                    // Preserve some fields from existing if they're more complete
                    confidence: Math.max(existing.confidence || 0, item.confidence || 0)
                })
            }
        }
    })
    
    return Array.from(map.values()).filter(Boolean) // Remove any null/undefined items
}

// Validate IOC format based on type
function validateIOCByType(value, type) {
    switch (type) {
        case 'ip':
            return isValidIP(value)
        case 'subnet':
            return isValidSubnet(value)
        case 'url':
            return isValidURL(value)
        case 'domain':
            return isValidDomain(value)
        case 'hash':
            return isValidHash(value)
        default:
            return true // Accept unknown types
    }
}

// IP address validation (IPv4 and IPv6)
function isValidIP(ip) {
    // IPv4 regex
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    
    // IPv6 regex (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

// Subnet validation (CIDR notation)
function isValidSubnet(subnet) {
    const parts = subnet.split('/')
    if (parts.length !== 2) return false
    
    const [ip, prefix] = parts
    const prefixNum = parseInt(prefix, 10)
    
    return isValidIP(ip) && prefixNum >= 0 && prefixNum <= (ip.includes(':') ? 128 : 32)
}

// URL validation
function isValidURL(url) {
    try {
        new URL(url)
        return true
    } catch {
        // Try with protocol if missing
        try {
            new URL(`http://${url}`)
            return true
        } catch {
            return false
        }
    }
}

// Domain validation
function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return domainRegex.test(domain) && domain.length <= 253
}

// Hash validation (MD5, SHA1, SHA256, etc.)
function isValidHash(hash) {
    const hashRegexes = {
        md5: /^[a-fA-F0-9]{32}$/,
        sha1: /^[a-fA-F0-9]{40}$/,
        sha256: /^[a-fA-F0-9]{64}$/,
        sha512: /^[a-fA-F0-9]{128}$/
    }
    
    return Object.values(hashRegexes).some(regex => regex.test(hash))
}

// Generate unique ID for IOC
async function generateIOCId (source, value) {
    const crypto = await import('crypto')
    return crypto.createHash('md5').update(`${source}:${value}`).digest('hex').substring(0, 16)
}

// Calculate confidence score based on source reliability
function calculateConfidence(source) {
    const confidenceScores = {
        'spamhaus': 0.95,
        'blocklist.de': 0.90,
        'digitalside': 0.85,
        'unknown': 0.50
    }
    
    return confidenceScores[source] || confidenceScores['unknown']
}

// Sanitize IOC value (remove common artifacts)
export function sanitizeIOCValue(value, type) {
    let sanitized = value.trim()
    
    switch (type) {
        case 'url':
            // Remove common URL artifacts
            sanitized = sanitized.replace(/\[.\]/g, '.')  // Replace [.] with .
            sanitized = sanitized.replace(/hxxp/gi, 'http') // Replace hxxp with http
            break
        case 'domain':
            // Remove common domain defanging
            sanitized = sanitized.replace(/\[.\]/g, '.')
            break
        case 'ip':
            // Remove common IP defanging
            sanitized = sanitized.replace(/\[.\]/g, '.')
            break
    }
    
    return sanitized
}