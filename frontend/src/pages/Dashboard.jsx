// Dashboard — personal impact page
import { useAuth, UserProfile, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { causes } from '../data/causes.js'
import { orgs } from '../data/orgs.js'
import { people } from '../data/people.js'
import { colors, font, radius, spacing } from '../styles/tokens'

// Mock donation history — replace with real API call later
const MOCK_DONATIONS = [
    { id: 1, orgId: 1, personId: 1, amount: 20, date: 'Mar 27, 2026', txHash: 'A1B2C3D4E5F6G7H8' },
    { id: 2, orgId: 4, personId: 2, amount: 10, date: 'Mar 26, 2026', txHash: 'B2C3D4E5F6G7H8I9' },
    { id: 3, orgId: 7, personId: 3, amount: 50, date: 'Mar 25, 2026', txHash: 'C3D4E5F6G7H8I9J0' },
]

const XRP_RATE = 1.5

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useUser()
    const { getToken } = useAuth()
    const [showSettings, setShowSettings] = useState(false)

    // Balance fetched from backend
    const [balance, setBalance] = useState(null)

    // Fetch user balance from backend on load
    useEffect(() => {
        getToken({ template: 'charis' }).then(token => {
            fetch('/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(data => setBalance(parseFloat(data.balanceXRP) * XRP_RATE))
        })
    }, [getToken])

    // Derive user info from Clerk
    const name = user?.firstName ?? '...'
    const initials = user?.firstName?.[0] ?? '?'
    const joined = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '...'

    // Calculate stats from donation history
    const totalDonated = MOCK_DONATIONS.reduce((sum, d) => sum + d.amount, 0)
    const peopleHelped = MOCK_DONATIONS.length
    const xrpBalance = balance != null ? (balance / XRP_RATE).toFixed(2) : '...'

    return (
        <div style={{ fontFamily: font.family, background: colors.bg, minHeight: '100vh' }}>

            {/* Navbar */}
            <Navbar />

            {/* Two column layout */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: spacing.xl,
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                gap: spacing.xl,
                alignItems: 'start',
            }}>

                {/* Left — profile card */}
                <div style={{
                background: colors.white,
                border: `0.5px solid ${colors.redMid}`,
                borderRadius: radius.lg,
                padding: spacing.lg,
                textAlign: 'center',
                }}>

                {/* Avatar */}
                <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: colors.redLight,
                    border: `0.5px solid ${colors.redMid}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: font.weight.medium,
                    color: colors.red,
                    margin: '0 auto',
                    marginBottom: spacing.md,
                }}>
                    {initials}
                </div>

                {/* Name */}
                <p style={{
                    fontSize: font.size.md,
                    fontWeight: font.weight.medium,
                    color: colors.inkDark,
                    marginBottom: '4px',
                }}>
                    {name}
                </p>

                {/* Joined */}
                <p style={{
                    fontSize: font.size.sm,
                    fontWeight: font.weight.light,
                    color: colors.inkLight,
                    marginBottom: spacing.xl,
                }}>
                    Member since {joined}
                </p>

                {/* Divider */}
                <div style={{ borderTop: `0.5px solid ${colors.redMid}`, marginBottom: spacing.lg }} />

                {/* Balance */}
                <p style={{
                    fontSize: font.size.xs,
                    fontWeight: font.weight.medium,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: colors.red,
                    marginBottom: spacing.sm,
                }}>
                    Balance
                </p>
                <p style={{
                    fontSize: font.size.hero,
                    fontWeight: font.weight.medium,
                    color: colors.inkDark,
                    lineHeight: '1',
                    marginBottom: '4px',
                }}>
                    ${balance != null ? balance.toFixed(2) : '...'}
                </p>
                <p style={{
                    fontSize: font.size.sm,
                    color: colors.inkLight,
                    fontWeight: font.weight.light,
                    marginBottom: spacing.xl,
                }}>
                    {xrpBalance} XRP
                </p>

                {/* Divider */}
                <div style={{ borderTop: `0.5px solid ${colors.redMid}`, marginBottom: spacing.lg }} />

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, textAlign: 'center' }}>
                    <div>
                    <p style={{ fontSize: '28px', fontWeight: font.weight.medium, color: colors.red, lineHeight: '1', marginBottom: '4px' }}>
                        ${totalDonated}
                    </p>
                    <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>donated</p>
                    </div>
                    <div>
                    <p style={{ fontSize: '28px', fontWeight: font.weight.medium, color: colors.red, lineHeight: '1', marginBottom: '4px' }}>
                        {peopleHelped}
                    </p>
                    <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>people helped</p>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: `0.5px solid ${colors.redMid}`, margin: `${spacing.lg} 0` }} />

                {/* Top up button */}
                <button
                    onClick={() => navigate('/wallet')}
                    style={{
                    width: '100%',
                    padding: spacing.md,
                    borderRadius: '999px',
                    border: `0.5px solid ${colors.redMid}`,
                    background: 'transparent',
                    color: colors.inkLight,
                    fontSize: font.size.sm,
                    fontFamily: font.family,
                    cursor: 'pointer',
                    }}
                >
                    Top up balance →
                </button>

                <button
                    onClick={() => setShowSettings(true)}
                    style={{
                        width: '100%',
                        padding: spacing.md,
                        borderRadius: '999px',
                        border: `0.5px solid ${colors.redMid}`,
                        background: 'transparent',
                        color: colors.inkLight,
                        fontSize: font.size.sm,
                        fontFamily: font.family,
                        cursor: 'pointer',
                        marginTop: spacing.sm,
                    }}
                >
                    Settings →
                </button>

                </div>

                {/* Right — stats + history */}
                <div>

                {/* Section label */}
                <p style={{
                    fontSize: font.size.xs,
                    fontWeight: font.weight.medium,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: colors.red,
                    marginBottom: spacing.lg,
                }}>
                    Donation history
                </p>

                {/* Donation cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {MOCK_DONATIONS.map(donation => {
                    const org = orgs.find(o => o.id === donation.orgId)
                    const cause = causes.find(c => c.id === org?.causeId)
                    const person = people.find(p => p.id === donation.personId)

                    return (
                        <div key={donation.id} style={{
                        background: colors.white,
                        border: `0.5px solid ${colors.redMid}`,
                        borderRadius: radius.lg,
                        padding: spacing.lg,
                        }}>

                        {/* Top row — org + amount */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
                            <div>
                            {/* Cause tag */}
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
                            <p style={{ fontSize: font.size.md, fontWeight: font.weight.medium, color: colors.inkDark }}>
                                {org?.name}
                            </p>
                            <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light, marginTop: '2px' }}>
                                {donation.date}
                            </p>
                            </div>
                            <p style={{ fontSize: font.size.md, fontWeight: font.weight.medium, color: colors.red }}>
                            ${donation.amount}
                            </p>
                        </div>

                        {/* Person helped */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.md,
                            background: colors.redLight,
                            borderRadius: radius.md,
                            padding: spacing.md,
                            marginBottom: spacing.md,
                        }}>
                            <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: colors.bg,
                            border: `0.5px solid ${colors.redMid}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: font.size.xs,
                            fontWeight: font.weight.medium,
                            color: colors.red,
                            flexShrink: 0,
                            }}>
                            {person?.name.split(' ').map(w => w[0]).join('')}
                            </div>
                            <div>
                            <p style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: colors.inkDark }}>
                                {person?.name}, {person?.age}
                            </p>
                            <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>
                                {person?.outcome}
                            </p>
                            </div>
                        </div>

                        {/* Transaction hash */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.confirmed, flexShrink: 0 }} />
                            <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light, fontFamily: 'monospace' }}>
                            {donation.txHash}
                            </p>
                        </div>

                        </div>
                    )
                    })}
                </div>
                </div>
            </div>

            {showSettings && (
            <div
                onClick={() => setShowSettings(false)}
                style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                }}
            >
                <div onClick={e => e.stopPropagation()}>
                <UserProfile />
                </div>
            </div>
            )}
        </div>
    )
}