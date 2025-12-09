import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProxyList } from './components/ProxyList';
import { Dashboard } from './components/Dashboard';
import { ProxyServer, ConnectionState } from './types';
import { PROXY_LIST, ROTATION_INTERVAL_SECONDS } from './constants';

export default function App() {
  // State
  const [proxies, setProxies] = useState<ProxyServer[]>(PROXY_LIST);
  const [currentProxyId, setCurrentProxyId] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [timer, setTimer] = useState<number>(ROTATION_INTERVAL_SECONDS);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Helper to pick a random proxy that isn't the current one
  const pickRandomProxy = useCallback((excludeId?: string) => {
    const available = proxies.filter(p => p.id !== excludeId);
    const random = available[Math.floor(Math.random() * available.length)];
    return random;
  }, [proxies]);

  // Handle connecting
  const handleConnect = () => {
    setConnectionState(ConnectionState.CONNECTING);
    // Simulate connection delay
    setTimeout(() => {
      const selected = currentProxyId 
        ? proxies.find(p => p.id === currentProxyId) || pickRandomProxy()
        : pickRandomProxy();
      
      setCurrentProxyId(selected.id);
      setConnectionState(ConnectionState.CONNECTED);
      setTimer(ROTATION_INTERVAL_SECONDS);
    }, 1500);
  };

  // Handle disconnecting
  const handleDisconnect = () => {
    setConnectionState(ConnectionState.DISCONNECTED);
    // Optional: Keep current proxy selection or clear it. Let's keep it visually but stop rotation.
  };

  // Handle manual selection
  const handleSelectProxy = (proxy: ProxyServer) => {
    setCurrentProxyId(proxy.id);
    if (connectionState === ConnectionState.CONNECTED) {
       // Reset timer if manually changed while connected
       setTimer(ROTATION_INTERVAL_SECONDS); 
    }
  };

  // Logic: Auto Rotation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (connectionState === ConnectionState.CONNECTED && autoRotate) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
             // Time is up, rotate!
             const nextProxy = pickRandomProxy(currentProxyId || undefined);
             setCurrentProxyId(nextProxy.id);
             // Reset timer
             return ROTATION_INTERVAL_SECONDS;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState, autoRotate, currentProxyId, pickRandomProxy]);

  // Derived state
  const currentProxy = proxies.find(p => p.id === currentProxyId) || null;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500/30">
      <Header />

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Dashboard Controls */}
        <div className="lg:col-span-7 space-y-6">
           <Dashboard 
             currentProxy={currentProxy}
             connectionState={connectionState}
             onConnect={handleConnect}
             onDisconnect={handleDisconnect}
             onRotateNow={() => {
                const next = pickRandomProxy(currentProxyId || undefined);
                setCurrentProxyId(next.id);
                setTimer(ROTATION_INTERVAL_SECONDS);
             }}
             timer={timer}
           />
           
           <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-xs text-gray-500">
             <p className="mb-2"><strong className="text-gray-400">NOTE:</strong> This application is a <strong>Proxy Rotation Manager</strong>. Due to browser security restrictions, it cannot directly change your operating system's network settings.</p> 
             <p>Use the displayed configuration to update your system or external VPN client. The "Auto-Change" feature visually indicates which server to use next based on your 5-minute schedule.</p>
           </div>
        </div>

        {/* Right Column: Proxy List */}
        <div className="lg:col-span-5">
           <div className="flex justify-between items-center mb-4 px-1">
             <h2 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Available Nodes</h2>
             <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Auto-Rotate</span>
                <button 
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${autoRotate ? 'bg-emerald-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${autoRotate ? 'left-6' : 'left-1'}`}></div>
                </button>
             </div>
           </div>
           <ProxyList 
             proxies={proxies}
             currentProxyId={currentProxyId}
             onSelect={handleSelectProxy}
           />
        </div>

      </main>
    </div>
  );
}