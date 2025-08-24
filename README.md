# 🌟 SoulCraft - Social Recovery Wallet

![SoulCraft Banner](https://img.shields.io/badge/SoulCraft-Social%20Recovery%20Wallet-purple?style=for-the-badge)
![Sui Blockchain](https://img.shields.io/badge/Blockchain-Sui-blue?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge)
![Move](https://img.shields.io/badge/Smart%20Contract-Move-ff6b35?style=for-the-badge)

> *Never lose access to your crypto again.* SoulCraft uses trusted friends and family as guardians to help you recover your wallet when you need it most.

## 🚀 Live Demo

*Demo URL:* [https://c6078815f1994527a13d19f4f89b2579-fa8e0c563da9401cac550ddde.fly.dev/](https://c6078815f1994527a13d19f4f89b2579-fa8e0c563da9401cac550ddde.fly.dev/)

### 🎯 Quick Demo Instructions
1. Click *"Connect as Owner"* to simulate wallet ownership
2. Navigate to *"Add Guardians"* to add trusted friends/family
3. Go to *"Test Recovery"* to initiate a recovery process
4. Disconnect and *"Connect as Guardian"* to approve recovery
5. Watch the complete social recovery workflow in action!

## 📖 What is SoulCraft?

SoulCraft is a *decentralized social recovery wallet* built on the Sui blockchain. It solves the critical problem of wallet recovery by allowing users to designate trusted friends and family members as "guardians" who can help recover access to the wallet if the original owner loses their private keys.

### 🔑 Key Features

- *🛡 Social Recovery*: Add trusted guardians who can help recover your wallet
- *🔒 Secure by Design*: Built with Move smart contracts on Sui blockchain
- *👥 Guardian Management*: Easy interface to add/remove trusted guardians
- *🔄 Recovery Workflow*: Streamlined process for wallet recovery with guardian approval
- *💎 Modern UI*: Beautiful, responsive interface with SoulCraft branding
- *🎭 Demo Mode*: Perfect for presentations and testing without real wallets

## 🏗 Architecture

### Smart Contract (Move)

contracts/SoulCraftWallet.move
├── SoulCraftWallet struct
├── Guardian management functions
├── Recovery initiation & approval
└── Ownership transfer logic


### Frontend (React + TypeScript)

client/
├── pages/           # Route components
│   ├── Index.tsx    # Dashboard & landing
│   ├── Guardians.tsx # Guardian management
│   └── Recovery.tsx  # Recovery workflow
├── components/      # Reusable components
│   ├── wallet/      # Wallet connection
│   ├── guardians/   # Guardian UI
│   └── recovery/    # Recovery UI
└── lib/            # Utilities & providers


## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| *Blockchain* | Sui Network | High-performance blockchain for smart contracts |
| *Smart Contract* | Move Language | Safe, resource-oriented programming |
| *Frontend* | React 18 + TypeScript | Modern UI with type safety |
| *Styling* | TailwindCSS 3 | Utility-first CSS framework |
| *UI Components* | Radix UI | Accessible, customizable components |
| *Wallet Integration* | @suiet/wallet-kit | Sui wallet connectivity |
| *Build Tool* | Vite | Fast development and builds |
| *Package Manager* | pnpm | Efficient dependency management |

## 🏁 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- A Sui wallet (for real transactions)

### Installation

1. *Clone the repository*
bash
git clone <repository-url>
cd soulcraft-wallet


2. *Install dependencies*
bash
pnpm install
# or
npm install


3. *Start development server*
bash
pnpm dev
# or
npm run dev


4. *Open in browser*

http://localhost:8080


### Production Build

bash
pnpm build
pnpm start


## 🎮 How to Use

### For Wallet Owners

1. *Connect Wallet*
   - Use "Connect Real Wallet" for actual Sui wallets
   - Use "Connect as Owner" for demo mode

2. *Add Guardians*
   - Navigate to the Guardians page
   - Add trusted friends/family with their Sui addresses
   - Guardians will receive active status once confirmed

3. *Manage Recovery*
   - Set recovery thresholds (demo uses 1 guardian approval)
   - Monitor guardian status and approvals

### For Guardians

1. *Connect as Guardian*
   - Use demo mode or connect your real wallet
   - You'll see pending recovery requests

2. *Approve Recovery*
   - Review recovery requests carefully
   - Approve legitimate recovery attempts
   - Help friends/family regain wallet access

### Demo Mode Features

- *Two Demo Addresses*: Owner and Guardian roles
- *Transaction Simulation*: All buttons show "Transaction Successful!"
- *Permission System*: Role-based access (owners vs guardians)
- *Visual Feedback*: Toast notifications and status updates

## 📜 Smart Contract Details

### Core Functions

move
// Create new SoulCraft wallet
public fun init_wallet(ctx: &mut TxContext): SoulCraftWallet

// Add a trusted guardian
public fun add_guardian(wallet: &mut SoulCraftWallet, guardian_address: address, ctx: &TxContext)

// Initiate recovery process
public fun initiate_recovery(wallet: &mut SoulCraftWallet, new_owner_address: address, ctx: &TxContext)

// Guardian approves recovery
public fun approve_recovery(wallet: &mut SoulCraftWallet, ctx: &TxContext)

// Finalize recovery and transfer ownership
public fun finalize_recovery(wallet: &mut SoulCraftWallet, ctx: &TxContext)


### Security Features

- *Owner Verification*: Only wallet owner can add/remove guardians
- *Guardian Authentication*: Only registered guardians can approve recovery
- *Threshold System*: Configurable number of approvals required
- *Event Logging*: All actions emit blockchain events for transparency

## 🚀 Deployment

### Smart Contract Deployment

1. *Setup Sui CLI*
bash
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443
sui client switch --env devnet


2. *Deploy Contract*
bash
sui client publish --gas-budget 20000000 contracts/


3. *Update Frontend Config*
- Add deployed contract address to frontend configuration
- Update network settings as needed

### Frontend Deployment

The app is production-ready and can be deployed to:
- *Vercel*: vercel deploy
- *Netlify*: netlify deploy
- *Railway*: railway deploy
- *Any static hosting*: Build with pnpm build

## 🎨 Customization

### Branding Colors
css
/* In client/global.css */
--soul-purple: 258 90% 66%;    /* Primary brand color */
--soul-gold: 45 96% 68%;       /* Accent color */
--guardian-green: 142 76% 56%; /* Guardian theme */
--recovery-orange: 25 95% 65%; /* Recovery theme */


### UI Components
All components use the design system in client/components/ui/ and can be customized via:
- TailwindCSS classes
- CSS custom properties
- Component prop overrides

## 🧪 Testing

### Run Tests
bash
pnpm test


### Test Coverage
- Component unit tests
- Integration tests for wallet flows
- Smart contract tests (Move unit tests)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- *Sui Foundation* for the incredible blockchain platform
- *Suiet Team* for the excellent wallet kit
- *Radix UI* for accessible component primitives
- *Vercel* for Next.js and deployment platform
- *Tailwind Labs* for the amazing CSS framework

## 📞 Support & Contact

- *Issues*: [GitHub Issues](https://github.com/your-repo/issues)
- *Discussions*: [GitHub Discussions](https://github.com/your-repo/discussions)
- *Twitter*: [@SoulCraftWallet](https://twitter.com/soulcraftwallet)

---

<div align="center">

*🌟 Star this repo if SoulCraft helped you! 🌟*

Made with ❤ for the Sui ecosystem

</div>
