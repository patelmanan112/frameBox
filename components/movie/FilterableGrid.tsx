"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, Search, SlidersHorizontal, X } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import type { Movie } from "@/types";

type SortKey = "rating" | "year" | "title" | "runtime";

const sortLabels: Record<SortKey, string> = {
  rating: "Highest rated",
  year: "Newest first",
  title: "Title A–Z",
  runtime: "Longest runtime",
};

export default function FilterableGrid({
  movies,
  initialQuery = "",
}: {
  movies: Movie[];
  initialQuery?: string;
}) {
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState<SortKey>("rating");
  const [query, setQuery] = useState(initialQuery);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved =
        localStorage.getItem("framebox_watchlist") ||
        localStorage.getItem("cineverse_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved =
          localStorage.getItem("framebox_watchlist") ||
          localStorage.getItem("cineverse_watchlist");
        if (saved) setWatchlist(JSON.parse(saved));
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const genres = useMemo(
    () => ["All", ...new Set(movies.flatMap((movie) => movie.genre))].sort(
      (a, b) => (a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)),
    ),
    [movies],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = movies.filter((movie) => {
      const matchesGenre = genre === "All" || movie.genre.includes(genre);
      const matchesQuery =
        !needle ||
        movie.title.toLowerCase().includes(needle) ||
        movie.director.toLowerCase().includes(needle) ||
        movie.genre.some((item) => item.toLowerCase().includes(needle));
      const matchesWatchlist = !watchlistOnly || watchlist.includes(movie._id);
      return matchesGenre && matchesQuery && matchesWatchlist;
    });

    return [...list].sort((a, b) => {
      if (sort === "year") return b.year - a.year;
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "runtime") return b.runtime - a.runtime;
      return b.rating - a.rating;
    });
  }, [movies, genre, sort, query, watchlistOnly, watchlist]);

  const reset = () => {
    setGenre("All");
    setQuery("");
    setSort("rating");
    setWatchlistOnly(false);
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-chips">
          {genres.map((item) => {
            const count =
              item === "All"
                ? movies.length
                : movies.filter((m) => m.genre.includes(item)).length;

            return (
              <button
                key={item}
                type="button"
                className={`chip ${genre === item ? "active" : ""}`}
                aria-pressed={genre === item}
                onClick={() => setGenre(item)}
              >
                <span>{item}</span>
                <span className="chip-count">{count}</span>
              </button>
            );
          })}

          <button
            type="button"
            className={`chip chip-watchlist ${watchlistOnly ? "active" : ""}`}
            onClick={() => setWatchlistOnly((prev) => !prev)}
            aria-pressed={watchlistOnly}
            title="Show only movies in your watchlist"
          >
            <Bookmark size={13} />
            <span>Saved</span>
            <span className="chip-count">{watchlist.length}</span>
          </button>
        </div>

        <div className="filter-controls">
          <label className="search-box">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by title or director..."
              aria-label="Filter films"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="search-clear-btn"
                aria-label="Clear filter"
              >
                <X size={13} />
              </button>
            )}
          </label>

          <div className="select-wrap">
            <SlidersHorizontal size={14} className="select-icon" />
            <select
              className="select"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="Sort films"
            >
              <option value="rating">Highest rated</option>
              <option value="year">Newest first</option>
              <option value="title">Title A–Z</option>
              <option value="runtime">Longest runtime</option>
            </select>
          </div>
        </div>
      </div>

      <div className="results-meta">
        <span>
          Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "film" : "films"}
        </span>
        <span>Sorted by {sortLabels[sort].toLowerCase()}</span>
      </div>

      {filtered.length > 0 ? (
        <div className="cards-grid">
          {filtered.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-title">Nothing in this frame</div>
          <p className="empty-text">
            No films match those filters. Try selecting another genre or resetting your query.
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 18 }}
            onClick={reset}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
