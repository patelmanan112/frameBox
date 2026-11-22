"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Star } from "lucide-react";
import TrailerModal from "@/components/ui/TrailerModal";
import type { Movie } from "@/types";

export default function FeaturedEditorial({ movie }: { movie: Movie }) {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <>
      <section className="section spotlight-section">
        <div className="container">
          <div className="spotlight-card">
            <div className="spotlight-bg">
              <Image
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1300px"
                style={{ objectFit: "cover", objectPosition: "center 25%" }}
              />
              <div className="spotlight-shade-left" />
              <div className="spotlight-shade-bottom" />
            </div>

            <div className="spotlight-content">
              <div className="spotlight-tag">
                <Sparkles size={13} className="text-brand" />
                <span>SPOTLIGHT OF THE MONTH</span>
              </div>

              <h2 className="spotlight-title">{movie.title}</h2>

              <div className="spotlight-meta">
                <span className="spotlight-score">
                  <Star size={12} fill="currentColor" />
                  {movie.rating.toFixed(1)} Rating
                </span>
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
                <span>•</span>
                <span>Directed by {movie.director}</span>
              </div>

              <p className="spotlight-text">{movie.longDescription}</p>

              <div className="spotlight-cast-row">
                <span className="spotlight-cast-label">Starring:</span>
                <div className="spotlight-cast-avatars">
                  {movie.cast.slice(0, 3).map((member) => (
                    <div key={member.actorId} className="spotlight-cast-item">
                      <div className="spotlight-avatar">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          sizes="36px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <span className="spotlight-cast-name">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="spotlight-actions">
                <button
                  type="button"
                  className="btn-play-primary"
                  onClick={() => setShowTrailer(true)}
                >
                  <Play size={18} fill="currentColor" />
                  Watch Trailer
                </button>
                <Link
                  href={`/movies/${movie._id}`}
                  className="btn-hero-glass"
                >
                  Full Coverage
                  <ArrowRight size={16} />
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
