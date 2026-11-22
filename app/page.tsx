import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroCarousel from "@/components/home/HeroCarousel";
import HorizontalScroll from "@/components/home/HorizontalScroll";
import TopTenList from "@/components/home/TopTenList";
import FeaturedEditorial from "@/components/home/FeaturedEditorial";
import GenreGrid, { type GenreSummary } from "@/components/home/GenreGrid";
import MovieCard from "@/components/movie/MovieCard";
import {
  getAllGenres,
  getAllMovies,
  getGenreCount,
  getGenrePoster,
  getMovieById,
  getTopTenMovies,
} from "@/lib/data";

export default function HomePage() {
  const allMovies = getAllMovies();
  const heroMovies = [...allMovies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  const trending = [...allMovies].sort((a, b) => b.rating - a.rating);
  const topMovies = getTopTenMovies();
  const featured = getMovieById("movie_001") ?? topMovies[0];

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
      <HeroCarousel items={heroMovies} />

      <HorizontalScroll
        title="Trending Now"
        subtitle="The most-watched and highest-rated titles this week."
        href="/movies"
        linkLabel="Explore all"
      >
        {trending.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </HorizontalScroll>

      <TopTenList
        title="Top 10 Movies Today"
        subtitle="Ranked by critical acclaim, reader score, and streaming demand."
        href="/top-rated?type=movie"
        items={topMovies}
        type="movie"
      />

      <FeaturedEditorial movie={featured} />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">
                <Sparkles size={14} className="text-brand" />
                <span>CATEGORIES</span>
              </div>
              <h2 className="section-title">Explore Genres</h2>
              <p className="section-sub">
                Find your next watch across sci-fi, drama, action, and animation.
              </p>
            </div>
            <Link href="/genres" className="section-link">
              All genres
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <GenreGrid items={genres} limit={8} />
        </div>
      </section>
    </>
  );
}
