// Navbar - sits below the announcement bar on every page
import { SignedIn, SignedOut, SignInButton, useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { colors, font, spacing } from '../styles/tokens'

const XRP_RATE = 1.5

export default function Navbar() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [balance, setBalance] = useState(null)

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

  return (
    <nav style={{
      borderBottom: `0.5px solid ${colors.redMid}`,
      padding: `0 ${spacing.xl}`,
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: colors.bg,
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <img src={logo} alt="charis" style={{ height: '24px', width: 'auto' }} />
        <span style={{
          fontSize: '18px',
          fontWeight: font.weight.medium,
          color: colors.red,
          letterSpacing: '-0.02em',
        }}>
          charis
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>

        {/* Always visible */}
        <Link to="/transparency" style={{
          fontSize: font.size.base,
          color: colors.inkLight,
          textDecoration: 'none',
        }}>
          Tracker
        </Link>

        <SignedIn>
          <Link to="/browse" style={{ fontSize: font.size.base, color: colors.inkLight, textDecoration: 'none' }}>
            Donate now
          </Link>

          {/* Balance pill */}
          <Link to="/wallet" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: colors.redLight,
              border: `0.5px solid ${colors.redMid}`,
              borderRadius: '999px',
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: font.size.sm,
              fontWeight: font.weight.medium,
              color: colors.inkDark,
              cursor: 'pointer',
            }}>
              <span>${balance != null ? balance.toFixed(2) : '...'}</span>
              <span style={{ color: colors.redMid }}>·</span>
              <span style={{ color: colors.inkLight }}>{xrpBalance} XRP</span>
            </div>
          </Link>

          {/* Profile avatar */}
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: colors.redLight,
              border: `0.5px solid ${colors.redMid}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: font.size.xs,
              fontWeight: font.weight.medium,
              color: colors.red,
              cursor: 'pointer',
            }}>
              {user?.firstName?.[0] ?? '?'}
            </div>
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button style={{
              background: colors.red,
              color: colors.bg,
              border: 'none',
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: '999px',
              fontSize: font.size.base,
              fontWeight: font.weight.medium,
              fontFamily: font.family,
              cursor: 'pointer',
            }}>
              Sign in
            </button>
          </SignInButton>
        </SignedOut>

      </div>
    </nav>
  )
}