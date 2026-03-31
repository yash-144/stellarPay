'use client';

import React, { useState } from 'react';
import { sendPayment } from './Freighter';

const SendPayment = ({ connected, onSuccess }) => {
    const [destination, setDestination] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [txResult, setTxResult] = useState(null);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!connected) return;

        if (!destination || destination.length !== 56 || !destination.startsWith('G')) {
            setTxResult({ success: false, error: 'Invalid address. Must start with G and be 56 characters.' });
            return;
        }
        if (!amount || Number(amount) <= 0) {
            setTxResult({ success: false, error: 'Amount must be greater than 0.' });
            return;
        }

        setLoading(true);
        setTxResult(null);

        const result = await sendPayment(destination, amount);
        setTxResult(result);
        setLoading(false);

        if (result.success) {
            setDestination('');
            setAmount('');
            onSuccess?.();
        }
    };

    return (
        <div className="w-full max-w-[480px]">
            {/* Card */}
            <div className="glass-card overflow-hidden border border-white/15 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
                {/* Card header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#141414] px-5 py-4">
                    <div>
                        <span className="block text-[15px] font-semibold text-white">Send</span>
                        <span className="mt-1 block text-[12px] text-white/65">
                            Fast testnet transfer
                        </span>
                    </div>
                    <span className="border border-white/15 bg-white/18 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.24em] text-white/70">
                        Testnet
                    </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSend} className="p-5 flex flex-col gap-5">
                    {/* To */}
                    <div>
                        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.18em] text-white/72">
                            Recipient
                        </label>
                        <input
                            type="text"
                            placeholder="G..."
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            disabled={!connected || loading}
                            className="w-full border border-white/14 bg-[#050505] px-4 py-3.5 font-mono text-[14px] text-white placeholder:text-white/35 transition-colors outline-none focus:border-white/35 focus:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-45"
                        />
                        <p className="mt-2 text-[12px] text-white/55">
                            Enter a Stellar public key starting with <span className="font-mono text-white/72">G</span>.
                        </p>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.18em] text-white/72">
                            Amount
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                step="any"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={!connected || loading}
                                className="w-full border border-white/14 bg-[#050505] px-4 py-3.5 pr-16 text-[14px] text-white placeholder:text-white/35 transition-colors outline-none focus:border-white/35 focus:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-45"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold tracking-[0.16em] text-white/60">
                                XLM
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="-mx-5 h-px bg-white/10" />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!connected || loading}
                        className="flex w-full items-center justify-center gap-2 border border-white/25 bg-white/92 py-3.5 text-[14px] font-semibold text-black transition-colors hover:bg-white disabled:border-white/8 disabled:bg-white/10 disabled:text-white/35"
                    >
                        {loading ? (
                            <>
                                <span className="inline-block h-3.5 w-3.5 animate-pulse bg-black/70" />
                                Confirming…
                            </>
                        ) : (
                            'Send XLM →'
                        )}
                    </button>
                </form>

                {/* Not connected */}
                {!connected && (
                    <div className="border-t border-white/10 px-5 pb-4 pt-4">
                        <p className="text-center text-[13px] text-white/58">
                            Connect your Freighter wallet to send XLM
                        </p>
                    </div>
                )}
            </div>

            {/* Result */}
            {txResult && (
                <div className={`mt-4 border p-4 ${txResult.success
                    ? 'border-emerald-400/25 bg-[#04160d]'
                    : 'border-rose-400/25 bg-[#1a0505]'
                    }`}>
                    {txResult.success ? (
                        <div>
                            <p className="mb-2 text-[14px] font-semibold text-emerald-200">Transaction confirmed</p>
                            <p className="mb-1 text-[12px] uppercase tracking-[0.16em] text-white/55">Transaction Hash</p>
                            <a
                                href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all font-mono text-[12px] text-sky-200 hover:text-sky-100 hover:underline"
                            >
                                {txResult.hash}
                            </a>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-1 text-[14px] font-semibold text-rose-200">Transaction failed</p>
                            <p className="text-[12px] text-white/72">{txResult.error}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SendPayment;
