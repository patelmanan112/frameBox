import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import FilterableGrid from "@/components/movie/FilterableGrid";
import { getAllMovies } from "@/lib/data";
import type { Movie } from "@/types";

export const metadata: Metadata = {
  title: "Films",
  description:
    "Every film in the FrameBox collection, filterable by genre and sortable by rating, year, or title.",
};

type MoviesSearchParams = Promise<{ q?: string | string[] }>;

export default function MoviesPage({
  searchParams,
}: {
  searchParams: MoviesSearchParams;
}) {
  const movies = getAllMovies();

  return (
    <>
      <PageHero
        kicker="The collection"
        title="Films"
        subtitle="Ten films worth staying in for. Filter by genre, sort by what matters, and find the frame that stays with you."
        image={movies[0]?.backdropUrl}
      />

      <div className="container" style={{ paddingTop: 24 }}>
        <Suspense
          fallback={
            <div className="empty-state">
              <p className="empty-text">Loading the collection…</p>
            </div>
          }
        >
          <MoviesResults searchParams={searchParams} movies={movies} />
        </Suspense>
      </div>
    </>
  );
}

async function MoviesResults({
  searchParams,
  movies,
}: {
  searchParams: MoviesSearchParams;
  movies: Movie[];
}) {
  const { q } = await searchParams;
  const initialQuery = typeof q === "string" ? q : "";

  return (
    <FilterableGrid
      key={initialQuery}
      movies={movies}
      initialQuery={initialQuery}
    />
  );
}
