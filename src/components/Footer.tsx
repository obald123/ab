const footerLinks = {
  Personal: ['Savings Account', 'Current Account', 'Fixed Deposit', 'Mobile Banking', 'Cards & Payments'],
  Business: ['Business Account', 'Trade Finance', 'Corporate Treasury', 'SME Banking', 'Cash Management'],
  Loans: ['Home Loan', 'Auto Loan', 'Education Loan', 'Business Loan', 'Salary Advance'],
  Company: ['About AB Bank', 'Careers', 'Press Room', 'Investor Relations', 'Contact Us'],
}

export default function Footer() {
  return (
    <footer className="bg-bank-green-dark text-white">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2
                className="text-white text-3xl lg:text-4xl font-bold leading-tight mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Ready to Start Your
                <br />
                Financial Journey?
              </h2>
              <p className="text-white/60 text-base">
                Open an account in minutes — online or at any of our 47 branches
                across Rwanda.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <a
                href="#"
                className="px-7 py-3.5 bg-bank-gold text-bank-green-dark font-semibold rounded hover:bg-bank-gold-light transition-colors text-sm"
              >
                Open Account Online
              </a>
              <a
                href="#branches"
                className="px-7 py-3.5 border border-white/30 text-white font-medium rounded hover:bg-white/10 transition-colors text-sm"
              >
                Find a Branch
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-sm bg-bank-gold flex items-center justify-center flex-shrink-0">
                <span
                  className="text-bank-green-dark font-bold text-sm"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  AB
                </span>
              </div>
              <span
                className="text-white font-bold text-base"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                AB Bank Rwanda
              </span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-6">
              Licensed and regulated by the National Bank of Rwanda (BNR).
              Member of the Deposit Guarantee Fund of Rwanda.
            </p>
            <div className="flex gap-3">
              {['Facebook', 'Twitter', 'LinkedIn', 'YouTube'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  aria-label={platform}
                  className="w-8 h-8 border border-white/20 rounded flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors text-xs font-semibold"
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/50 text-xs hover:text-white/80 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 AB Bank Rwanda Ltd. All rights reserved. RC No. 100000472
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/30 text-xs hover:text-white/60 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
