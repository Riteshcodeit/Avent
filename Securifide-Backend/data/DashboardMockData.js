// Backend Mock Data - Converted from TypeScript
// Place this file in your backend's data directory

// Utility functions for generating realistic IOC data
const generateRandomIP = () => {
  const ranges = [
    () => `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    () => `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    () => `172.${16 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    () => `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
  ];
  return ranges[Math.floor(Math.random() * ranges.length)]();
};

const generateRandomSubnet = () => {
  const ip = generateRandomIP();
  const cidrs = [8, 16, 24, 28, 32];
  const cidr = cidrs[Math.floor(Math.random() * cidrs.length)];
  return `${ip}/${cidr}`;
};

const generateRandomDomain = () => {
  const suspiciousPrefixes = [
    'malicious', 'evil', 'bad', 'threat', 'spam', 'phishing', 'suspicious', 
    'infected', 'trojan', 'virus', 'malware', 'botnet', 'exploit', 'hack',
    'scam', 'fraud', 'fake', 'rogue', 'dangerous', 'toxic'
  ];
  
  const suffixes = [
    'site', 'domain', 'server', 'host', 'network', 'zone', 'portal', 
    'hub', 'center', 'base', 'link', 'web', 'net', 'service', 'platform'
  ];
  
  const tlds = ['com', 'net', 'org', 'info', 'biz', 'co', 'io', 'de', 'ru', 'cn', 'tk', 'ml', 'ga'];
  
  const prefix = suspiciousPrefixes[Math.floor(Math.random() * suspiciousPrefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const tld = tlds[Math.floor(Math.random() * tlds.length)];
  const num = Math.floor(Math.random() * 9999);
  
  return `${prefix}-${suffix}${num}.${tld}`;
};

const generateRandomURL = () => {
  const protocols = ['http', 'https'];
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  const domain = generateRandomDomain();
  
  const paths = [
    'malware', 'payload', 'download', 'exploit', 'shell', 'backdoor', 
    'trojan', 'virus', 'ransomware', 'keylogger', 'spyware', 'adware',
    'phishing', 'scam', 'fraud', 'fake', 'admin', 'login', 'secure'
  ];
  
  const extensions = ['exe', 'zip', 'rar', 'pdf', 'doc', 'php', 'jsp', 'asp', 'html', 'js'];
  
  const path = paths[Math.floor(Math.random() * paths.length)];
  const filename = Math.random().toString(36).substring(7);
  const ext = extensions[Math.floor(Math.random() * extensions.length)];
  
  return `${protocol}://${domain}/${path}/${filename}.${ext}`;
};

const generateRandomHash = () => {
  return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

const generateRandomTimestamp = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime).toISOString().slice(0, 16).replace('T', ' ');
};

const iocTypes = ['ip', 'domain', 'url', 'hash', 'subnet'];
const threatSources = ['spamhaus', 'blocklist.de', 'digitalside', 'malwaredomainlist', 'phishtank', 'urlvoid', 'virustotal', 'abuse.ch'];

// Generate 500 IOCs
const mockIOCs = [];
for (let i = 1; i <= 500; i++) {
  const type = iocTypes[Math.floor(Math.random() * iocTypes.length)];
  let value;
  
  switch (type) {
    case 'ip':
      value = generateRandomIP();
      break;
    case 'domain':
      value = generateRandomDomain();
      break;
    case 'url':
      value = generateRandomURL();
      break;
    case 'hash':
      value = generateRandomHash();
      break;
    case 'subnet':
      value = generateRandomSubnet();
      break;
    default:
      value = generateRandomIP();
  }
  
  const source = threatSources[Math.floor(Math.random() * threatSources.length)];
  const timestamp = generateRandomTimestamp();
  const confidence = Math.floor(Math.random() * 20) + 80;
  
  mockIOCs.push({
    id: i,
    value,
    type,
    source,
    timestamp,
    confidence
  });
}

// Calculate actual distribution
const actualCounts = {
  total: mockIOCs.length,
  byType: {},
  bySource: {}
};

iocTypes.forEach(type => {
  actualCounts.byType[type] = mockIOCs.filter(ioc => ioc.type === type).length;
});

threatSources.forEach(source => {
  actualCounts.bySource[source] = mockIOCs.filter(ioc => ioc.source === source).length;
});

// Enhanced mock counts
const mockCounts = {
  total: 15420 + mockIOCs.length,
  byType: {
    ip: 8500 + actualCounts.byType.ip,
    domain: 3200 + actualCounts.byType.domain,
    url: 2100 + actualCounts.byType.url,
    hash: 1120 + actualCounts.byType.hash,
    subnet: 500 + actualCounts.byType.subnet
  },
  bySource: {
    spamhaus: 7800 + (actualCounts.bySource.spamhaus || 0),
    'blocklist.de': 4200 + (actualCounts.bySource['blocklist.de'] || 0),
    digitalside: 3420 + (actualCounts.bySource.digitalside || 0),
    malwaredomainlist: 2100 + (actualCounts.bySource.malwaredomainlist || 0),
    phishtank: 1800 + (actualCounts.bySource.phishtank || 0),
    urlvoid: 1500 + (actualCounts.bySource.urlvoid || 0),
    virustotal: 1200 + (actualCounts.bySource.virustotal || 0),
    'abuse.ch': 900 + (actualCounts.bySource['abuse.ch'] || 0)
  }
};

const mockStats = {
  recentActivity: {
    lastHour: 143 + Math.floor(Math.random() * 50),
    lastDay: 2847 + Math.floor(Math.random() * 500),
    lastWeek: 18500 + Math.floor(Math.random() * 2000),
    lastMonth: 76200 + Math.floor(Math.random() * 5000)
  },
  threatCategories: {
    malware: 35.2,
    phishing: 28.7,
    botnet: 21.5,
    spam: 14.6
  },
  riskLevels: {
    critical: 15.3,
    high: 34.7,
    medium: 38.2,
    low: 11.8
  },
  topCountries: {
    russia: 18.5,
    china: 14.0,
    usa: 12.5,
    brazil: 9.4,
    india: 8.0,
    others: 37.6
  }
};

const chartData = [
  { name: 'Jan', value: 4000, threats: 1200, blocked: 3800 },
  { name: 'Feb', value: 3000, threats: 900, blocked: 2950 },
  { name: 'Mar', value: 5000, threats: 1500, blocked: 4850 },
  { name: 'Apr', value: 4500, threats: 1350, blocked: 4400 },
  { name: 'May', value: 6000, threats: 1800, blocked: 5900 },
  { name: 'Jun', value: 5500, threats: 1650, blocked: 5350 },
  { name: 'Jul', value: 6200, threats: 1860, blocked: 6050 },
  { name: 'Aug', value: 5800, threats: 1740, blocked: 5650 },
  { name: 'Sep', value: 7100, threats: 2130, blocked: 6950 },
  { name: 'Oct', value: 6800, threats: 2040, blocked: 6650 },
  { name: 'Nov', value: 7500, threats: 2250, blocked: 7350 },
  { name: 'Dec', value: 8200, threats: 2460, blocked: 8000 }
];

const threatTypeChartData = Object.entries(mockCounts.byType).map(([name, value]) => ({
  name: name.toUpperCase(),
  value,
  percentage: ((value / mockCounts.total) * 100).toFixed(1)
}));

const sourceChartData = Object.entries(mockCounts.bySource).map(([name, value]) => ({
  name,
  value,
  percentage: ((value / mockCounts.total) * 100).toFixed(1)
}));

const geographicData = [
  { country: 'Russia', code: 'RU', count: 2847, percentage: 18.5, color: '#FF6B9D' },
  { country: 'China', code: 'CN', count: 2156, percentage: 14.0, color: '#00D9FF' },
  { country: 'United States', code: 'US', count: 1923, percentage: 12.5, color: '#45B7D1' },
  { country: 'Brazil', code: 'BR', count: 1456, percentage: 9.4, color: '#96CEB4' },
  { country: 'India', code: 'IN', count: 1234, percentage: 8.0, color: '#FFEAA7' },
  { country: 'Germany', code: 'DE', count: 987, percentage: 6.4, color: '#DDA0DD' },
  { country: 'France', code: 'FR', count: 765, percentage: 5.0, color: '#FFB6C1' },
  { country: 'United Kingdom', code: 'GB', count: 654, percentage: 4.2, color: '#98FB98' },
  { country: 'Japan', code: 'JP', count: 543, percentage: 3.5, color: '#F0E68C' },
  { country: 'Others', code: 'XX', count: 2855, percentage: 18.5, color: '#D3D3D3' }
];

export {
  mockIOCs,
  mockCounts,
  mockStats,
  chartData,
  threatTypeChartData,
  sourceChartData,
  geographicData
};