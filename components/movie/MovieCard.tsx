"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Play, Star } from "lucide-react";
import type { Movie } from "@/types";

type MovieCardProps = {
  movie: Movie;
  priority?: boolean;
};

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
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

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <Link href={`/movies/${movie._id}`} className="stream-card group">
      <div className="stream-card-poster">
        <Image
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          fill
          priority={priority}
          sizes="(max-width: 760px) 45vw, (max-width: 1200px) 22vw, 220px"
          style={{ objectFit: "cover" }}
        />

        <div className="stream-card-top">
          <span className="stream-rating-pill">
            <Star size={11} fill="currentColor" />
            {movie.rating.toFixed(1)}
          </span>
          <button
            type="button"
            className={`stream-bookmark-btn ${inWatchlist ? "active" : ""}`}
            onClick={toggleWatchlist}
            aria-label={inWatchlist ? "Saved in watchlist" : "Save to watchlist"}
            title={inWatchlist ? "Saved in watchlist" : "Save to watchlist"}
          >
            {inWatchlist ? (
              <BookmarkCheck size={14} className="text-brand" />
            ) : (
              <Bookmark size={14} />
            )}
          </button>
        </div>

        <div className="stream-card-overlay">
          <span className="stream-play-circle">
            <Play size={22} fill="currentColor" />
          </span>
        </div>

        <span className="stream-quality-tag">4K</span>
      </div>

      <div className="stream-card-info">
        <h3 className="stream-card-title">{movie.title}</h3>
        <div className="stream-card-meta">
          <span>{movie.year}</span>
          <span className="stream-meta-dot">•</span>
          <span>{movie.genre[0]}</span>
          <span className="stream-meta-dot">•</span>
          <span>{movie.runtime}m</span>
        </div>
      </div>
    </Link>
  );
}
