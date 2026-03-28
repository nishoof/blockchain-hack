// Wallet — top up balance, view transaction history
import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { colors, font, radius, spacing } from '../styles/tokens'

const XRP_RATE = 1.5

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'topup',    method: 'Visa •••• 4242',        amount: 50,  date: 'Mar 27, 2026', status: 'confirmed' },
  { id: 2, type: 'donation', method: 'SF General Hospital',   amount: -20, date: 'Mar 27, 2026', status: 'confirmed' },
  { id: 3, type: 'topup',    method: 'Coinbase Wallet',        amount: 30,  date: 'Mar 26, 2026', status: 'confirmed' },
  { id: 4, type: 'donation', method: 'City Harvest',           amount: -10, date: 'Mar 26, 2026', status: 'confirmed' },
  { id: 5, type: 'topup',    method: 'Bank transfer',          amount: 100, date: 'Mar 25, 2026', status: 'confirmed' },
  { id: 6, type: 'donation', method: 'Khan Academy',           amount: -50, date: 'Mar 25, 2026', status: 'confirmed' },
]

const PRESET_AMOUNTS = [10, 25, 50, 100]

export default function Wallet() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [balance, setBalance] = useState(null)
  const [activeMethod, setActiveMethod] = useState('card')
  const [amount, setAmount] = useState(null)
  const [custom, setCustom] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    getToken({ template: 'charis' }).then(token => {
      fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => setBalance(parseFloat(data.balanceXRP) * XRP_RATE))
    })
  }, [getToken])

  const xrpBalance = balance != null ? (balance / XRP_RATE).toFixed(2) : '...'
  const finalAmount = amount ?? (custom ? parseFloat(custom) : null)

  const methods = [
    { id: 'card',   label: 'Credit / debit card' },
    { id: 'crypto', label: 'Connect crypto wallet' },
    { id: 'bank',   label: 'Bank transfer' },
  ]

  const tag = (type) => ({
    background: type === 'topup' ? '#e6f4ec' : colors.redLight,
    color:      type === 'topup' ? '#2e7d52' : colors.red,
  })

  return (
    <div style={{ fontFamily: font.family, background: colors.bg, minHeight: '100vh' }}>

      <Navbar />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: spacing.xl,
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: spacing.xl,
        alignItems: 'start',
      }}>

        {/* Left — balance + top up */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>

          {/* Balance card */}
          <div style={{
            background: colors.white,
            border: `0.5px solid ${colors.redMid}`,
            borderRadius: radius.lg,
            padding: spacing.lg,
          }}>
            <p style={{ fontSize: font.size.xs, fontWeight: font.weight.medium, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.red, marginBottom: spacing.sm }}>
              Your balance
            </p>
            <p style={{ fontSize: font.size.counter, fontWeight: font.weight.medium, color: colors.inkDark, lineHeight: '1', marginBottom: '4px' }}>
              ${balance != null ? balance.toFixed(2) : '...'}
            </p>
            <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light }}>
              {xrpBalance} XRP
            </p>
          </div>

          {/* Top up card */}
          <div style={{
            background: colors.white,
            border: `0.5px solid ${colors.redMid}`,
            borderRadius: radius.lg,
            padding: spacing.lg,
          }}>
            <p style={{ fontSize: font.size.xs, fontWeight: font.weight.medium, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.red, marginBottom: spacing.lg }}>
              Top up
            </p>

            {/* Method selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: spacing.lg }}>
              {methods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMethod(m.id)}
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: radius.md,
                    border: `0.5px solid ${activeMethod === m.id ? colors.red : colors.redMid}`,
                    background: activeMethod === m.id ? colors.redLight : 'transparent',
                    color: activeMethod === m.id ? colors.red : colors.inkLight,
                    fontSize: font.size.sm,
                    fontWeight: font.weight.medium,
                    fontFamily: font.family,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Amount presets */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.md }}>
              {PRESET_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  onClick={() => { setAmount(amt); setCustom('') }}
                  style={{
                    padding: spacing.md,
                    borderRadius: radius.md,
                    border: `0.5px solid ${amount === amt ? colors.red : colors.redMid}`,
                    background: amount === amt ? colors.red : 'transparent',
                    color: amount === amt ? colors.bg : colors.inkDark,
                    fontSize: font.size.md,
                    fontWeight: font.weight.medium,
                    fontFamily: font.family,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <input
              type="number"
              placeholder="Custom amount"
              value={custom}
              onChange={e => { setCustom(e.target.value); setAmount(null) }}
              style={{
                width: '100%',
                padding: spacing.md,
                borderRadius: radius.md,
                border: `0.5px solid ${custom ? colors.red : colors.redMid}`,
                background: 'transparent',
                fontFamily: font.family,
                fontSize: font.size.base,
                color: colors.inkDark,
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: spacing.lg,
              }}
            />

            {/* Method-specific fields */}
            {activeMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.lg }}>
                <input placeholder="Card number" style={{ padding: spacing.md, borderRadius: radius.md, border: `0.5px solid ${colors.redMid}`, background: 'transparent', fontFamily: font.family, fontSize: font.size.sm, color: colors.inkDark, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                <input placeholder="MM / YY" style={{ padding: spacing.md, borderRadius: radius.md, border: `0.5px solid ${colors.redMid}`, background: 'transparent', fontFamily: font.family, fontSize: font.size.sm, color: colors.inkDark, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                <input placeholder="CVC" style={{ padding: spacing.md, borderRadius: radius.md, border: `0.5px solid ${colors.redMid}`, background: 'transparent', fontFamily: font.family, fontSize: font.size.sm, color: colors.inkDark, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>
            )}
            {activeMethod === 'crypto' && (
              <div style={{ marginBottom: spacing.lg }}>
                <button style={{
                  width: '100%',
                  padding: spacing.md,
                  borderRadius: '999px',
                  border: `0.5px solid ${colors.redMid}`,
                  background: 'transparent',
                  color: colors.inkLight,
                  fontSize: font.size.sm,
                  fontFamily: font.family,
                  cursor: 'pointer',
                }}>
                  Connect wallet →
                </button>
              </div>
            )}
            {activeMethod === 'bank' && (
              <div style={{ marginBottom: spacing.lg, background: colors.redLight, borderRadius: radius.md, padding: spacing.md }}>
                <p style={{ fontSize: font.size.xs, color: colors.red, fontWeight: font.weight.medium, marginBottom: '4px' }}>Bank transfer details</p>
                <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light, lineHeight: '1.6' }}>
                  Routing: 021000021<br />
                  Account: 4832910057<br />
                  Reference: {user?.firstName ?? 'your name'}
                </p>
              </div>
            )}

            {/* Confirm button */}
            {confirmed ? (
              <div style={{ background: '#e6f4ec', borderRadius: '999px', padding: spacing.md, textAlign: 'center', fontSize: font.size.sm, fontWeight: font.weight.medium, color: '#2e7d52' }}>
                ✓ Top up confirmed
              </div>
            ) : (
              <button
                onClick={() => finalAmount && setConfirmed(true)}
                disabled={!finalAmount}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  borderRadius: '999px',
                  border: 'none',
                  background: finalAmount ? colors.red : colors.redLight,
                  color: finalAmount ? colors.bg : colors.redMid,
                  fontSize: font.size.base,
                  fontWeight: font.weight.medium,
                  fontFamily: font.family,
                  cursor: finalAmount ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                {finalAmount ? `Add $${finalAmount} →` : 'Add funds →'}
              </button>
            )}
          </div>
        </div>

        {/* Right — transaction history */}
        <div>
          <p style={{ fontSize: font.size.xs, fontWeight: font.weight.medium, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.red, marginBottom: spacing.lg }}>
            Transaction history
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {MOCK_TRANSACTIONS.map(tx => (
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

                {/* Left */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: font.size.xs,
                    fontWeight: font.weight.medium,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    marginBottom: spacing.sm,
                    ...tag(tx.type),
                  }}>
                    {tx.type === 'topup' ? 'Top up' : 'Donation'}
                  </div>
                  <p style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.inkDark, marginBottom: '2px' }}>
                    {tx.method}
                  </p>
                  <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>
                    {tx.date}
                  </p>
                </div>

                {/* Right — amount */}
                <p style={{
                  fontSize: font.size.md,
                  fontWeight: font.weight.medium,
                  color: tx.amount > 0 ? '#2e7d52' : colors.red,
                  flexShrink: 0,
                }}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
                </p>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}