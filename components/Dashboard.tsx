import React, { useState, useEffect, useCallback } from 'react';
import { ProxyServer, ConnectionState, SecurityReport } from '../types';
import { ROTATION_INTERVAL_SECONDS } from '../constants';
import { analyzeProxySecurity } from '../services/geminiService';

interface DashboardProps {
  currentProxy: ProxyServer | null;
  connectionState: ConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  onRotateNow: () => void;
  timer: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentProxy,
  connectionState,
  onConnect,
  onDisconnect,
  onRotateNow,
  timer
}) => {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Auto-analyze when proxy changes if connected
  useEffect(() => {
    if (connectionState === ConnectionState.CONNECTED && currentProxy) {
      handleAnalysis(currentProxy);
    } else {
      setReport(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProxy?.id, connectionState]);

  const handleAnalysis = async (proxy: ProxyServer) => {
    setAnalyzing(true);
    setReport(null);
    try {
      const result = await analyzeProxySecurity(proxy);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isConnected = connectionState === ConnectionState.CONNECTED;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center relative overflow-hidden group">
        
        {/* Background Glow */}
        <div className={`absolute inset-0 opacity-20 blur-3xl transition-colors duration-700 ${
          isConnected ? 'bg-emerald-600' : 'bg-red-900'
        }`}></div>

        <div className="relative z-10">
          <div className="mb-6 flex justify-center">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              isConnected 
              ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.4)]' 
              : 'border-gray-700 bg-gray-800 shadow-none'
            }`}>
              <i className={`fa-solid fa-power-off text-5xl transition-colors duration-300 ${isConnected ? 'text-emerald-400' : 'text-gray-500'}`}></i>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-white">
            {isConnected ? 'SECURELY CONNECTED' : 'DISCONNECTED'}
          </h2>
          <p className="text-gray-400 mb-8">
            {isConnected 
              ? `Tunneling via ${currentProxy?.city}, ${currentProxy?.country}` 
              : 'System is dormant. Connect to start proxy rotation.'}
          </p>

          <div className="flex justify-center gap-4">
            {!isConnected ? (
              <button 
                onClick={onConnect}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold tracking-wide transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
              >
                CONNECT
              </button>
            ) : (
              <button 
                onClick={onDisconnect}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold tracking-wide transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
              >
                DISCONNECT
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats & Timer */}
      {isConnected && currentProxy && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Rotation Timer */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-400 text-sm font-mono uppercase">Auto-Rotation In</span>
              <i className="fa-solid fa-clock-rotate-left text-blue-400"></i>
            </div>
            <div className="text-4xl font-mono font-bold text-white mb-2">
              {formatTime(timer)}
            </div>
            <button 
              onClick={onRotateNow}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-arrows-rotate"></i> Rotate Now
            </button>
          </div>

          {/* Current IP Info */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
             <div className="flex justify-between items-start mb-4">
              <span className="text-gray-400 text-sm font-mono uppercase">Active Configuration</span>
              <i className="fa-solid fa-server text-purple-400"></i>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IP Address</span>
                <span className="text-white font-mono">{currentProxy.ip}</span>
              </div>
               <div className="flex justify-between text-sm">
                <span className="text-gray-500">Port</span>
                <span className="text-white font-mono">{currentProxy.port}</span>
              </div>
               <div className="flex justify-between text-sm">
                <span className="text-gray-500">Protocol</span>
                <span className="text-purple-400 font-bold">{currentProxy.protocol}</span>
              </div>
            </div>
          </div>
          
          {/* AI Security Analysis */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
               <i className="fa-solid fa-robot text-pink-500"></i>
               <h3 className="text-white font-bold text-lg">Gemini Security Analysis</h3>
            </div>
            
            {analyzing ? (
               <div className="flex flex-col items-center py-4">
                  <i className="fa-solid fa-circle-notch fa-spin text-2xl text-pink-500 mb-2"></i>
                  <span className="text-gray-400 text-sm">Analyzing encryption protocols...</span>
               </div>
            ) : report ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-3">
                   <span className="text-gray-400 text-sm">Risk Level:</span>
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      report.riskLevel === 'High' ? 'bg-red-900/50 text-red-400 border border-red-500/30' :
                      report.riskLevel === 'Medium' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                      'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30'
                   }`}>
                      {report.riskLevel}
                   </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-pink-500 pl-3">
                   {report.summary}
                </p>
                <p className="text-gray-400 text-xs italic">
                   <i className="fa-solid fa-lock mr-1"></i> {report.encryptionAnalysis}
                </p>
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic">Connect to a server to generate an AI security report.</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
