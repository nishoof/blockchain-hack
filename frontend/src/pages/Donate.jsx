// Donate page — user picks an amount and donates to a specific org
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { colors, font, radius, spacing } from '../styles/tokens'
import Navbar from '../components/Navbar'
import { causes } from '../data/causes.js'
import { orgs } from '../data/orgs.js'
import { people } from '../data/people.js'

export default function Donate() {
    const { orgId } = useParams()
    const navigate = useNavigate()

    // Find the org, its cause, and the person linked to that cause
    const org = orgs.find(o => o.id === parseInt(orgId))
    const cause = causes.find(c => c.id === org?.causeId)
    const person = people.find(p => p.causeId === org?.causeId)

    // Donation
    const [amount, setAmount] = useState(null)
    const [custom, setCustom] = useState('')
    const [revealed, setRevealed] = useState(false)

    // Redirect to browse if org not found
    if (!org) return navigate('/browse')

    return (
        <div style={{ fontFamily: font.family, background: colors.bg, minHeight: '100vh' }}>

            {/* Navbar */}
            <Navbar />

            {/* Reveal overlay — shows after donation confirmed */}
            {revealed && (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(255,255,255,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: spacing.xl,
            }}>
                <div style={{
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                }}>

                {/* Close button */}
                <button
                onClick={() => setRevealed(false)}
                style={{
                    position: 'absolute',
                    top: spacing.lg,
                    right: spacing.lg,
                    background: 'transparent',
                    border: `0.5px solid ${colors.redMid}`,
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: colors.inkLight,
                    cursor: 'pointer',
                }}
                >
                ×
                </button>

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
                    marginBottom: spacing.lg,
                }}>
                    {person?.name.split(' ').map(w => w[0]).join('')}
                </div>

                {/* Eyebrow */}
                <p style={{
                    fontSize: font.size.xs,
                    fontWeight: font.weight.medium,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: colors.red,
                    marginBottom: spacing.sm,
                }}>
                    Your donation helped
                </p>

                {/* Name */}
                <h2 style={{
                    fontSize: font.size.hero,
                    fontWeight: font.weight.medium,
                    color: colors.inkDark,
                    marginBottom: spacing.sm,
                }}>
                    {person?.name}, {person?.age}
                </h2>

                {/* Location */}
                <p style={{
                    fontSize: font.size.sm,
                    color: colors.inkLight,
                    fontWeight: font.weight.light,
                    marginBottom: spacing.lg,
                }}>
                    {person?.location}
                </p>

                {/* Quote */}
                <p style={{
                    fontSize: font.size.md,
                    fontWeight: font.weight.light,
                    color: colors.inkDark,
                    lineHeight: '1.7',
                    fontStyle: 'italic',
                    marginBottom: spacing.lg,
                }}>
                    "{person?.quote}"
                </p>

                {/* Covered tags */}
                <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center', marginBottom: spacing.xl }}>
                    {person?.covered.map(item => (
                    <div key={item} style={{
                        background: colors.redLight,
                        color: colors.red,
                        fontSize: font.size.xs,
                        fontWeight: font.weight.medium,
                        padding: '3px 8px',
                        borderRadius: '999px',
                    }}>
                        {item}
                    </div>
                    ))}
                </div>

                {/* Outcome */}
                <p style={{
                    fontSize: font.size.sm,
                    color: colors.inkLight,
                    fontWeight: font.weight.light,
                    lineHeight: '1.6',
                    marginBottom: spacing.xl,
                }}>
                    {person?.outcome}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
                    <button
                    onClick={() => navigate('/browse')}
                    style={{
                        padding: `${spacing.sm} ${spacing.xl}`,
                        borderRadius: '999px',
                        border: 'none',
                        background: colors.red,
                        color: colors.bg,
                        fontSize: font.size.base,
                        fontWeight: font.weight.medium,
                        fontFamily: font.family,
                        cursor: 'pointer',
                    }}
                    >
                    Donate again
                    </button>
                    <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding: `${spacing.sm} ${spacing.xl}`,
                        borderRadius: '999px',
                        border: `0.5px solid ${colors.redMid}`,
                        background: 'transparent',
                        color: colors.inkLight,
                        fontSize: font.size.base,
                        fontFamily: font.family,
                        cursor: 'pointer',
                    }}
                    >
                    See my impact
                    </button>
                </div>

                </div>
            </div>
            )}

            {/* Main content — two column layout */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: spacing.xl,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.xl,
                }}>

                {/* Left — org details */}
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
                        marginBottom: spacing.md,
                        }}>
                        <img src={cause?.icon} alt={cause?.name} style={{ width: '12px', height: '12px', objectFit: 'contain' }} /> {cause?.name}
                    </div>

                    {/* Org name */}
                    <h1 style={{
                        fontSize: font.size.hero,
                        fontWeight: font.weight.medium,
                        color: colors.inkDark,
                        lineHeight: '1.2',
                        marginBottom: spacing.sm,
                        }}>
                        {org.name}
                    </h1>

                    {/* Description */}
                    <p style={{
                        fontSize: font.size.base,
                        fontWeight: font.weight.light,
                        color: colors.inkLight,
                        lineHeight: '1.7',
                        marginBottom: spacing.lg,
                        }}>
                        {org.description}
                    </p>

                    {/* Stat */}
                    <p style={{
                        fontSize: font.size.md,
                        fontWeight: font.weight.medium,
                        color: colors.red,
                        marginBottom: spacing.lg,
                        }}>
                        {org.stat}
                    </p>

                    {/* Progress bar */}
                    <div style={{ background: colors.redLight, borderRadius: '999px', height: '4px', marginBottom: '6px' }}>
                        <div style={{
                            width: `${Math.min(Math.round((org.raised / org.goal) * 100), 100)}%`,
                            height: '100%',
                            background: colors.red,
                            borderRadius: '999px',
                        }} />
                    </div>

                    {/* Raised / goal */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xl }}>
                        <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>${org.raised.toLocaleString()} raised</p>
                        <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>${org.goal.toLocaleString()} goal</p>
                    </div>

                    {/* Person card */}
                    <div style={{
                        background: colors.white,
                        border: `0.5px solid ${colors.redMid}`,
                        borderRadius: radius.lg,
                        padding: spacing.lg,
                        }}>
                        <p style={{ fontSize: font.size.xs, fontWeight: font.weight.medium, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.red, marginBottom: spacing.md }}>
                            Who you're helping
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: colors.redLight,
                                border: `0.5px solid ${colors.redMid}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: font.size.sm,
                                fontWeight: font.weight.medium,
                                color: colors.red,
                                flexShrink: 0,
                                }}>
                                {person?.name.split(' ').map(w => w[0]).join('')}
                            </div>
                            <div>
                                <p style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.inkDark }}>{person?.name}, {person?.age}</p>
                                <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light }}>{person?.location}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light, lineHeight: '1.6', marginBottom: spacing.md }}>
                            {person?.situation}
                        </p>
                        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                            {person?.covered.map(item => (
                            <div key={item} style={{
                                background: colors.redLight,
                                color: colors.red,
                                fontSize: font.size.xs,
                                fontWeight: font.weight.medium,
                                padding: '3px 8px',
                                borderRadius: '999px',
                            }}>
                                {item}
                            </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — amount selector */}
                <div>
                    <div style={{
                        background: colors.white,
                        border: `0.5px solid ${colors.redMid}`,
                        borderRadius: radius.lg,
                        padding: spacing.lg,
                    }}>

                        <p style={{
                            fontSize: font.size.xs,
                            fontWeight: font.weight.medium,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: colors.red,
                            marginBottom: spacing.lg,
                            }}>
                            Choose an amount
                        </p>

                        {/* Preset amounts */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.md }}>
                            {[5, 10, 20, 50].map(amt => (
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

                        {/* Confirm button */}
                        <button
                            onClick={() => setRevealed(true)}
                            disabled={!amount && !custom}
                            style={{
                                width: '100%',
                                padding: spacing.md,
                                borderRadius: '999px',
                                border: 'none',
                                background: (amount || custom) ? colors.red : colors.redLight,
                                color: (amount || custom) ? colors.bg : colors.redMid,
                                fontSize: font.size.base,
                                fontWeight: font.weight.medium,
                                fontFamily: font.family,
                                cursor: (amount || custom) ? 'pointer' : 'not-allowed',
                                transition: 'all 0.15s',
                            }}
                        >
                        Confirm donation →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}