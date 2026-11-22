import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import GenreGrid, { type GenreSummary } from "@/components/home/GenreGrid";
import {
  getAllGenres,
  getAllMovies,
  getGenreCount,
  getGenrePoster,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Genres",
  description:
    "Browse the FrameBox collection by genre, from drama and science fiction to crime, romance, and satire.",
};

export default function GenresPage() {
  const genres: GenreSummary[] = getAllGenres()
    .map((name) => ({
      name,
      count: getGenreCount(name),
      posterUrl: getGenrePoster(name),
    }))
    .filter((genre) => genre.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <PageHero
        kicker="Find your frame"
        title="Genres"
        subtitle="Every story has a shape. Browse the collection by genre and follow the thread that pulls you in."
        image={getAllMovies()[0]?.backdropUrl}
      />

      <div className="container" style={{ paddingTop: 24 }}>
        <section className="section" style={{ paddingTop: 8 }}>
          <GenreGrid items={genres} />
        </section>
      </div>
    </>
  );
}
