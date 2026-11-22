"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star, Tv } from "lucide-react";
import type { Series } from "@/types";

type SeriesCardProps = {
  series: Series;
  priority?: boolean;
};

export default function SeriesCard({ series, priority = false }: SeriesCardProps) {
  return (
    <Link href={`/series/${series._id}`} className="stream-card group">
      <div className="stream-card-poster">
        <Image
          src={series.posterUrl}
          alt={`${series.title} poster`}
          fill
          priority={priority}
          sizes="(max-width: 760px) 45vw, (max-width: 1200px) 22vw, 220px"
          style={{ objectFit: "cover" }}
        />

        <div className="stream-card-top">
          <span className="stream-rating-pill">
            <Star size={11} fill="currentColor" />
            {series.rating.toFixed(1)}
          </span>
          <span className={`series-status-tag ${series.status.toLowerCase()}`}>
            {series.status}
          </span>
        </div>

        <div className="stream-card-overlay">
          <span className="stream-play-circle">
            <Play size={22} fill="currentColor" />
          </span>
        </div>

        <span className="stream-quality-tag">
          <Tv size={10} style={{ display: "inline", marginRight: 3 }} />
          SERIES
        </span>
      </div>

      <div className="stream-card-info">
        <h3 className="stream-card-title">{series.title}</h3>
        <div className="stream-card-meta">
          <span>{series.year}</span>
          <span className="stream-meta-dot">•</span>
          <span>{series.genre[0]}</span>
          <span className="stream-meta-dot">•</span>
          <span>
            {series.seasons} {series.seasons === 1 ? "Season" : "Seasons"}
          </span>
        </div>
      </div>
    </Link>
  );
}
