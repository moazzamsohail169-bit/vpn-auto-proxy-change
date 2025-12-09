import { ProxyServer } from './types';

// Helper to generate random IP
const randomIp = () => Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');

const countries = [
  { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Dallas'] },
  { code: 'GB', name: 'United Kingdom', cities: ['London', 'Manchester', 'Glasgow'] },
  { code: 'DE', name: 'Germany', cities: ['Frankfurt', 'Berlin', 'Munich'] },
  { code: 'FR', name: 'France', cities: ['Paris', 'Lyon', 'Marseille'] },
  { code: 'JP', name: 'Japan', cities: ['Tokyo', 'Osaka', 'Sapporo'] },
  { code: 'SG', name: 'Singapore', cities: ['Singapore'] },
  { code: 'CA', name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] },
  { code: 'NL', name: 'Netherlands', cities: ['Amsterdam', 'Rotterdam'] },
  { code: 'AU', name: 'Australia', cities: ['Sydney', 'Melbourne'] },
  { code: 'BR', name: 'Brazil', cities: ['Sao Paulo', 'Rio de Janeiro'] },
  { code: 'IN', name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore'] },
  { code: 'CH', name: 'Switzerland', cities: ['Zurich', 'Geneva'] },
];

const protocols: ('HTTP' | 'HTTPS' | 'SOCKS5')[] = ['HTTP', 'HTTPS', 'SOCKS5'];

// Generate 60 Proxies
export const PROXY_LIST: ProxyServer[] = Array.from({ length: 60 }, (_, i) => {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const city = country.cities[Math.floor(Math.random() * country.cities.length)];
  
  return {
    id: `px-${i + 1000}`,
    ip: randomIp(),
    port: Math.floor(Math.random() * (65535 - 1000 + 1) + 1000),
    country: country.name,
    countryCode: country.code,
    city: city,
    latency: Math.floor(Math.random() * 300) + 20,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    encryption: Math.random() > 0.3 ? 'AES-256' : 'ChaCha20',
  };
});

export const ROTATION_INTERVAL_SECONDS = 300; // 5 Minutes
