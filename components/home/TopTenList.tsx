"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Star } from "lucide-react";
import type { Movie, Series } from "@/types";

type TopTenListProps = {
  title: string;
  subtitle?: string;
  href: string;
  items: (Movie | Series)[];
  type: "movie" | "series";
};

export default function TopTenList({
  title,
  subtitle,
  href,
  items,
  type,
}: TopTenListProps) {
  return (
    <section className="section top-ten-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">
              <Flame size={15} className="text-brand" />
              <span>TOP 10 LEADERBOARD</span>
            </div>
            <h2 className="section-title">{title}</h2>
            {subtitle ? <p className="section-sub">{subtitle}</p> : null}
          </div>
          <Link href={href} className="section-link">
            Full Ranking
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="topten-scroll-container">
          <div className="topten-scroll-track">
            {items.map((item, index) => {
              const rank = index + 1;
              const isSeries = "seasons" in item;

              return (
                <Link
                  key={item._id}
                  href={`/${type === "movie" ? "movies" : "series"}/${item._id}`}
                  className="topten-item"
                >
                  <div className="topten-number-wrap">
                    <span className="topten-number">{rank}</span>
                  </div>

                  <div className="topten-card">
                    <div className="topten-poster-wrap">
                      <Image
                        src={item.posterUrl}
                        alt={`${item.title} poster`}
                        fill
                        sizes="180px"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="topten-overlay">
                        <span className="topten-badge">
                          <Star size={11} fill="currentColor" />
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="topten-details">
                      <div className="topten-name">{item.title}</div>
                      <div className="topten-subtext">
                        {isSeries ? `${item.seasons} Seasons` : `${item.runtime}m`} • {item.genre[0]}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
