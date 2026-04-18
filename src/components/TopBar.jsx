export default function TopBar() {
  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-mark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h10M4 10h8M4 14h12M4 18h6"/>
            <circle cx="20" cy="6" r="2.5" fill="#f97316" stroke="none"/>
          </svg>
        </div>
        <span className="logo-name">CodeLore</span>
        <span className="logo-tag">AI Documentation Generator</span>
      </div>
    </header>
  );
}
