# StellarPay — Stellar Testnet Payment dApp

A clean, minimal payment dApp built on the Stellar testnet. Connect your Freighter wallet, view your XLM balance, and send payments to any Stellar address — with real-time transaction feedback.

## Features

- **Wallet Connection** — Connect and disconnect via Freighter browser extension
- **Balance Display** — Fetches and displays your XLM balance from Horizon testnet
- **Send XLM** — Transfer any amount of XLM to a valid Stellar address
- **Transaction Feedback** — Success/failure states with clickable transaction hash linking to Stellar Explorer
- **Input Validation** — Validates Stellar addresses and amounts before submission
- **Auto-Refresh** — Balance updates automatically after a successful transaction

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Framework   | [Next.js 16](https://nextjs.org)         |
| Language    | TypeScript + JavaScript (React)          |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com) |
| Blockchain  | [Stellar SDK](https://stellar.org)       |
| Wallet      | [Freighter](https://freighter.app)       |
| Network     | Stellar Testnet (Horizon)                |

## Prerequisites

1. **Node.js** v18+ installed
2. **Freighter Wallet** browser extension installed and set to **Testnet**
3. A funded testnet account (use [Friendbot](https://laboratory.stellar.org/#account-creator?network=test) to fund)

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/stellar-l1.git
cd stellar-l1

# 2. Install dependencies
npm install

# 3. Start the dev server (HTTPS required for Freighter)
npm run dev

# 4. Open https://localhost:3000 in your browser
```

## Project Structure

```
app/
├── components/
│   ├── Freighter.ts      # Wallet service: connect, balance, send payment
│   ├── Header.js         # Navigation bar with wallet connect/disconnect
│   └── SendPayment.js    # Payment form with validation + tx feedback
├── globals.css           # Global styles (Tailwind v4)
├── layout.tsx            # Root layout
└── page.tsx              # Main page — composes Header + SendPayment
```

## How It Works

1. **Connect** — Click "Connect Wallet" to link your Freighter wallet.
2. **View Balance** — Your XLM balance and truncated address appear in the header.
3. **Send XLM** — Enter a destination address and amount, then click "Send XLM".
4. **Confirm** — Approve the transaction in the Freighter popup.
5. **Result** — See the transaction hash (success) or error message (failure).

## Network

This dApp runs on the **Stellar Testnet**. All XLM is test currency with no real value.

- **Horizon API**: `https://horizon-testnet.stellar.org`
- **Network Passphrase**: `Test SDF Network ; September 2015`

## License

MIT
