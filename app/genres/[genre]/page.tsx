import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import SeriesCard from "@/components/series/SeriesCard";
import {
  getAllGenres,
  getMoviesByGenre,
  getSeriesByGenre,
} from "@/lib/data";

type GenrePageProps = {
  params: Promise<{ genre: string }>;
};

export function generateStaticParams() {
  return getAllGenres().map((genre) => ({ genre }));
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { genre } = await params;
  const name = decodeURIComponent(genre);

  return {
    title: name,
    description: `Films and series in the ${name} genre, curated by FrameBox.`,
  };
}

export default async function GenreDetailPage({ params }: GenrePageProps) {
  const { genre } = await params;
  const name = decodeURIComponent(genre);
  const movies = getMoviesByGenre(name);
  const series = getSeriesByGenre(name);

  if (movies.length === 0 && series.length === 0) {
    notFound();
  }

  const backdrop = movies[0]?.backdropUrl ?? series[0]?.backdropUrl;

  return (
    <>
      <section className="genre-hero">
        {backdrop ? (
          <div className="genre-hero-bg">
            <Image
              src={backdrop}
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : null}
        <div className="genre-hero-shade" />
        <div className="container genre-hero-content">
          <p className="page-kicker">Genre</p>
          <h1 className="page-title">{name}</h1>
          <p className="page-sub">
            {movies.length} {movies.length === 1 ? "film" : "films"} and{" "}
            {series.length} {series.length === 1 ? "series" : "series"} in this
            collection.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 8 }}>
        {movies.length > 0 ? (
          <section className="section">
            <div className="section-head">
              <div>
                <h2 className="section-title">Films</h2>
                <p className="section-sub">
                  {movies.length} {movies.length === 1 ? "title" : "titles"}
                </p>
              </div>
              <Link href="/movies" className="section-link">
                All films
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="cards-grid">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        ) : null}

        {series.length > 0 ? (
          <section className="section">
            <div className="section-head">
              <div>
                <h2 className="section-title">Series</h2>
                <p className="section-sub">
                  {series.length} {series.length === 1 ? "title" : "titles"}
                </p>
              </div>
              <Link href="/series" className="section-link">
                All series
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="cards-grid">
              {series.map((item) => (
                <SeriesCard key={item._id} series={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
