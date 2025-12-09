export interface ProxyServer {
  id: string;
  ip: string;
  port: number;
  country: string;
  countryCode: string; // ISO 2-letter code
  city: string;
  latency: number; // in ms
  protocol: 'HTTP' | 'HTTPS' | 'SOCKS5';
  encryption: 'AES-256' | 'ChaCha20' | 'None';
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}

export interface SecurityReport {
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  encryptionAnalysis: string;
}
