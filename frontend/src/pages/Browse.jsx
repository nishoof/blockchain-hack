import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, font, radius, spacing } from '../styles/tokens'
import Navbar from '../components/Navbar'
import { causes } from '../data/causes.js'
import { orgs } from '../data/orgs.js'

export default function Browse() {
    // Active cause filter — 'All' shows every org
    const [activeFilter, setActiveFilter] = useState(null)
    const navigate = useNavigate()

    // Build filter list: All + one pill per cause
    const [search, setSearch] = useState('')

    {/* Filter orgs by active cause and search query */}
    const filteredOrgs = orgs.filter(org => {
        const matchesCause = activeFilter === null || org.causeId === activeFilter
        const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase())
        return matchesCause && matchesSearch
    })

    return (
        <div style={{ fontFamily: font.family, background: colors.bg, minHeight: '100vh' }}>

        {/* Navbar */}
        <Navbar />
    
        {/* Search bar */}
        <div style={{
            padding: `${spacing.lg} ${spacing.xl} 0`,
            }}>
            <input
                placeholder="Search organizations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                width: '100%',
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: '999px',
                border: `0.5px solid ${colors.redMid}`,
                background: colors.white,
                fontFamily: font.family,
                fontSize: font.size.base,
                color: colors.inkDark,
                outline: 'none',
                boxSizing: 'border-box',
                }}
            />
        </div>

       {/* Cause filter pills */}
        <div style={{
            display: 'flex',
            gap: '8px',
            padding: `${spacing.md} ${spacing.xl}`,
            borderBottom: `0.5px solid ${colors.redMid}`,
        }}>
            <button
                onClick={() => setActiveFilter(null)}
                style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: '999px',
                    fontSize: font.size.sm,
                    fontWeight: font.weight.medium,
                    fontFamily: font.family,
                    border: `0.5px solid ${activeFilter === null ? colors.red : colors.redMid}`,
                    background: activeFilter === null ? colors.red : 'transparent',
                    color: activeFilter === null ? colors.bg : colors.inkLight,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                }}
            >
                All
            </button>
            {causes.map(c => (
                <button
                    key={c.id}
                    onClick={() => setActiveFilter(c.id)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: '999px',
                        fontSize: font.size.sm,
                        fontWeight: font.weight.medium,
                        fontFamily: font.family,
                        border: `0.5px solid ${activeFilter === c.id ? colors.red : colors.redMid}`,
                        background: activeFilter === c.id ? colors.red : 'transparent',
                        color: activeFilter === c.id ? colors.bg : colors.inkLight,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                >
                    <img src={c.icon} alt={c.name} style={{ width: '14px', height: '14px', objectFit: 'contain', filter: activeFilter === c.id ? 'brightness(0) invert(1)' : 'none' }} />
                    {c.name}
                </button>
            ))}
        </div>

        {/* Org grid */}
        <div style={{
            columns: '3 300px',
            gap: spacing.md,
            padding: spacing.xl,
            }}>
            {filteredOrgs.map(org => {
                const cause = causes.find(c => c.id === org.causeId)
                const progress = Math.round((org.raised / org.goal) * 100)

                return (
                <div
                    key={org.id}
                    onClick={() => navigate(`/donate/${org.id}`)}
                    style={{
                    breakInside: 'avoid',
                    marginBottom: spacing.md,
                    background: colors.white,
                    border: `0.5px solid ${colors.redMid}`,
                    borderRadius: radius.lg,
                    padding: spacing.lg,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = colors.red}
                    onMouseLeave={e => e.currentTarget.style.borderColor = colors.redMid}
                >
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
                    <p style={{
                    fontSize: font.size.md,
                    fontWeight: font.weight.medium,
                    color: colors.inkDark,
                    marginBottom: spacing.sm,
                    }}>
                    {org.name}
                    </p>

                    {/* Description */}
                    <p style={{
                    fontSize: font.size.sm,
                    fontWeight: font.weight.light,
                    color: colors.inkLight,
                    lineHeight: '1.6',
                    marginBottom: spacing.md,
                    }}>
                    {org.description}
                    </p>

                    {/* Stat */}
                    <p style={{
                    fontSize: font.size.sm,
                    fontWeight: font.weight.medium,
                    color: colors.red,
                    marginBottom: spacing.md,
                    }}>
                    {org.stat}
                    </p>

                    {/* Progress bar */}
                    <div style={{
                    background: colors.redLight,
                    borderRadius: '999px',
                    height: '4px',
                    marginBottom: '6px',
                    }}>
                    <div style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: '100%',
                        background: colors.red,
                        borderRadius: '999px',
                    }} />
                    </div>

                    {/* Raised / goal */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>${org.raised.toLocaleString()} raised</p>
                    <p style={{ fontSize: font.size.xs, color: colors.inkLight, fontWeight: font.weight.light }}>${org.goal.toLocaleString()} goal</p>
                    </div>

                </div>
                )
            })}
        </div>

    </div>
  )
}