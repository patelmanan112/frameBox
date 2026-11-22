"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  Film,
  Menu,
  Search,
  Tv,
  X,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import type { SearchItem } from "@/types";

const links = [
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/genres", label: "Genres" },
  { href: "/top-rated", label: "Top Rated" },
];

export default function Navbar({ items }: { items: SearchItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      try {
        const saved =
          localStorage.getItem("framebox_watchlist") ||
          localStorage.getItem("cineverse_watchlist");
        if (saved) setWatchlistCount(JSON.parse(saved).length);
        else setWatchlistCount(0);
      } catch {
        // ignore
      }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    const interval = setInterval(updateCount, 2000);
    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenus = () => {
    setSearchOpen(false);
    setMobileOpen(false);
    setQuery("");
  };

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? items
        .filter((item) => item.title.toLowerCase().includes(trimmed))
        .slice(0, 8)
    : [];

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    const first = results[0];
    if (first) {
      router.push(`/${first.type === "movie" ? "movies" : "series"}/${first.id}`);
    } else {
      router.push(`/movies?q=${encodeURIComponent(value)}`);
    }
    closeSearch();
  };

  return (
    <header className={`stream-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container stream-nav-content">
        <div className="stream-nav-left">
          <Link
            href="/"
            className="stream-logo"
            aria-label="FrameBox home"
            onClick={closeMenus}
          >
            <Logo size="md" />
          </Link>

          <nav className="stream-nav-menu" aria-label="Main Navigation">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`stream-nav-item ${active ? "active" : ""}`}
                  onClick={closeMenus}
                >
                  <span>{link.label}</span>
                  {active && <span className="stream-nav-indicator" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="stream-nav-right">
          <button
            type="button"
            className="stream-search-trigger"
            aria-label="Search"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              setMobileOpen(false);
            }}
          >
            <Search size={15} />
            <span className="stream-search-placeholder">Search films, series...</span>
            <kbd className="stream-search-shortcut">⌘K</kbd>
          </button>

          {watchlistCount > 0 && (
            <Link
              href="/movies"
              className="stream-watchlist-btn"
              title={`${watchlistCount} titles saved in watchlist`}
            >
              <Bookmark size={15} className="text-brand" fill="currentColor" />
              <span>{watchlistCount}</span>
            </Link>
          )}

          <button
            type="button"
            className="stream-mobile-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setSearchOpen(false);
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="stream-search-dropdown-overlay">
          <div className="container">
            <form className="stream-search-input-wrap" onSubmit={onSubmit}>
              <Search size={18} className="text-muted" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, director, genre or actor..."
                aria-label="Search FrameBox"
              />
              <button
                type="button"
                className="stream-search-close"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>

            {trimmed && (
              <div className="stream-search-results-panel">
                {results.length > 0 ? (
                  results.map((item) => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={`/${item.type === "movie" ? "movies" : "series"}/${item.id}`}
                      className="stream-search-result-row"
                      onClick={closeSearch}
                    >
                      <span className="stream-search-type-badge">
                        {item.type === "movie" ? <Film size={14} /> : <Tv size={14} />}
                        {item.type}
                      </span>
                      <span className="stream-search-result-title">{item.title}</span>
                      <span className="stream-search-result-year">{item.year}</span>
                    </Link>
                  ))
                ) : (
                  <div className="stream-search-no-results">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav className="stream-mobile-menu">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`stream-mobile-menu-item ${isActive(link.href) ? "active" : ""}`}
              onClick={closeMenus}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
