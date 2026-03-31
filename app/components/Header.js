'use client';

import Image from 'next/image';
import appIcon from '../app-icon.png';

const Header = ({ connected, publicKey, balance, onConnect, onDisconnect }) => {
    return (
        <header className="relative z-50 h-16 w-full flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0a]/60 backdrop-blur-2xl">
            {/* Logo */}
            <div className="flex items-center gap-8">
                <span className="flex items-center text-[22px] tracking-tight">
                    <Image src={appIcon} alt="StellarPay Logo" width={44} height={44} className="rounded-md" />
                    <span>
                        <span className="font-bold text-white">Stellar</span>
                        <span className="font-medium text-white/50">Pay</span>
                    </span>
                </span>
                <nav className="hidden sm:flex items-center gap-6 text-[13px] font-medium text-white/40">
                    <a href="https://laboratory.stellar.org/#account-creator?network=test" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Faucet <span className="opacity-50 ml-0.5">↗</span></a>
                    <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Explorer <span className="opacity-50 ml-0.5">↗</span></a>
                </nav>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {connected && publicKey ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center h-10 px-4 border border-white/10 bg-white/5 backdrop-blur-md">
                            <span className="text-[13px] font-mono font-medium text-white">
                                {Number(balance).toFixed(2)} <span className="text-white/50 tracking-widest pl-1">XLM</span>
                            </span>
                            <div className="w-px h-4 bg-white/15 mx-3" />
                            <span className="text-[13px] font-mono text-white/70">
                                {publicKey.slice(0, 6)}…{publicKey.slice(-4)}
                            </span>
                        </div>
                        <button
                            onClick={onDisconnect}
                            className="h-10 px-4 text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onConnect}
                        className="h-10 px-5 text-[13px] font-semibold text-black bg-white hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;