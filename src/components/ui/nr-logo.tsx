'use client'
import { useId } from 'react'

interface NRLogoProps {
  size?: number
  variant?: 'gold' | 'white' | 'dark'
  showTagline?: boolean
}

export default function NRLogo({ size = 80, variant = 'gold', showTagline = true }: NRLogoProps) {
  const uid = useId().replace(/:/g, '_')
  const silverId  = `s-${uid}`
  const silverIdH = `sh-${uid}`

  /* Letter fill: silver on dark backgrounds, gold on light */
  const letterFill = variant === 'dark' ? '#2a2a2a' : `url(#${silverId})`

  const tagColor = variant === 'dark'
    ? 'rgba(26,26,26,0.5)'
    : 'rgba(201,169,110,0.55)'

  const h = showTagline ? 92 : 80

  /* ── gem colour palette ── */
  const G_BRIGHT  = '#F5D878'   // highlight
  const G_MID     = '#C9A96E'   // main gold
  const G_WARM    = '#B8902E'   // warm mid
  const G_DARK    = '#7A5010'   // deep shadow
  const G_LIGHT   = '#E8C86A'   // secondary light

  /*
   * Diamond geometry (viewBox 0 0 130 h):
   * Outer pentagon: A(56,4) B(74,4) C(88,20) D(65,38) E(42,20)
   * Girdle y=20, table y=4..20
   * Inner at girdle: iL(56,20) iM(65,20) iR(74,20)
   * Crown subdivided at x=62 and x=68 for extra facet lines
   */

  return (
    <svg
      viewBox={`0 0 130 ${h}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        {/* Brushed-silver gradient for NR letters */}
        <linearGradient id={silverId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f4f4f4" />
          <stop offset="28%"  stopColor="#e0e0e0" />
          <stop offset="55%"  stopColor="#b8b8b8" />
          <stop offset="78%"  stopColor="#d4d4d4" />
          <stop offset="100%" stopColor="#888888" />
        </linearGradient>
        {/* Subtle horizontal highlight band */}
        <linearGradient id={silverIdH} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
          <stop offset="50%"  stopColor="rgba(255,255,255,0.14)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* ═══════════════════════════════════════
          DIAMOND GEM  (8 facets + outline)
          Pentagon: (56,4)→(74,4)→(88,20)→(65,38)→(42,20)
      ═══════════════════════════════════════ */}

      {/* CROWN — 5 sections left→right */}

      {/* 1. Far-left crown triangle */}
      <polygon points="42,20 56,4 56,20"      fill={G_DARK}   />

      {/* 2. Left-inner crown quad */}
      <polygon points="56,4 63,4 63,20 56,20" fill={G_WARM}   />

      {/* 3. Centre crown — brightest (the "table" face) */}
      <polygon points="63,4 67,4 67,20 63,20" fill={G_BRIGHT} />

      {/* 4. Right-inner crown quad */}
      <polygon points="67,4 74,4 74,20 67,20" fill={G_LIGHT}  />

      {/* 5. Far-right crown triangle */}
      <polygon points="74,4 88,20 74,20"      fill={G_MID}    />

      {/* PAVILION — 3 sections */}

      {/* 6. Left pavilion */}
      <polygon points="42,20 56,20 65,38"     fill={G_MID}    />

      {/* 7. Centre pavilion — deepest shadow */}
      <polygon points="56,20 74,20 65,38"     fill={G_DARK}   />

      {/* 8. Right pavilion */}
      <polygon points="74,20 88,20 65,38"     fill={G_LIGHT}  />

      {/* Facet boundary lines */}
      <polygon
        points="56,4 74,4 88,20 65,38 42,20"
        fill="none"
        stroke="rgba(0,0,0,0.30)"
        strokeWidth="0.7"
      />
      {/* Internal crown verticals */}
      <line x1="56" y1="4"  x2="56" y2="20" stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" />
      <line x1="63" y1="4"  x2="63" y2="20" stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" />
      <line x1="67" y1="4"  x2="67" y2="20" stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" />
      <line x1="74" y1="4"  x2="74" y2="20" stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" />
      {/* Internal pavilion lines to culet */}
      <line x1="56" y1="20" x2="65" y2="38"  stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" />
      <line x1="74" y1="20" x2="65" y2="38"  stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" />
      {/* Girdle horizontal */}
      <line x1="42" y1="20" x2="88" y2="20"  stroke="rgba(0,0,0,0.20)" strokeWidth="0.5" />
      {/* Top shine on table */}
      <polygon
        points="64,5 66,5 66,8 64,8"
        fill="rgba(255,255,255,0.35)"
      />

      {/* ═══════════════════════════════════════
          NR LETTERS  (silver metallic serif)
      ═══════════════════════════════════════ */}
      <text
        x="40"
        y="76"
        textAnchor="middle"
        fontSize="68"
        fontFamily="'Didot', 'Bodoni 72', Georgia, 'Times New Roman', serif"
        fontWeight="400"
        fill={letterFill}
      >N</text>
      <text
        x="40" y="76"
        textAnchor="middle"
        fontSize="68"
        fontFamily="'Didot', 'Bodoni 72', Georgia, 'Times New Roman', serif"
        fontWeight="400"
        fill={`url(#${silverIdH})`}
      >N</text>

      <text
        x="90"
        y="76"
        textAnchor="middle"
        fontSize="68"
        fontFamily="'Didot', 'Bodoni 72', Georgia, 'Times New Roman', serif"
        fontWeight="400"
        fill={letterFill}
      >R</text>
      <text
        x="90" y="76"
        textAnchor="middle"
        fontSize="68"
        fontFamily="'Didot', 'Bodoni 72', Georgia, 'Times New Roman', serif"
        fontWeight="400"
        fill={`url(#${silverIdH})`}
      >R</text>

      {/* ── Tagline ── */}
      {showTagline && (
        <text
          x="65"
          y="88"
          textAnchor="middle"
          fontSize="5"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="400"
          letterSpacing="3"
          fill={tagColor}
        >MAISON DE LUXE</text>
      )}
    </svg>
  )
}
