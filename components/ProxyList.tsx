import React from 'react';
import { ProxyServer } from '../types';

interface ProxyListProps {
  proxies: ProxyServer[];
  currentProxyId: string | null;
  onSelect: (proxy: ProxyServer) => void;
}

export const ProxyList: React.FC<ProxyListProps> = ({ proxies, currentProxyId, onSelect }) => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-800 bg-gray-850">
        <h3 className="text-gray-200 font-semibold flex items-center gap-2">
          <i className="fa-solid fa-globe text-blue-500"></i>
          Global Server Network ({proxies.length})
        </h3>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
        {proxies.map((proxy) => {
          const isActive = proxy.id === currentProxyId;
          return (
            <div
              key={proxy.id}
              onClick={() => onSelect(proxy)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                isActive 
                  ? 'bg-blue-900/20 border-blue-500/50' 
                  : 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                      {proxy.countryCode}
                   </div>
                   <div>
                      <div className={`text-sm font-medium ${isActive ? 'text-blue-200' : 'text-gray-300'}`}>
                        {proxy.city}, {proxy.country}
                      </div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">
                        {proxy.ip}:{proxy.port}
                      </div>
                   </div>
                </div>
                
                <div className="text-right">
                   <div className="flex items-center justify-end gap-1.5 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${proxy.protocol === 'HTTP' ? 'bg-yellow-900/30 text-yellow-500' : 'bg-purple-900/30 text-purple-400'}`}>
                        {proxy.protocol}
                      </span>
                   </div>
                   <div className="text-[10px] text-gray-500 flex items-center justify-end gap-1">
                      <i className="fa-solid fa-signal"></i> {proxy.latency}ms
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
