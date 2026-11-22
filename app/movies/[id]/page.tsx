import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tv } from "lucide-react";
import MovieDetailHero from "@/components/movie/MovieDetailHero";
import CastGrid from "@/components/movie/CastGrid";
import MovieReviewSection from "@/components/movie/MovieReviewSection";
import {
  getAllMovies,
  getMovieById,
  getReviewsForContent,
} from "@/lib/data";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllMovies().map((movie) => ({ id: movie._id }));
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = getMovieById(id);

  if (!movie) {
    return { title: "Film not found" };
  }

  return {
    title: movie.title,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description,
      images: [
        {
          url: new URL(
            movie.backdropUrl,
            process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
          ).toString(),
        },
      ],
    },
  };
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = getMovieById(id);

  if (!movie) {
    notFound();
  }

  const reviews = getReviewsForContent(movie._id);

  return (
    <>
      <MovieDetailHero movie={movie} />

      <div className="container detail-body">
        <div className="detail-layout">
          <div>
            <section className="detail-section">
              <h2 className="detail-heading">Synopsis</h2>
              <p className="detail-text">{movie.longDescription}</p>
            </section>

            <section className="detail-section">
              <h2 className="detail-heading">Cast</h2>
              <CastGrid cast={movie.cast} />
            </section>

            <section className="detail-section" id="reviews">
              <MovieReviewSection
                initialReviews={reviews}
                contentId={movie._id}
                contentTitle={movie.title}
                contentType="movie"
                averageRating={movie.rating}
              />
            </section>
          </div>

          <aside>
            <div className="info-panel">
              <div className="info-row">
                <span className="info-label">Director</span>
                <span className="info-value">{movie.director}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Released</span>
                <span className="info-value">{movie.year}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Runtime</span>
                <span className="info-value">{movie.runtime} min</span>
              </div>
              <div className="info-row">
                <span className="info-label">Language</span>
                <span className="info-value">{movie.language}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Genres</span>
                <span className="info-value">{movie.genre.join(", ")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Rating</span>
                <span className="info-value">{movie.rating.toFixed(1)} / 10</span>
              </div>
              <div className="info-row">
                <span className="info-label">Reviews</span>
                <span className="info-value">
                  {movie.reviewCount.toLocaleString("en-US")}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Top ten</span>
                <span className="info-value">#{movie.topTenRank}</span>
              </div>

              <div style={{ marginTop: 18 }}>
                <span className="info-label">Where to watch</span>
                <div className="stream-list">
                  {movie.streamingOn.map((service) => (
                    <span key={service} className="stream-pill">
                      <Tv size={13} aria-hidden="true" />
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
