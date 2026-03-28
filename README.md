# charis 

**Transparent nonprofit donations, powered by XRPL.**

charis is a donation platform where every dollar is tracked on-chain. Donors can see exactly how their money is used, nonprofits get instant settlement with no middlemen, and anyone can verify the money trail in real time — no login required.

Built at a hackathon for the good of the community.

---

## 🖼️ Demo

**Live demo:** https://blockchain-hack.vercel.app

---

## ✨ Features

- **Browse nonprofits** by cause category (medical, education, hunger relief, and more)
- **Donate in XRP** — transactions settle in ~3-4 seconds with near-zero fees
- **Donor dashboard** — track your donations and see when funds are disbursed
- **Public transparency page** — anyone can audit total donated, total disbursed, and recipient count
- **Cause filtering** — filter organizations by cause with visual category icons

---

## 🔄 How It Works

### Donor Flow
1. Browse the app and pick a nonprofit and campaign (e.g. *"Feed 50 families this month"*)
2. Donate XRP — the transaction is recorded on XRPL instantly
3. Track your donation in your personal dashboard, including when and how funds are disbursed

### Beneficiary Flow
1. A nonprofit registers beneficiaries with just a wallet address
2. When a campaign milestone is funded, XRP is released directly to beneficiaries
3. Beneficiaries cash out via existing XRP off-ramps

### Transparency Page
- Publicly accessible — no login needed
- Shows total donated, total disbursed, and number of recipients
- Every disbursement links to a live XRPL transaction explorer entry

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (JSX) |
| Backend | Go |
| Blockchain | XRPL (XRP Ledger) |
| Wallet integration | xrpl.js |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Go 1.21+
- An XRPL testnet wallet (get one at [xrpl.org/xrp-testnet-faucet.html](https://xrpl.org/xrp-testnet-faucet.html))

### Frontend
```bash
# Clone the repo
git clone https://github.com/your-org/charis.git
cd charis

# Install dependencies
npm install

# Start the dev server
npm run dev
` ``

### Backend

` ``bash
cd backend

# Install Go dependencies
go mod tidy

# Run the server
go run main.go
` ``

> The backend defaults to port `8080`. Update the frontend API base URL in `src/config.js` if needed.

---

## 👥 Team

| Name | Role |
|---|---|
| Julian | Design |
| Valarie | Frontend |
| Nish | Backend (Go) + XRPL |

---

## 📄 License

MIT
```
