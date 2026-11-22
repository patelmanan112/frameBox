import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { getTopTenMovies, getTopTenSeries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Top Rated",
  description:
    "The ten films and ten series ranked highest by FrameBox critics and readers.",
};

type TopRatedSearchParams = Promise<{ type?: string | string[] }>;

export default function TopRatedPage({
  searchParams,
}: {
  searchParams: TopRatedSearchParams;
}) {
  const topMovies = getTopTenMovies();

  return (
    <>
      <PageHero
        kicker="The canon"
        title="Top Rated"
        subtitle="Ten films. Ten series. Ranked by our editorial score and the weight of reader response."
        image={topMovies[0]?.backdropUrl}
      />

      <div className="container" style={{ paddingTop: 8, paddingBottom: 40 }}>
        <Suspense
          fallback={
            <div className="empty-state">
              <p className="empty-text">Loading the ranking…</p>
            </div>
          }
        >
          <Rankings searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function Rankings({
  searchParams,
}: {
  searchParams: TopRatedSearchParams;
}) {
  const { type } = await searchParams;
  const active = type === "series" ? "series" : "movie";
  const items = active === "movie" ? getTopTenMovies() : getTopTenSeries();

  return (
    <>
      <div className="tabs" style={{ marginBottom: 28 }}>
        <Link
          href="/top-rated?type=movie"
          className={`tab ${active === "movie" ? "active" : ""}`}
        >
          Films
        </Link>
        <Link
          href="/top-rated?type=series"
          className={`tab ${active === "series" ? "active violet" : ""}`}
        >
          Series
        </Link>
      </div>

      <div className="toprated-list">
        {items.map((item, index) => {
          const isSeries = "seasons" in item;
          return (
            <Link
              key={item._id}
              href={`/${active === "movie" ? "movies" : "series"}/${item._id}`}
              className="toprated-row"
            >
              <div className="toprated-rank">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="toprated-poster">
                <Image
                  src={item.posterUrl}
                  alt={`${item.title} poster`}
                  fill
                  sizes="88px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div>
                <h2 className="toprated-title">{item.title}</h2>
                <div className="toprated-meta">
                  <span>{item.year}</span>
                  <span className="movie-card-dot" aria-hidden="true" />
                  <span>
                    {isSeries
                      ? `${item.seasons} ${
                          item.seasons === 1 ? "season" : "seasons"
                        }`
                      : `${item.runtime} min`}
                  </span>
                  <span className="movie-card-dot" aria-hidden="true" />
                  <span>{isSeries ? item.status : item.language}</span>
                </div>
                <p className="toprated-desc">{item.description}</p>
              </div>

              <div className="toprated-side">
                <div
                  className={`toprated-score ${
                    active === "series" ? "violet" : ""
                  }`}
                >
                  {item.rating.toFixed(1)}
                </div>
                <div className="toprated-reviews">
                  {item.reviewCount.toLocaleString("en-US")} reviews
                </div>
                <span className="toprated-arrow">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
