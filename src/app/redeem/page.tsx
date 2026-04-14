'use client'

import { useState } from 'react'

type BookingResult = {
  id: number
  voucherCode: string
  customerName: string
  notes: string | null
  status: string
  redeemedAt: string | null
  slot: {
    startTime: string
    endTime: string
    discountPercent: number
    salon: { name: string; address: string }
    service: { tier: string; durationMin: number }
  }
}

const TIER_LABEL: Record<string, string> = {
  QUICK:   'Quick appointment (up to 45 min)',
  FULL:    'Full appointment (up to 90 min)',
  PREMIUM: 'Premium appointment (up to 2.5 hrs)',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-AU', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

export default function RedeemPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [booking, setBooking] = useState<BookingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [redeemed, setRedeemed] = useState(false)

  async function lookup() {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    setBooking(null)
    setRedeemed(false)
    try {
      const res = await fetch(`/api/redeem?code=${encodeURIComponent(trimmed)}`)
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Not found'); return }
      setBooking(data)
      if (data.redeemedAt) setRedeemed(true)
    } catch {
      setError('Could not connect. Check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  async function redeem() {
    if (!booking) return
    setRedeeming(true)
    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: booking.voucherCode }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Could not redeem'); return }
      setRedeemed(true)
      setBooking((b) => b ? { ...b, redeemedAt: data.redeemedAt } : b)
    } catch {
      setError('Could not connect.')
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.wordmark}>Whim</span>
          <span style={styles.headerSub}>Salon Voucher Redemption</span>
        </div>

        {/* Code entry */}
        <div style={styles.card}>
          <label style={styles.label}>Enter voucher code</label>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && lookup()}
              placeholder="WHM-XXXXXX"
              maxLength={10}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              style={styles.lookupBtn}
              onClick={lookup}
              disabled={loading || !code.trim()}
            >
              {loading ? '...' : 'Look up'}
            </button>
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        {/* Booking details */}
        {booking && (
          <div style={styles.card}>
            {redeemed && (
              <div style={styles.redeemedBanner}>
                {booking.redeemedAt
                  ? `Already redeemed at ${formatTime(booking.redeemedAt)}`
                  : 'Redeemed'}
              </div>
            )}

            <div style={styles.discountHero}>
              {booking.slot.discountPercent}% off
            </div>
            <div style={styles.customerName}>{booking.customerName}</div>

            <div style={styles.divider} />

            <div style={styles.row}>
              <span style={styles.rowLabel}>Salon</span>
              <span style={styles.rowValue}>{booking.slot.salon.name}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Date</span>
              <span style={styles.rowValue}>{formatDate(booking.slot.startTime)}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Time</span>
              <span style={styles.rowValue}>
                {formatTime(booking.slot.startTime)} – {formatTime(booking.slot.endTime)}
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Appointment</span>
              <span style={styles.rowValue}>
                {TIER_LABEL[booking.slot.service.tier] ?? booking.slot.service.tier}
              </span>
            </div>

            {booking.notes && (
              <div style={styles.notesBox}>
                <span style={styles.notesLabel}>Customer notes</span>
                <span style={styles.notesText}>{booking.notes}</span>
              </div>
            )}

            <div style={styles.divider} />

            <div style={styles.voucherCode}>{booking.voucherCode}</div>

            {!redeemed && (
              <button
                style={styles.redeemBtn}
                onClick={redeem}
                disabled={redeeming}
              >
                {redeeming ? 'Confirming...' : 'Mark as redeemed'}
              </button>
            )}
          </div>
        )}

        <p style={styles.footer}>
          Whim · Salon Portal · For support contact hello@whim.app
        </p>
      </div>
    </div>
  )
}

const pink = '#e8829a'
const charcoal = '#3d2c35'
const muted = '#a08c96'
const border = 'rgba(61,44,53,0.1)'
const mint = '#9dd4c8'

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fdf0f5',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: 480,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
    gap: 4,
  },
  wordmark: {
    fontSize: 40,
    fontWeight: '800',
    color: pink,
    letterSpacing: '-1px',
  },
  headerSub: {
    fontSize: 13,
    color: muted,
    letterSpacing: '0.5px',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    border: `1px solid ${border}`,
    boxShadow: '0 2px 16px rgba(61,44,53,0.08)',
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: charcoal,
    display: 'block',
    marginBottom: 10,
  },
  inputRow: {
    display: 'flex',
    gap: 10,
  },
  input: {
    flex: 1,
    border: `1px solid ${border}`,
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 18,
    letterSpacing: 2,
    color: charcoal,
    fontWeight: 700,
    outline: 'none',
    backgroundColor: '#fdf6f9',
  },
  lookupBtn: {
    backgroundColor: pink,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 20px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  errorText: {
    color: '#e07a8a',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 0,
  },
  redeemedBanner: {
    backgroundColor: `${mint}22`,
    color: '#5a9e94',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
    textAlign: 'center',
  },
  discountHero: {
    fontSize: 52,
    fontWeight: 800,
    color: pink,
    lineHeight: 1,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 700,
    color: charcoal,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: border,
    margin: '16px 0',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 16,
  },
  rowLabel: {
    fontSize: 12,
    color: muted,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    flexShrink: 0,
  },
  rowValue: {
    fontSize: 14,
    color: charcoal,
    fontWeight: 600,
    textAlign: 'right',
  },
  notesBox: {
    backgroundColor: '#fdf0f5',
    borderRadius: 10,
    padding: '10px 14px',
    marginTop: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    border: `1px solid ${border}`,
  },
  notesLabel: {
    fontSize: 11,
    color: muted,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  notesText: {
    fontSize: 14,
    color: charcoal,
  },
  voucherCode: {
    fontSize: 22,
    fontWeight: 800,
    color: charcoal,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 16,
  },
  redeemBtn: {
    width: '100%',
    backgroundColor: charcoal,
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    padding: '16px 0',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: muted,
    marginTop: 8,
  },
}
