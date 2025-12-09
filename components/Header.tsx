import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i className="fa-solid fa-shield-halved text-white text-lg"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            VPN - Auto Proxy Change
          </h1>
          <p className="text-xs text-gray-500 font-mono">SECURE ROTATION SYSTEM</p>
        </div>
      </div>
      <div className="flex gap-4 text-xs font-mono text-gray-400">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM ONLINE</span>
         </div>
      </div>
    </header>
  );
};
