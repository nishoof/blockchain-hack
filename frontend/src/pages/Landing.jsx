// Landing page - visible to everyone, no auth required

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { colors, font, radius, spacing } from '../styles/tokens'
import Navbar from '../components/Navbar'
import { causes } from '../data/causes.js'
import { orgs } from '../data/orgs.js'
import { people } from '../data/people.js'
import logo from '../assets/logo.png'
import xrpLogo from '../assets/xrp-drawn.png'
import clerkLogo from '../assets/clerk-drawn.png'
import vercelLogo from '../assets/vercel-drawn.png'
import valarieImg from '../assets/valarie.png'
import nishImg from '../assets/nish.png'
import julianImg from '../assets/julian.png'

export default function Landing() {
  // Active tab state - defaults to causes
  const [activeTab, setActiveTab] = useState('Causes')

  return (
    <div style={{ fontFamily: font.family, background: colors.bg, minHeight: '100vh' }}>

        {/* Announcement bar - scrolls to tabs on click */}
        <div
            onClick={() => document.getElementById('tabs').scrollIntoView({ behavior: 'smooth' })}
            style={{
            background: colors.red,
            color: colors.bg,
            textAlign: 'center',
            padding: `${spacing.sm} ${spacing.lg}`,
            fontSize: font.size.base,
            cursor: 'pointer',
            letterSpacing: '0.01em',
            }}
        >
            Learn how your donation can help your community, your city, or the world →
        </div>
        
        {/* Navbar */}
        <Navbar />

        {/* Hero section */}
        <div style={{
            textAlign: 'center',
            padding: `${spacing.xxl} ${spacing.xl}`,
            maxWidth: '640px',
            margin: '0 auto',
            }}>

            {/* Eyebrow */}
            <p style={{
                fontSize: font.size.xs,
                fontWeight: font.weight.medium,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: colors.red,
                marginBottom: spacing.md,
            }}>
                Built on XRP Ledger
            </p>

            {/* Headline */}
            <h1 style={{
                fontSize: font.size.hero,
                fontWeight: font.weight.medium,
                color: colors.inkDark,
                lineHeight: '1.15',
                marginBottom: spacing.md,
            }}>
                Every donation has a name.
            </h1>

            {/* Subheadline */}
            <p style={{
                fontSize: font.size.base,
                fontWeight: font.weight.light,
                color: colors.inkMid,
                lineHeight: '1.65',
                marginBottom: spacing.xl,
                maxWidth: '420px',
                margin: `0 auto ${spacing.xl}`,
            }}>
                See where the money goes, see the impact you make.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
                <SignedIn>
                <Link to="/browse" style={{ textDecoration: 'none' }}>
                    <button style={{
                    background: colors.red,
                    color: colors.bg,
                    border: 'none',
                    padding: `${spacing.sm} ${spacing.xl}`,
                    borderRadius: '999px',
                    fontSize: font.size.base,
                    fontWeight: font.weight.medium,
                    fontFamily: font.family,
                    cursor: 'pointer',
                    }}>
                    Start giving
                    </button>
                </Link>
                </SignedIn>
                <SignedOut>
                <SignInButton mode="modal">
                    <button style={{
                    background: colors.red,
                    color: colors.bg,
                    border: 'none',
                    padding: `${spacing.sm} ${spacing.xl}`,
                    borderRadius: '999px',
                    fontSize: font.size.base,
                    fontWeight: font.weight.medium,
                    fontFamily: font.family,
                    cursor: 'pointer',
                    }}>
                    Start giving
                    </button>
                </SignInButton>
                </SignedOut>

                <Link to="/transparency" style={{ textDecoration: 'none' }}>
                <button style={{
                    background: 'transparent',
                    border: `0.5px solid ${colors.redMid}`,
                    color: colors.inkMid,
                    padding: `${spacing.sm} ${spacing.xl}`,
                    borderRadius: '999px',
                    fontSize: font.size.base,
                    fontFamily: font.family,
                    cursor: 'pointer',
                }}>
                    See live transactions
                </button>
                </Link>
            </div>
        </div>
        
        {/* Tabbed section */}
        <div id="tabs" style={{
            borderTop: `0.5px solid ${colors.redMid}`,
            padding: `${spacing.xl} ${spacing.xl} 0`,
            }}>

            {/* Tab bar with arrows */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.md,
                marginBottom: spacing.xl,
            }}>

            {/* Left arrow */}
            <button
            onClick={() => {
                const tabs = ['Causes', 'Impact', 'How it works', 'Our impact']
                const current = tabs.indexOf(activeTab)
                setActiveTab(tabs[(current - 1 + tabs.length) % tabs.length])
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = colors.redLight
                e.currentTarget.style.borderColor = colors.red
                e.currentTarget.style.color = colors.red
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = colors.bg
                e.currentTarget.style.borderColor = colors.redMid
                e.currentTarget.style.color = colors.inkLight
            }}
            style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: `0.5px solid ${colors.redMid}`,
                background: colors.bg,
                color: colors.inkLight,
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: '2px',
                flexShrink: 0,
                transition: 'all 0.15s',
            }}
            >
            ←
            </button>

                {/* Pills */}
                <div style={{
                display: 'flex',
                gap: '6px',
                background: colors.redLight,
                padding: '5px',
                borderRadius: '999px',
                }}>
                {['Causes', 'Impact', 'How it works', 'Our impact'].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: '999px',
                        fontSize: font.size.base,
                        fontWeight: font.weight.medium,
                        fontFamily: font.family,
                        background: activeTab === tab ? colors.red : 'transparent',
                        color: activeTab === tab ? colors.bg : colors.inkLight,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                    }}
                    >
                    {tab}
                    </button>
                ))}
                </div>

                {/* Right arrow */}
                <button
                onClick={() => {
                    const tabs = ['Causes', 'Impact', 'How it works', 'Our impact']
                    const current = tabs.indexOf(activeTab)
                    setActiveTab(tabs[(current + 1) % tabs.length])
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = colors.redLight
                    e.currentTarget.style.borderColor = colors.red
                    e.currentTarget.style.color = colors.red
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = colors.bg
                    e.currentTarget.style.borderColor = colors.redMid
                    e.currentTarget.style.color = colors.inkLight
                }}
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: `0.5px solid ${colors.redMid}`,
                    background: colors.bg,
                    color: colors.inkLight,
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: '2px',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                }}
                >
                →
                </button>
            </div>

            {/* Tab content */}
            <div style={{ textAlign: 'center', paddingBottom: spacing.xl }}>
                {activeTab === 'Causes' && (
                    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
                    {causes.map(cause => (
                        <div key={cause.id} style={{
                            background: colors.white,
                            border: `0.5px solid ${colors.redMid}`,
                            borderRadius: radius.lg,
                            padding: spacing.md,
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.md,
                            cursor: 'pointer',
                        }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            background: colors.redLight,
                            borderRadius: radius.md,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            flexShrink: 0,
                        }}>
                            <img src={cause.icon} alt={cause.name} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.inkDark }}>
                            {cause.name}
                            </p>
                            <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light, marginTop: '2px' }}>
                            {cause.tagline}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>
                    <p style={{ textAlign: 'center', marginTop: spacing.md, fontSize: font.size.sm, color: colors.red, cursor: 'pointer' }}>
                    See all causes →
                    </p>
                    </div>
                )}
                {activeTab === 'Impact' && (
                    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                        <p style={{ fontSize: '52px', fontWeight: font.weight.light, color: colors.redLight, lineHeight: '0.8', marginBottom: spacing.md }}>"</p>
                        <p style={{ fontSize: '24px', fontWeight: font.weight.medium, color: colors.inkDark, lineHeight: '1.3', marginBottom: spacing.md }}>
                        {people[0].quote}
                        </p>
                        <p style={{ fontSize: font.size.sm, color: colors.inkLight, marginBottom: spacing.lg }}>
                        — {people[0].name}, {people[0].age} · {people[0].location} · Helped via {orgs.find(o => o.causeId === people[0].causeId)?.name}
                        </p>
                        <SignedOut>
                        <SignInButton mode="modal">
                            <button style={{
                            background: colors.inkDark,
                            color: colors.bg,
                            border: 'none',
                            padding: `${spacing.sm} ${spacing.xl}`,
                            borderRadius: '999px',
                            fontSize: font.size.base,
                            fontWeight: font.weight.medium,
                            fontFamily: font.family,
                            cursor: 'pointer',
                            }}>
                            Change someone's tomorrow →
                            </button>
                        </SignInButton>
                        </SignedOut>
                        <SignedIn>
                        <Link to="/browse" style={{ textDecoration: 'none' }}>
                            <button style={{
                            background: colors.inkDark,
                            color: colors.bg,
                            border: 'none',
                            padding: `${spacing.sm} ${spacing.xl}`,
                            borderRadius: '999px',
                            fontSize: font.size.base,
                            fontWeight: font.weight.medium,
                            fontFamily: font.family,
                            cursor: 'pointer',
                            }}>
                            Change someone's tomorrow →
                            </button>
                        </Link>
                        </SignedIn>
                    </div>
                )}
                {activeTab === 'How it works' && (
                    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md, alignItems: 'start' }}>
                        {/* Step 1 */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ flex: 1, background: colors.white, border: `0.5px solid ${colors.redMid}`, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md }}>
                                <div style={{ background: colors.redLight, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, display: 'flex', alignItems: 'center', gap: '6px', fontSize: font.size.sm, color: colors.red, fontWeight: font.weight.medium }}>
                                    <img src={causes[0].icon} alt={causes[0].name} style={{ width: '14px', height: '14px', objectFit: 'contain' }} /> {causes[0].name}
                                </div>
                                <div style={{ background: colors.bg, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, display: 'flex', alignItems: 'center', gap: '6px', fontSize: font.size.sm, color: colors.inkLight }}>
                                    <img src={causes[1].icon} alt={causes[1].name} style={{ width: '14px', height: '14px', objectFit: 'contain' }} /> {causes[1].name}
                                </div>
                                <div style={{ background: colors.bg, borderRadius: radius.md, padding: spacing.sm, display: 'flex', alignItems: 'center', gap: '6px', fontSize: font.size.sm, color: colors.inkLight }}>
                                    <img src={causes[2].icon} alt={causes[2].name} style={{ width: '14px', height: '14px', objectFit: 'contain' }} /> {causes[2].name}
                                </div>
                            </div>
                            <div style={{ width: '22px', height: '22px', background: colors.redLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: font.size.xs, fontWeight: font.weight.medium, color: colors.red, marginBottom: spacing.sm }}>1</div>
                            <p style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.inkDark, marginBottom: '4px' }}>Pick a cause</p>
                            <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light, lineHeight: '1.6' }}>Choose what matters to you — then pick a verified nonprofit.</p>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ flex: 1, background: colors.white, border: `0.5px solid ${colors.redMid}`, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: spacing.sm }}>
                                    {['$5', '$10', '$20', '$50'].map(amt => (
                                        <div key={amt} style={{
                                            flex: 1,
                                            padding: '4px',
                                            borderRadius: radius.sm,
                                            background: amt === '$20' ? colors.red : colors.bg,
                                            color: amt === '$20' ? colors.bg : colors.inkMid,
                                            fontSize: font.size.xs,
                                            fontWeight: font.weight.medium,
                                            textAlign: 'center',
                                            border: `0.5px solid ${colors.redMid}`,
                                        }}>{amt}</div>
                                    ))}
                                </div>
                                <div style={{ background: colors.red, color: colors.bg, borderRadius: '999px', padding: '6px', fontSize: font.size.xs, fontWeight: font.weight.medium, textAlign: 'center' }}>
                                    Confirm donation →
                                </div>
                            </div>
                            <div style={{ width: '22px', height: '22px', background: colors.redLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: font.size.xs, fontWeight: font.weight.medium, color: colors.red, marginBottom: spacing.sm }}>2</div>
                            <p style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.inkDark, marginBottom: '4px' }}>Donate in seconds</p>
                            <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light, lineHeight: '1.6' }}>Pay by card. Confirmed on-chain in ~3 seconds.</p>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ flex: 1, background: colors.white, border: `0.5px solid ${colors.redMid}`, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: colors.confirmed, flexShrink: 0 }} />
                                    <p style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: colors.inkDark }}>Donation confirmed</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: colors.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: font.size.xs, fontWeight: font.weight.medium, color: colors.red, flexShrink: 0 }}>
                                        {people[0].name.split(' ').map(w => w[0]).join('')}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: colors.inkDark }}>{people[0].name}, {people[0].age}</p>
                                        <p style={{ fontSize: font.size.xs, color: colors.inkLight }}>{people[0].covered[0]}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '22px', height: '22px', background: colors.redLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: font.size.xs, fontWeight: font.weight.medium, color: colors.red, marginBottom: spacing.sm }}>3</div>
                            <p style={{ fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.inkDark, marginBottom: '4px' }}>See who you helped</p>
                            <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light, lineHeight: '1.6' }}>A real person, verified on the blockchain.</p>
                        </div>
                    </div>
                )}
                {activeTab === 'Our impact' && (
                    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.confirmed }} />
                        <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light }}>Live — updating in real time</p>
                        </div>
                        <p style={{ fontSize: font.size.counter, fontWeight: font.weight.medium, color: colors.inkDark, lineHeight: '1', marginBottom: '4px' }}>
                        $12,450
                        </p>
                        <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light, marginBottom: spacing.xl }}>
                        donated through charis
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
                        {[
                            { num: '2,490', label: 'meals provided' },
                            { num: '415',   label: 'medicine packs' },
                            { num: '83',    label: 'doctor visits' },
                        ].map(({ num, label }) => (
                            <div key={label} style={{ background: colors.white, border: `0.5px solid ${colors.redMid}`, borderRadius: radius.lg, padding: spacing.md, textAlign: 'center' }}>
                            <p style={{ fontSize: '28px', fontWeight: font.weight.medium, color: colors.red, marginBottom: '4px' }}>{num}</p>
                            <p style={{ fontSize: font.size.sm, color: colors.inkLight, fontWeight: font.weight.light }}>{label}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* About section */}
        <div style={{
            borderTop: `0.5px solid ${colors.redMid}`,
            padding: `${spacing.xxl} ${spacing.xl}`,
            maxWidth: '800px',
            margin: '0 auto',
            }}>

            {/* About charis */}
            <p style={{
                fontSize: font.size.xs,
                fontWeight: font.weight.medium,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: colors.red,
                marginBottom: spacing.md,
            }}>
                About charis
            </p>

            <p style={{
                fontSize: font.size.md,
                fontWeight: font.weight.light,
                color: colors.inkDark,
                lineHeight: '1.8',
                marginBottom: spacing.md,
            }}>
                charis is the ancient Greek word for grace, generosity, and gratitude — the root of the word "charity" but with more soul. Valarie spent 30 minutes trying to name this thing. She went through Latin, Japanese, French, Italian, and somehow ended up in ancient Greek. Julian thought it said "cherries." Nish said "this sounds like something Claude came up with." We kept it anyway.
            </p>

            <p style={{
                fontSize: font.size.md,
                fontWeight: font.weight.light,
                color: colors.inkDark,
                lineHeight: '1.8',
                marginBottom: spacing.md,
            }}>
                The product came from a simple frustration that we lowkey didn't think existed. Imagine trying to Zelle your grandma and watched it sit pending for three days in the bank. We'd all donated to GoFundMe campaigns and wondered — did that actually go anywhere? We wanted something faster, something transparent, something you could actually trust.
            </p>

            <p style={{
                fontSize: font.size.md,
                fontWeight: font.weight.light,
                color: colors.inkDark,
                lineHeight: '1.8',
                marginBottom: spacing.xxl,
            }}>
                So we built charis. Every donation has a name. Every dollar is traced to a real person on the blockchain. No black holes. Just proof.
            </p>

            {/* Meet the team */}
            <p style={{
                fontSize: font.size.xs,
                fontWeight: font.weight.medium,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: colors.red,
                marginBottom: spacing.xl,
            }}>
                Meet the team
            </p>

            {/* Team cards — using real headshots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.xl, marginBottom: spacing.xxl }}>
                {[
                { img: valarieImg, name: 'Valarie', quote: '"\'Uhhh let me ask Claude real quick\' was her most used phrase."' },
                { img: nishImg, name: 'Nish', quote: '"Answered 47 design questions. Was not the designer."' },
                { img: julianImg, name: 'Julian', quote: '"The random engineering student that got yonked in the elevator"' },
                ].map(({ img, name, quote }) => (
                <div key={name} style={{ textAlign: 'center' }}>
                    <img
                    src={img}
                    alt={name}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `0.5px solid ${colors.redMid}`,
                        margin: '0 auto',
                        marginBottom: spacing.md,
                        display: 'block',
                    }}
                    />
                    <p style={{
                    fontSize: font.size.md,
                    fontWeight: font.weight.medium,
                    color: colors.inkDark,
                    marginBottom: spacing.sm,
                    }}>
                    {name}
                    </p>
                    <p style={{
                    fontSize: font.size.sm,
                    fontWeight: font.weight.light,
                    color: colors.inkLight,
                    lineHeight: '1.6',
                    fontStyle: 'italic',
                    }}>
                    {quote}
                    </p>
                </div>
                ))}
            </div>

            {/* Spotify */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                fontSize: font.size.sm,
                color: colors.inkLight,
            }}>
                <span>🎵</span>
                <span>fueled by —</span>
                <a
                href="https://open.spotify.com/playlist/5XqZ2d63EIiiU17DOGfouA"
                target="_blank"
                rel="noreferrer"
                style={{
                    color: colors.red,
                    textDecoration: 'none',
                    fontWeight: font.weight.medium,
                }}
                >
                the hackathon playlist
                </a>
            </div>
        </div>

        {/* Trust bar */}
        <div style={{
            borderTop: `0.5px solid ${colors.redMid}`,
            padding: `${spacing.md} ${spacing.xl}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xl,
            marginTop: spacing.xl,
            }}>
            {[
                { img: logo,      name: 'charis' },
                { img: xrpLogo,   name: 'XRP Ledger' },
                { img: clerkLogo, name: 'Clerk' },
                { img: vercelLogo,name: 'Vercel' },
                { emoji: '🌿',    name: 'Carbon neutral' },
            ].map(({ img, emoji, name }) => (
                <div key={name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                fontSize: font.size.sm,
                color: colors.inkLight,
                }}>
                {img
                    ? <img src={img} alt={name} style={{ height: '20px', width: 'auto' }} />
                    : <span>{emoji}</span>
                }
                {name}
                </div>
            ))}
        </div>
    </div>
  )
}