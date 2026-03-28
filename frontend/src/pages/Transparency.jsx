// Transparency — public page showing all on-chain donations, no auth required
import { useEffect, useState } from 'react'
import { colors, font, radius, spacing } from '../styles/tokens'
import Navbar from '../components/Navbar'
import { causes } from '../data/causes.js'
import { orgs } from '../data/orgs.js'

export default function Transparency() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/transparency')
            .then(res => res.json())
            .then(data => {
                if (data.transactions) {
                    setTransactions(data.transactions)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch transactions:', err)
                setLoading(false)
            })
    }, [])

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.timestamp)
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
    })

    const totalDonated = monthlyTransactions.reduce((sum, t) => sum + t.amountXRP, 0)

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

        {loading ? (
            <p style={{ textAlign: 'center', color: colors.inkLight }}>Loading transactions...</p>
        ) : transactions.length === 0 ? (
            <p style={{ textAlign: 'center', color: colors.inkLight }}>No transactions yet. Be the first to donate!</p>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {transactions.map((tx, idx) => {
                const org = orgs.find(o => o.mongoId === tx.organizationID)
                const cause = causes.find(c => c.id === org?.causeId)
                const displayName = tx.organizationName || org?.name || 'Unknown Organization'
                const displayDate = tx.timestamp ? new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'

                return (
                    <div key={tx.hash || idx} style={{
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
                        {cause && <img src={cause.icon} alt={cause.name} style={{ width: '12px', height: '12px', objectFit: 'contain' }} />} {cause?.name || 'Donation'}
                        </div>
                        <p style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.inkDark, marginBottom: '2px' }}>
                        {displayName}
                        </p>
                        <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>
                        {displayDate}
                        </p>
                    </div>

                    {/* Middle — tx hash */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.confirmed, flexShrink: 0 }} />
                        <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontFamily: 'monospace' }}>
                        {tx.hash?.substring(0, 16) || 'N/A'}...
                        </p>
                    </div>

                    {/* Right — amount */}
                    <p style={{
                        fontSize: font.size.md,
                        fontWeight: font.weight.medium,
                        color: colors.red,
                        flexShrink: 0,
                    }}>
                        ${tx.amountXRP?.toFixed(2) || '0.00'}
                    </p>

                    </div>
                )
            })}
            </div>
        )}
        </div>
    </div>
  )
}