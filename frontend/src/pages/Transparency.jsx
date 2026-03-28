// Transparency — public page showing all on-chain donations, no auth required
import { colors, font, radius, spacing } from '../styles/tokens'
import Navbar from '../components/Navbar'
import { causes } from '../data/causes.js'
import { orgs } from '../data/orgs.js'

const MOCK_TRANSACTIONS = [
  { id: 1, orgId: 1, amount: 20, date: 'Mar 27, 2026', txHash: 'A1B2C3D4E5F6G7H8' },
  { id: 2, orgId: 4, amount: 10, date: 'Mar 26, 2026', txHash: 'B2C3D4E5F6G7H8I9' },
  { id: 3, orgId: 7, amount: 50, date: 'Mar 25, 2026', txHash: 'C3D4E5F6G7H8I9J0' },
  { id: 4, orgId: 2, amount: 25, date: 'Mar 25, 2026', txHash: 'D4E5F6G7H8I9J0K1' },
  { id: 5, orgId: 5, amount: 15, date: 'Mar 24, 2026', txHash: 'E5F6G7H8I9J0K1L2' },
]

export default function Transparency() {
    // Filter transactions to current month only
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const txDate = new Date(tx.date)
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
    })

    const totalDonated = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div style={{ fontFamily: font.family, background: colors.bg, minHeight: '100vh' }}>

        {/* Navbar */}
        <Navbar />

        {/* Hero */}
        <div style={{
        borderBottom: `0.5px solid ${colors.redMid}`,
        padding: `${spacing.xxl} ${spacing.xl}`,
        textAlign: 'center',
        }}>
        <p style={{
            fontSize: font.size.xs,
            fontWeight: font.weight.medium,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: colors.red,
            marginBottom: spacing.md,
        }}>
            Public ledger
        </p>
        <h1 style={{
            fontSize: font.size.hero,
            fontWeight: font.weight.medium,
            color: colors.inkDark,
            lineHeight: '1.2',
            marginBottom: spacing.sm,
        }}>
            Every dollar, accounted for.
        </h1>
        <p style={{
            fontSize: font.size.base,
            fontWeight: font.weight.light,
            color: colors.inkLight,
            lineHeight: '1.65',
            marginBottom: spacing.xl,
        }}>
            Every donation on charis is recorded on the XRP Ledger. No black boxes.
        </p>

        {/* Total donated */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.confirmed }} />
            <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light }}>Live — updating in real time</p>
        </div>
        <p style={{
            fontSize: font.size.counter,
            fontWeight: font.weight.medium,
            color: colors.inkDark,
            lineHeight: '1',
        }}>
            ${totalDonated.toLocaleString()}
        </p>
        <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light }}>
            donated through charis this month
        </p>
        </div>

        {/* Transaction feed */}
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: spacing.xl }}>
        <p style={{
            fontSize: font.size.xs,
            fontWeight: font.weight.medium,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: colors.red,
            marginBottom: spacing.lg,
        }}>
            All transactions
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {MOCK_TRANSACTIONS.map(tx => {
            const org = orgs.find(o => o.id === tx.orgId)
            const cause = causes.find(c => c.id === org?.causeId)

            return (
                <div key={tx.id} style={{
                background: colors.white,
                border: `0.5px solid ${colors.redMid}`,
                borderRadius: radius.lg,
                padding: spacing.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.lg,
                }}>

                {/* Left — org info */}
                <div style={{ flex: 1 }}>
                    <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: colors.redLight,
                    color: colors.red,
                    fontSize: font.size.xs,
                    fontWeight: font.weight.medium,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    marginBottom: spacing.sm,
                    }}>
                    <img src={cause?.icon} alt={cause?.name} style={{ width: '12px', height: '12px', objectFit: 'contain' }} /> {cause?.name}
                    </div>
                    <p style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.inkDark, marginBottom: '2px' }}>
                    {org?.name}
                    </p>
                    <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>
                    {tx.date}
                    </p>
                </div>

                {/* Middle — tx hash */}
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.confirmed, flexShrink: 0 }} />
                    <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontFamily: 'monospace' }}>
                    {tx.txHash}
                    </p>
                </div>

                {/* Right — amount */}
                <p style={{
                    fontSize: font.size.md,
                    fontWeight: font.weight.medium,
                    color: colors.red,
                    flexShrink: 0,
                }}>
                    ${tx.amount}
                </p>

                </div>
            )
            })}
        </div>
        </div>
    </div>
  )
}