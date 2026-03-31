'use client';

import { useState, useCallback } from 'react';
import Header from './components/Header';
import SendPayment from './components/SendPayment';
import ParticleWave from './components/ParticleWave';
import { checkConnection, retrievePublicKey, getBalance } from './components/Freighter';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState('0');

  const handleConnect = useCallback(async () => {
    try {
      await checkConnection();
      const key = await retrievePublicKey();
      const bal = await getBalance();
      setPublicKey(key);
      setBalance(bal);
      setConnected(true);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnected(false);
    setPublicKey('');
    setBalance('0');
  }, []);

  const refreshBalance = useCallback(async () => {
    try {
      const bal = await getBalance();
      setBalance(bal);
    } catch (err) {
      console.error('Balance refresh failed:', err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Particle wave background */}
      <ParticleWave />

      <Header
        connected={connected}
        publicKey={publicKey}
        balance={balance}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-semibold text-white tracking-tight mb-2">
            Send payment
          </h1>
          <p className="text-[15px] text-white/65">
            Transfer XLM to any Stellar address on testnet
          </p>
        </div>

        <SendPayment connected={connected} onSuccess={refreshBalance} />
      </main>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-center gap-4 text-[11px] text-[#444] border-t border-[#1a1a1a] relative z-10">
        <span>Stellar Testnet</span>
        <span className="text-[#222]">·</span>
        <span>Horizon API</span>
        <span className="text-[#222]">·</span>
        <span>Freighter Wallet</span>
      </footer>
    </div>
  );
}
