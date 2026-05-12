'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Warp } from '@paper-design/shaders-react'
import NRLogo from '@/components/ui/nr-logo'

const NRLogo3D = dynamic(() => import('@/components/ui/nr-logo-3d'), { ssr: false })

const GOLD = '#C9A96E'
const SERIF = "var(--font-playfair), Georgia, serif"

/* ── Scroll-reveal ── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ── Photo tile: shows gradient placeholder until image loads ── */
function Photo({
  src,
  alt,
  className = '',
  style = {},
}: {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}) {
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setOk(true)
  }, [])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: err || !ok
          ? 'linear-gradient(135deg, rgba(13,79,60,0.7) 0%, rgba(10,31,68,0.6) 100%)'
          : undefined,
        ...style,
      }}
    >
      {(err || !ok) && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8,
          color: 'rgba(255,255,255,0.35)', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {src.split('/').pop()}
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setOk(true)}
        onError={() => setErr(true)}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: ok && !err ? 1 : 0,
          transition: 'opacity 0.6s ease',
          position: 'absolute', inset: 0,
        }}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function Page() {
  useReveal()

  const [email, setEmail]           = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 900)
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const start = window.scrollY
    const target = el.getBoundingClientRect().top + window.scrollY - 80
    const dist = target - start
    const duration = 1100
    let startTime: number | null = null

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const step = (now: number) => {
      if (!startTime) startTime = now
      const elapsed = Math.min((now - startTime) / duration, 1)
      window.scrollTo(0, start + dist * ease(elapsed))
      if (elapsed < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; background: #062a22; overflow-x: hidden; user-select: none; -webkit-user-select: none; }
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; cursor: default; }
        a { text-decoration: none; color: inherit; cursor: pointer; }
        button { cursor: pointer; }
        input, textarea { user-select: text; -webkit-user-select: text; cursor: text; }

        @keyframes nr-rise   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes nr-sweep  { from { width:0; } to { width:120px; } }
        @keyframes nr-fade   { from { opacity:0; } to { opacity:1; } }
        @keyframes nr-spark  { 0%{transform:translateY(0) scale(1);opacity:1;} 100%{transform:translateY(60px) rotate(45deg) scale(0.3);opacity:0;} }
        @keyframes nr-pulse  { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
        @keyframes nr-spin   { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        .nr-rise  { animation: nr-rise  0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .nr-sweep { animation: nr-sweep 1.2s cubic-bezier(0.22,1,0.36,1) both; }
        .nr-fade  { animation: nr-fade  0.8s ease both; }
        .nr-pulse { animation: nr-pulse 2.4s ease-in-out infinite; }

        /* Reveal animation */
        .reveal {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1),
                      transform 0.9s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .rd1 { transition-delay: 0.1s; }
        .rd2 { transition-delay: 0.22s; }
        .rd3 { transition-delay: 0.34s; }
        .rd4 { transition-delay: 0.46s; }

        /* Glass panel */
        .glass {
          background: rgba(0,0,0,0.28);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.11);
        }

        /* Buttons */
        .btn-w {
          background: #fff; border: none; color: #0a1f44;
          border-radius: 999px; padding: 14px 36px;
          font-size: 14px; letter-spacing: 0.08em; font-weight: 500;
          cursor: pointer; transition: all 0.3s ease;
          display: inline-flex; align-items: center; font-family: inherit;
        }
        .btn-w:hover { background: rgba(255,255,255,0.88); transform: scale(0.98); }

        .btn-g {
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.32); color: #fff;
          border-radius: 999px; padding: 14px 36px;
          font-size: 14px; letter-spacing: 0.08em; font-weight: 400;
          cursor: pointer; transition: all 0.3s ease;
          display: inline-flex; align-items: center; font-family: inherit;
        }
        .btn-g:hover { background: rgba(255,255,255,0.24); border-color: rgba(255,255,255,0.58); }

        /* Input */
        .nr-input {
          width: 100%; max-width: 340px; background: transparent;
          border: 1px solid rgba(255,255,255,0.28); border-radius: 999px;
          padding: 14px 24px; color: white; font-size: 14px;
          outline: none; transition: border-color 0.3s; font-family: inherit;
          letter-spacing: 0.04em;
        }
        .nr-input::placeholder { color: rgba(255,255,255,0.36); }
        .nr-input:focus { border-color: ${GOLD}; }

        /* Gold tag */
        .gold-tag {
          color: ${GOLD}; font-size: 11px; letter-spacing: 0.26em;
          text-transform: uppercase; font-weight: 400;
        }

        /* Nav link */
        .nr-navlink {
          color: rgba(255,255,255,0.72); font-size: 12px;
          letter-spacing: 0.14em; text-transform: uppercase;
          transition: color 0.2s;
        }
        .nr-navlink:hover { color: #fff; }

        /* Responsive */
        @media (max-width: 900px) {
          .nr-hero-grid  { flex-direction: column !important; }
          .nr-story-grid { flex-direction: column !important; }
          .nr-gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .nr-specs-grid   { grid-template-columns: 1fr 1fr !important; }
          .nr-nav { padding: 18px 24px !important; }
          .nr-section { padding: 80px 24px !important; }
        }
        @media (max-width: 600px) {
          .nr-gallery-grid { grid-template-columns: 1fr !important; }
          .nr-specs-grid   { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ══ FIXED WARP SHADER BACKGROUND ══ */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Warp
          style={{ width: '100%', height: '100%' }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={0.6}
          colors={[
            'hsl(200, 100%, 20%)',
            'hsl(160, 100%, 75%)',
            'hsl(180, 90%, 30%)',
            'hsl(170, 100%, 80%)',
          ]}
        />
      </div>

      {/* ══ SCROLLABLE CONTENT ══ */}
      <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>

        {/* ── NAVBAR ── */}
        <nav className="nr-nav" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 52px',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
            <NRLogo size={52} variant="gold" showTagline={false} />
          </a>
          <div style={{ display: 'flex', gap: 36 }}>
            {[['Collection', 'gallery'], ['Maison', 'story'], ['Reserve', 'reserve']].map(([l, id]) => (
              <a key={id} href={`#${id}`} className="nr-navlink">{l}</a>
            ))}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '0 52px', paddingTop: 96,
        }}>
          <div className="nr-hero-grid" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', maxWidth: 1200, margin: '0 auto', gap: 60,
          }}>
            {/* Left text panel */}
            <div className="reveal" style={{ flex: 1, maxWidth: 520 }}>
              <p className="gold-tag" style={{ marginBottom: 12 }}>
                Limited Edition · 500 Pieces
              </p>
              <div style={{ marginBottom: 12 }}>
                <NRLogo size={90} variant="white" showTagline={false} />
              </div>
              <h1 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 400, lineHeight: 1.1,
                color: 'white', marginBottom: 20,
                letterSpacing: '-0.01em',
              }}>
                Calibre I
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.56)', fontSize: 14,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                marginBottom: 52, fontWeight: 300,
              }}>
                42mm Automatic · Swiss Movement
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn-w" onClick={() => scrollTo('reserve')}>
                  Reserve Now
                </button>
                <button className="btn-g" onClick={() => scrollTo('gallery')}>
                  Discover
                </button>
              </div>
            </div>

            {/* Right: hero photo */}
            <div style={{
              flex: '0 0 auto',
              width: 'min(400px, 38vw)',
            }}>
              <Photo
                src="/watches/hero.jpeg"
                alt="NR Calibre I"
                style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  borderRadius: 20,
                  boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
                }}
              />
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section id="gallery" className="nr-section" style={{ padding: '80px 52px' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <p className="reveal gold-tag" style={{ textAlign: 'center', marginBottom: 18 }}>
              Photography
            </p>
            <h2 className="reveal rd1" style={{
              fontFamily: SERIF, fontSize: 'clamp(30px, 4vw, 54px)',
              fontWeight: 400, textAlign: 'center', color: 'white',
              marginBottom: 56, letterSpacing: '-0.015em',
            }}>
              Two dials. One standard.
            </h2>

            {/* 2×2 grid + one wide */}
            <div className="nr-gallery-grid reveal rd2" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'auto auto',
              gap: 16,
            }}>
              <Photo
                src="/watches/1.jpeg"
                alt="NR Calibre I – side profile"
                style={{ width: '100%', aspectRatio: '4/3', borderRadius: 16 }}
              />
              <Photo
                src="/watches/2.jpeg"
                alt="NR Calibre I – dial detail"
                style={{ width: '100%', aspectRatio: '4/3', borderRadius: 16 }}
              />
              <Photo
                src="/watches/3.jpeg"
                alt="NR Calibre I – collection"
                style={{
                  width: '100%', aspectRatio: '16/9', borderRadius: 16,
                  gridColumn: '1 / -1', maxHeight: 340,
                }}
              />
            </div>

            {/* Bottom row */}
            <div className="reveal rd3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <Photo
                src="/watches/4.jpeg"
                alt="NR Calibre I – movement"
                style={{ width: '100%', aspectRatio: '1/1', borderRadius: 16 }}
              />
              <Photo
                src="/watches/5.jpeg"
                alt="NR Calibre I – wristshot"
                style={{ width: '100%', aspectRatio: '4/3', borderRadius: 16 }}
              />
            </div>
          </div>
        </section>

        {/* ── SPECS ── */}
        <section id="specs" className="nr-section" style={{ padding: '100px 52px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p className="reveal gold-tag" style={{ textAlign: 'center', marginBottom: 18 }}>
              Technical Specifications
            </p>
            <h2 className="reveal rd1" style={{
              fontFamily: SERIF, fontSize: 'clamp(30px, 4vw, 54px)',
              fontWeight: 400, textAlign: 'center', color: 'white', marginBottom: 64,
            }}>
              Built to endure
            </h2>
            <div className="nr-specs-grid reveal rd2" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
            }}>
              {[
                { label: 'Movement',         val: 'Powermatic 80', sub: 'Self-winding automatic' },
                { label: 'Case',             val: '42mm Cushion',  sub: 'Stainless steel 316L' },
                { label: 'Crystal',          val: 'Sapphire AR',   sub: 'Anti-reflective coating' },
                { label: 'Water Resistance', val: '100m / 330ft',  sub: '10 ATM rated' },
              ].map(({ label, val, sub }) => (
                <div key={label} className="glass" style={{ borderRadius: 16, padding: '32px 20px', textAlign: 'center' }}>
                  <p className="gold-tag" style={{ fontSize: 10, marginBottom: 14 }}>{label}</p>
                  <p style={{
                    fontFamily: SERIF, fontSize: 19, fontWeight: 400,
                    color: 'white', marginBottom: 8, lineHeight: 1.3,
                  }}>{val}</p>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12 }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STORY ── */}
        <section id="story" className="nr-section" style={{ padding: '100px 52px' }}>
          <div className="nr-story-grid" style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'flex', alignItems: 'center', gap: 60,
          }}>
            {/* Text */}
            <div className="reveal" style={{ flex: 1 }}>
              <div className="glass" style={{ borderRadius: 24, padding: '52px 44px' }}>
                <p className="gold-tag" style={{ marginBottom: 20 }}>Our Maison</p>
                <h2 style={{
                  fontFamily: SERIF, fontSize: 'clamp(26px, 3.2vw, 44px)',
                  fontWeight: 400, color: 'white', marginBottom: 36, lineHeight: 1.2,
                }}>
                  Crafted without<br />compromise
                </h2>
                {[
                  'Every NR timepiece begins as a block of grade-5 stainless steel, shaped across 72 hours of continuous machining.',
                  'Our calibres are assembled by a single master watchmaker — movement to dial to bracelet — ensuring absolute coherence.',
                  'The Calibre I is our first public release. Five hundred pieces. No reissues. No compromises.',
                ].map((t, i) => (
                  <p key={i} style={{
                    color: 'rgba(255,255,255,0.68)', fontSize: 14.5,
                    lineHeight: 1.85,
                    borderLeft: `2px solid ${GOLD}`, paddingLeft: 20,
                    marginBottom: i < 2 ? 20 : 0,
                  }}>{t}</p>
                ))}
                <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="btn-w" onClick={() => scrollTo('reserve')}>Reserve Now</button>
                  <button className="btn-g" onClick={() => scrollTo('gallery')}>View Collection</button>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="reveal rd2" style={{ flex: '0 0 auto', width: 'min(360px, 38vw)' }}>
              <Photo
                src="/watches/story.jpeg"
                alt="NR Calibre I – presentation box"
                style={{
                  width: '100%', aspectRatio: '4/5',
                  borderRadius: 20,
                  boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
                }}
              />
            </div>
          </div>
        </section>

        {/* ── RESERVE ── */}
        <section id="reserve" className="nr-section" style={{ padding: '120px 52px' }}>
          <div className="reveal" style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
            <div className="glass" style={{ borderRadius: 26, padding: '68px 44px' }}>
              <p className="gold-tag" style={{ marginBottom: 20 }}>Exclusive Access</p>
              <h2 style={{
                fontFamily: SERIF, fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 400, color: 'white', marginBottom: 16,
              }}>
                Join the waitlist
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.5)', fontSize: 14,
                marginBottom: 44, lineHeight: 1.8,
              }}>
                Reserve your NR Calibre I before it is gone.<br />
                Members receive first allocation access.
              </p>
              {submitted ? (
                /* ── Luxury confirmation ── */
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  {/* Diamond spark icon */}
                  <div className="nr-fade" style={{
                    display: 'flex', justifyContent: 'center', marginBottom: 28,
                    animationDelay: '0s', animationDuration: '0.6s',
                  }}>
                    <svg width="48" height="48" viewBox="0 0 130 130" style={{
                      animation: 'nr-pulse 2.8s ease-in-out infinite',
                    }}>
                      <polygon points="42,20 56,4 56,20"      fill="#7A5010" />
                      <polygon points="56,4 63,4 63,20 56,20" fill="#B8902E" />
                      <polygon points="63,4 67,4 67,20 63,20" fill="#F5D878" />
                      <polygon points="67,4 74,4 74,20 67,20" fill="#E8C86A" />
                      <polygon points="74,4 88,20 74,20"      fill="#C9A96E" />
                      <polygon points="42,20 56,20 65,38"     fill="#C9A96E" />
                      <polygon points="56,20 74,20 65,38"     fill="#7A5010" />
                      <polygon points="74,20 88,20 65,38"     fill="#E8C86A" />
                      <polygon points="56,4 74,4 88,20 65,38 42,20" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
                    </svg>
                  </div>

                  {/* Headline */}
                  <p className="nr-rise" style={{
                    fontFamily: SERIF, fontSize: 'clamp(20px, 3vw, 28px)',
                    fontWeight: 400, color: 'white', lineHeight: 1.3,
                    marginBottom: 12, animationDelay: '0.15s',
                  }}>
                    You are on the list.
                  </p>

                  {/* Gold rule sweep */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <div className="nr-sweep" style={{
                      height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
                      animationDelay: '0.35s',
                    }} />
                  </div>

                  {/* Sub message */}
                  <p className="nr-fade" style={{
                    color: 'rgba(255,255,255,0.55)', fontSize: 13,
                    letterSpacing: '0.04em', lineHeight: 1.9,
                    marginBottom: 36, animationDelay: '0.5s',
                  }}>
                    Welcome to the NR Maison.<br />
                    You will receive first allocation access<br />
                    when Calibre I becomes available.
                  </p>

                  {/* Gold tag */}
                  <p className="nr-fade gold-tag" style={{
                    fontSize: 10, letterSpacing: '0.3em', animationDelay: '0.7s',
                  }}>
                    Limited to 500 Pieces · Est. 2024
                  </p>
                </div>
              ) : (
                <>
                  <form
                    onSubmit={handleReserve}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
                  >
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="nr-input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="btn-w"
                      disabled={submitting}
                      style={{
                        minWidth: 200,
                        opacity: submitting ? 0.7 : 1,
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {submitting ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            width: 14, height: 14,
                            border: '1.5px solid rgba(10,31,68,0.3)',
                            borderTopColor: '#0a1f44',
                            borderRadius: '50%',
                            animation: 'nr-spin 0.7s linear infinite',
                            flexShrink: 0,
                          }} />
                          Reserving…
                        </span>
                      ) : 'Reserve Now'}
                    </button>
                  </form>
                  <p style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: 12,
                    fontStyle: 'italic', marginTop: 28,
                  }}>
                    Only 500 pieces worldwide
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          background: '#ffffff',
          padding: '40px 52px 28px',
          textAlign: 'center',
          position: 'relative', zIndex: 1,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <NRLogo size={52} variant="dark" showTagline={false} />
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: 8, letterSpacing: '0.35em',
            color: '#999', textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            MAISON DE LUXE
          </p>

          {/* Est. */}
          <p style={{
            fontFamily: SERIF, fontSize: 10, fontWeight: 400,
            color: '#bbb', letterSpacing: '0.15em',
            marginBottom: 22,
          }}>
            Est. 2024
          </p>

          {/* Divider */}
          <div style={{ width: 32, height: 1, background: '#e8e8e8', margin: '0 auto 20px' }} />

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            {['Collection', 'Maison', 'Reserve', 'Privacy', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                color: '#aaa', fontSize: 9,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a1a1a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
              >{l}</a>
            ))}
          </div>

          {/* Copyright */}
          <p style={{ color: '#ddd', fontSize: 9, letterSpacing: '0.06em' }}>
            © 2024 NR Maison de Luxe. All rights reserved.
          </p>
        </footer>

      </div>
    </>
  )
}
