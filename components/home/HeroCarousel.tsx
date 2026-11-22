"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import TrailerModal from "@/components/ui/TrailerModal";
import type { Movie } from "@/types";

export default function HeroCarousel({ items }: { items: Movie[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<Movie | null>(null);
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

  const count = items.length;

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

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("framebox_watchlist", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setIndex((current) => (current - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused || count < 2 || activeTrailer !== null) return;
    const id = window.setInterval(next, 7000);
    return () => window.clearInterval(id);
  }, [paused, count, next, activeTrailer]);

  if (count === 0) return null;

  const currentMovie = items[index];
  const inWatchlist = currentMovie ? watchlist.includes(currentMovie._id) : false;

  return (
    <>
      <section
        className="hero"
        aria-label="Featured films"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((movie, slideIndex) => {
          const active = slideIndex === index;
          return (
            <div
              key={movie._id}
              className={`hero-slide ${active ? "active" : ""}`}
              aria-hidden={!active}
              inert={!active}
            >
              <div className="hero-media">
                <Image
                  src={movie.backdropUrl}
                  alt={movie.title}
                  fill
                  priority={slideIndex === 0}
                  loading={slideIndex === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  style={{ objectFit: "cover", objectPosition: "center 20%" }}
                />
              </div>

              {/* Seamless multi-stage gradient masks */}
              <div className="hero-shade-left" />
              <div className="hero-shade-bottom" />
              <div className="hero-shade-top" />

              <div className="container hero-inner">
                <div className="hero-content">
                  <div className="hero-badges">
                    <span className="hero-trending-badge">
                      <Sparkles size={13} />
                      TRENDING #{movie.topTenRank}
                    </span>
                    <span className="hero-spec-badge">4K ULTRA HD</span>
                    <span className="hero-spec-badge">IMAX</span>
                  </div>

                  <h1 className="hero-title">{movie.title}</h1>

                  <div className="hero-meta-row">
                    <span className="hero-score-badge">
                      <Star size={13} fill="currentColor" />
                      {movie.rating.toFixed(1)}
                    </span>
                    <span className="hero-meta-val">{movie.year}</span>
                    <span className="hero-meta-dot">•</span>
                    <span className="hero-meta-val">{movie.runtime}m</span>
                    <span className="hero-meta-dot">•</span>
                    <span className="hero-meta-val">Dir. {movie.director}</span>
                    <span className="hero-meta-dot">•</span>
                    <span className="hero-genre-tag">{movie.genre.join(" / ")}</span>
                  </div>

                  <p className="hero-desc">{movie.description}</p>

                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn-play-primary"
                      onClick={() => setActiveTrailer(movie)}
                    >
                      <Play size={18} fill="currentColor" />
                      Watch Trailer
                    </button>

                    <button
                      type="button"
                      className={`btn-hero-glass ${inWatchlist ? "active" : ""}`}
                      onClick={() => toggleWatchlist(movie._id)}
                      aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      {inWatchlist ? (
                        <>
                          <BookmarkCheck size={18} className="text-brand" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark size={18} />
                          Watchlist
                        </>
                      )}
                    </button>

                    <Link className="btn-hero-glass" href={`/movies/${movie._id}`}>
                      <Info size={18} />
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {count > 1 ? (
          <>
            <button
              type="button"
              className="hero-nav-arrow prev"
              aria-label="Previous film"
              onClick={prev}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className="hero-nav-arrow next"
              aria-label="Next film"
              onClick={next}
            >
              <ChevronRight size={24} />
            </button>

            <div className="hero-progress-bars">
              {items.map((movie, dotIndex) => (
                <button
                  key={movie._id}
                  type="button"
                  className={`hero-progress-bar ${dotIndex === index ? "active" : ""}`}
                  aria-label={`Slide to ${movie.title}`}
                  onClick={() => setIndex(dotIndex)}
                >
                  <span className="hero-progress-fill" />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </section>

      {activeTrailer && (
        <TrailerModal
          isOpen={true}
          onClose={() => setActiveTrailer(null)}
          trailerUrl={activeTrailer.trailerUrl}
          title={activeTrailer.title}
        />
      )}
    </>
  );
}
