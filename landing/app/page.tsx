'use client'

import { useState } from 'react'

const BASE_APP_URL = process.env.NEXT_PUBLIC_BASE_APP_URL || 'https://app.openbands.xyz'

export default function Page() {
  const [showTally, setShowTally] = useState(false)


  return (
    <div className="min-h-screen gradient-bg text-gray-100">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/Openbands.png" alt="Openbands" className="h-8 w-8 rounded" />
          <span className="text-lg font-semibold">Openbands</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://x.com/OpenbandsXYZ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 hover:bg-white/15"
            aria-label="Openbands on X"
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://farcaster.xyz/openbands"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 hover:bg-white/15"
            aria-label="Openbands on Farcaster"
          >
            <img src="/farcaster.png" alt="Farcaster" className="h-5 w-5" />
          </a>
          <a href={BASE_APP_URL} className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-500 text-white font-medium">Launch App</a>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-4 pt-8 pb-14 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Anonymous. <span className="text-accent-500">Verified.</span> Raw.
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-gray-300">
        Join verified workplace conversations without giving up your privacy.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={BASE_APP_URL} className="px-6 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-semibold w-full sm:w-auto">Launch App</a>
          <button onClick={() => setShowTally(true)} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold w-full sm:w-auto">Join Waitlist</button>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Verified, not exposed', body: 'Prove your company affiliation with your Google email, without sharing it.' },
          { title: 'True anonymity', body: 'Post and comment freely, your name never appears.' },
          { title: 'Company‑first feeds', body: 'See what’s trending inside your company, filter by New or Hot.' },
          { title: 'Privacy by design', body: 'With zero‑knowledge proofs, your identity stays yours. Your data never leaves your device.' },
        ].map((f, i) => (
          <div key={i} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5">
            <h3 className="font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-sm text-gray-300">{f.body}</p>
          </div>
        ))}
      </section>

      {/* Screenshots removed per design choice */}

      {/* How it works (dark theme to match site) */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-10">How it works</h2>
        <ol className="grid sm:grid-cols-3 gap-6">
          <li className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="w-8 h-8 rounded-full bg-accent-600 text-white flex items-center justify-center font-semibold mb-3">1</div>
            <div className="font-semibold text-white mb-1">Connect your wallet</div>
            <div className="text-sm text-gray-300">Use your EVM wallet to connect and verify your company domain onchain.</div>
            <img
              src="/wallet.png"
              alt="Connect a wallet"
              className="mt-4 w-full h-40 object-cover rounded-xl border border-white/10 bg-midnight-800"
            />
          </li>
          <li className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="w-8 h-8 rounded-full bg-secondary-500 text-white flex items-center justify-center font-semibold mb-3">2</div>
            <div className="font-semibold text-white mb-1">Log in with your work email</div>
            <div className="text-sm text-gray-300">Verify your company affiliation. Personal information never leaves your device.</div>
            <img
              src="/login.png"
              alt="Sign in with work email"
              className="mt-4 w-full h-40 object-cover rounded-xl border border-white/10 bg-midnight-800"
            />
          </li>
          <li className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold mb-3">3</div>
            <div className="font-semibold text-white mb-1">Start posting</div>
            <div className="text-sm text-gray-300">Post and comment anonymously in company feeds. Only your verified domain is public.</div>
            <img
              src="/company.png"
              alt="Company feed screenshot"
              className="mt-4 w-full h-40 object-cover rounded-xl border border-white/10 bg-midnight-800"
            />
          </li>
        </ol>
      </section>

      {/* Social proof / Achievement */}
      <section className="max-w-6xl mx-auto px-4 pb-24 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-base sm:text-lg text-white shadow-lg shadow-accent-600/10">
          🏆 Noirhack 2025 — 1st Place
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Recognized by leading privacy advocates</h3>
        <div className="flex items-center justify-center gap-12">
          <img src="/aztec.png" alt="Aztec" className="h-14 w-auto opacity-95" />
          <img src="/logoDark.png" alt="Noir" className="h-14 w-auto opacity-95" />
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'What is Openbands?',
              a: 'A privacy‑first place for verified, anonymous workplace discussions powered by zero‑knowledge proofs.'
            },
            {
              q: 'What becomes public?',
              a: 'Only your company domain. Your personal identity and data never leave your device.'
            },
            {
              q: 'How do you verify?',
              a: 'Connect your wallet and sign in with Google. You generate a ZK proof of your domain. Your full email and personal information is never exposed.'
            },
            {
              q: 'Can anyone see who I am?',
              a: 'No. Posting and commenting are anonymous. Our onchain verifier checks proofs without revealing identities.'
            },
          ].map((item, i) => (
            <details key={i} className="rounded-xl border border-white/10 bg-white/5">
              <summary className="cursor-pointer select-none px-4 py-3 font-medium text-white">{item.q}</summary>
              <div className="px-4 pb-4 text-sm text-gray-300">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Openbands will soon be a Post-to-Earn app</h2>
        <p className="text-gray-300 mb-6">Sign up for our waitlist for early access.</p>
        <button onClick={() => setShowTally(true)} className="px-6 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-semibold">Join Waitlist</button>
      </section>

      {/* Waitlist modal */}
      {showTally && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-xl shadow-xl overflow-hidden">
            <button onClick={() => setShowTally(false)} className="absolute top-3 right-3 rounded-full bg-gray-100 hover:bg-gray-200 p-2 text-gray-700">✕</button>
            <iframe
              src="https://tally.so/r/w8DovP?transparentBackground=1"
              width="100%"
              height="100%"
              frameBorder={0}
              title="Openbands Waitlist"
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/Openbands.png" className="h-6 w-6" alt="Openbands" />
            <span className="font-medium text-white">Openbands</span>
          </div>
          <div className="text-sm">© {new Date().getFullYear()} Openbands</div>
        </div>
      </footer>
    </div>
  )
}


