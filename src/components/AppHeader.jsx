import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";

const NAV = [
  { label: "Job Finder", to: "/job-finder" },
  { label: "Module Information", to: "/module-information" },
  { label: "Industry Information", to: "/industry-information" },
];

export default function AppHeader({
  showSearch = false,
  searchValue = "",
  onSearchChange,
  showRestart = false,
  onRestart,
}) {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center gap-6 px-6 md:px-16 lg:px-24 py-5 bg-background/80 backdrop-blur-md border-b border-border/50">
      <Link to="/" className="flex items-center gap-2 shrink-0 group">
        <span className="text-sm font-semibold tracking-wide group-hover:text-accent-deep transition-colors">UCL Mechanical Engineering</span>
      </Link>

      {showSearch && (
        <div className="flex-1 flex justify-center">
          <div className="flex items-center">
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search modules"
            >
              <Search className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search modules..."
              onFocus={() => setSearchOpen(true)}
              onBlur={() => { if (!searchValue) setSearchOpen(false); }}
              className={`bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground transition-all duration-300 overflow-hidden ${
                searchOpen ? "w-40 md:w-64 opacity-100 ml-2" : "w-0 opacity-0 ml-0"
              }`}
            />
          </div>
        </div>
      )}

      <nav className="flex items-center gap-6 text-xs tracking-[0.15em] uppercase text-muted-foreground shrink-0">
        {NAV.map((l) =>
          pathname === l.to ? (
            <span key={l.to} className="text-foreground">{l.label}</span>
          ) : (
            <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors">{l.label}</Link>
          )
        )}
        {showRestart && (
          <button onClick={onRestart} className="hover:text-foreground transition-colors">
            Restart
          </button>
        )}
      </nav>
    </header>
  );
}