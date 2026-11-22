"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  Film,
  Play,
  Share2,
  Star,
} from "lucide-react";
import GenreChip from "@/components/ui/GenreChip";
import RatingBadge from "@/components/ui/RatingBadge";
import TrailerModal from "@/components/ui/TrailerModal";
import type { Movie } from "@/types";

export default function MovieDetailHero({ movie }: { movie: Movie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved =
        localStorage.getItem("framebox_watchlist") ||
        localStorage.getItem("cineverse_watchlist");
      return saved ? JSON.parse(saved).includes(movie._id) : false;
    } catch {
      return false;
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved =
          localStorage.getItem("framebox_watchlist") ||
          localStorage.getItem("cineverse_watchlist");
        if (saved) {
          const list: string[] = JSON.parse(saved);
          setInWatchlist(list.includes(movie._id));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [movie._id]);

  const toggleWatchlist = () => {
    try {
      const saved =
        localStorage.getItem("framebox_watchlist") ||
        localStorage.getItem("cineverse_watchlist");
      const list: string[] = saved ? JSON.parse(saved) : [];
      const updated = list.includes(movie._id)
        ? list.filter((id) => id !== movie._id)
        : [...list, movie._id];
      localStorage.setItem("framebox_watchlist", JSON.stringify(updated));
      setInWatchlist(updated.includes(movie._id));
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  return (
    <>
      <section className="detail-hero">
        <div className="detail-bg">
          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 25%" }}
          />
        </div>
        <div className="detail-shade" />
        <div className="detail-shade-bottom" />

        <div className="container detail-inner">
          <div className="detail-grid">
            <div className="detail-poster-wrap">
              <div className="detail-poster">
                <Image
                  src={movie.posterUrl}
                  alt={`${movie.title} poster`}
                  fill
                  priority
                  sizes="280px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="detail-poster-badge">
                #{movie.topTenRank} TOP RANK
              </div>
            </div>

            <div className="detail-content-wrap">
              <div className="chips" style={{ marginBottom: 16 }}>
                {movie.genre.map((genre) => (
                  <GenreChip key={genre} genre={genre} size="sm" />
                ))}
              </div>

              <h1 className="detail-title">{movie.title}</h1>

              <div className="detail-meta">
                <span className="detail-meta-pill">{movie.year}</span>
                <span className="movie-card-dot" aria-hidden="true" />
                <span className="detail-meta-pill">
                  <Clock size={13} aria-hidden="true" />
                  {movie.runtime} min
                </span>
                <span className="movie-card-dot" aria-hidden="true" />
                <span className="detail-meta-pill">{movie.language}</span>
                <span className="movie-card-dot" aria-hidden="true" />
                <span className="detail-meta-pill">
                  <Film size={13} aria-hidden="true" />
                  Directed by {movie.director}
                </span>
              </div>

              <div className="detail-score-row">
                <RatingBadge rating={movie.rating} size="lg" />
                <div>
                  <div className="detail-score">
                    {movie.rating.toFixed(1)}
                    <small> / 10</small>
                  </div>
                  <div className="detail-reviews-sub">
                    <Star size={12} fill="currentColor" className="text-gold" />
                    <span>
                      {movie.reviewCount.toLocaleString("en-US")} verified reader critiques
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-actions">
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => setShowTrailer(true)}
                >
                  <Play size={17} fill="currentColor" aria-hidden="true" />
                  Watch Trailer
                </button>

                <button
                  type="button"
                  className={`btn btn-ghost ${inWatchlist ? "active-gold" : ""}`}
                  onClick={toggleWatchlist}
                  aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {inWatchlist ? (
                    <>
                      <BookmarkCheck size={16} className="text-gold" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Bookmark size={16} />
                      Save to Watchlist
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleShare}
                  aria-label="Share movie link"
                  title="Copy link to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-gold" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      Share
                    </>
                  )}
                </button>

                <Link
                  className="btn btn-ghost"
                  href={`/genres/${encodeURIComponent(movie.genre[0])}`}
                >
                  More {movie.genre[0]}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showTrailer && (
        <TrailerModal
          isOpen={true}
          onClose={() => setShowTrailer(false)}
          trailerUrl={movie.trailerUrl}
          title={movie.title}
        />
      )}
    </>
  );
}
