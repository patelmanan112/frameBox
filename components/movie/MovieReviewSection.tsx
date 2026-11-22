"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, MessageSquarePlus, Star, ThumbsUp, X } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import type { Review } from "@/types";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

function getRatingSentiment(score: number): string {
  if (score === 10) return "Masterpiece";
  if (score >= 9) return "Extraordinary";
  if (score >= 8) return "Great";
  if (score >= 7) return "Good";
  if (score >= 5) return "Average";
  return "Disappointing";
}

type ReviewSectionProps = {
  initialReviews: Review[];
  contentId: string;
  contentTitle: string;
  contentType?: "movie" | "series";
  averageRating: number;
};

export default function ReviewSection({
  initialReviews,
  contentId,
  contentTitle,
  contentType = "movie",
  averageRating,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window === "undefined") return initialReviews;
    try {
      const saved =
        localStorage.getItem(`framebox_reviews_${contentId}`) ||
        localStorage.getItem(`cineverse_reviews_${contentId}`);
      if (saved) {
        const customReviews: Review[] = JSON.parse(saved);
        if (customReviews.length > 0) {
          const customIds = new Set(customReviews.map((r) => r._id));
          const filteredInitial = initialReviews.filter((r) => !customIds.has(r._id));
          return [...customReviews, ...filteredInitial];
        }
      }
    } catch {
      // ignore
    }
    return initialReviews;
  });

  const [liked, setLiked] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const savedLikes =
        localStorage.getItem(`framebox_likes_${contentId}`) ||
        localStorage.getItem(`cineverse_likes_${contentId}`);
      if (savedLikes) {
        return JSON.parse(savedLikes);
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [formOpen, setFormOpen] = useState(false);
  const [submittedBanner, setSubmittedBanner] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [rating, setRating] = useState(9);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleToggleLike = (reviewId: string) => {
    setLiked((prev) => {
      const next = { ...prev, [reviewId]: !prev[reviewId] };
      try {
        localStorage.setItem(`framebox_likes_${contentId}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !name.trim()) return;

    const newReview: Review = {
      _id: `user_${Date.now()}`,
      contentId,
      contentType,
      author: name.trim(),
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(name.trim())}`,
      rating,
      title: title.trim(),
      body: body.trim(),
      date: new Date().toISOString(),
      likes: 0,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);

    // Persist user reviews in localStorage
    try {
      const storageKey = `framebox_reviews_${contentId}`;
      const existingSaved =
        localStorage.getItem(storageKey) ||
        localStorage.getItem(`cineverse_reviews_${contentId}`);
      const prevCustom: Review[] = existingSaved ? JSON.parse(existingSaved) : [];
      localStorage.setItem(storageKey, JSON.stringify([newReview, ...prevCustom]));
    } catch {
      // ignore
    }

    // Reset form
    setName("");
    setTitle("");
    setBody("");
    setFormOpen(false);
    setSubmittedBanner(true);
    setTimeout(() => setSubmittedBanner(false), 5000);
  };

  return (
    <div className="review-section-root">
      <div className="section-head" style={{ marginBottom: 16 }}>
        <div>
          <h2 className="detail-heading" style={{ marginBottom: 0 }}>
            Community & Editorial Reviews
          </h2>
          <p className="section-sub">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"} ·
            average {averageRating.toFixed(1)} / 10
          </p>
        </div>
      </div>

      {submittedBanner && (
        <div className="review-success-banner">
          <CheckCircle2 size={18} className="text-green" />
          <span>Your review for <strong>{contentTitle}</strong> has been published!</span>
        </div>
      )}

      {/* CTA Box to write review */}
      <div className="write-review-card">
        <div className="write-review-prompt">
          <div className="write-review-icon">
            <MessageSquarePlus size={22} />
          </div>
          <div>
            <div className="write-review-title">Have thoughts on this {contentType}?</div>
            <p className="write-review-sub">
              Share your critique with thousands of cinephiles on FrameBox.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-brand btn-sm"
          onClick={() => setFormOpen((prev) => !prev)}
        >
          {formOpen ? "Close Form" : "Write a Review"}
        </button>
      </div>

      {/* Form Drawer */}
      {formOpen && (
        <form onSubmit={handleSubmit} className="review-form-container">
          <div className="review-form-head">
            <div>
              <h3>Publish a Review</h3>
              <p className="review-form-sub">For &ldquo;{contentTitle}&rdquo;</p>
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setFormOpen(false)}
              aria-label="Close form"
            >
              <X size={16} />
            </button>
          </div>

          <div className="review-form-grid">
            <div>
              <label className="form-label">Your Name / Handle</label>
              <input
                type="text"
                className="form-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CinemaLover"
              />
            </div>

            <div>
              <label className="form-label">
                Rating: <strong className="text-gold">★ {rating} / 10</strong> ({getRatingSentiment(rating)})
              </label>
              <div className="rating-select-wrap">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="rating-range"
                />
                <span className="rating-pill-display">★ {rating}/10</span>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Review Headline</label>
            <input
              type="text"
              className="form-input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. A visual tour de force with unmatched pacing"
            />
          </div>

          <div>
            <label className="form-label">Detailed Critique</label>
            <textarea
              className="form-textarea"
              rows={4}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What made it stand out? Mention the direction, cinematography, performances, or sound design..."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm">
              Publish Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews Feed */}
      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">No reviews yet</div>
          <p className="empty-text">Be the first to share your critique for {contentTitle}.</p>
        </div>
      ) : (
        <div className="reviews">
          {reviews.map((review) => {
            const isLiked = Boolean(liked[review._id]);
            return (
              <article key={review._id} className="review-card">
                <div className="review-head">
                  <div className="review-avatar">
                    <Image
                      src={review.avatarUrl || "https://i.pravatar.cc/150"}
                      alt={review.author}
                      fill
                      sizes="44px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <div className="review-author">{review.author}</div>
                    <div className="review-date">{formatDate(review.date)}</div>
                  </div>
                  <div className="review-stars">
                    <StarRating rating={review.rating / 2} size={14} />
                    <span className="review-score-tag">★ {review.rating}/10</span>
                  </div>
                </div>

                <h3 className="review-title">{review.title}</h3>
                <p className="review-body">{review.body}</p>

                <div className="review-foot">
                  <button
                    type="button"
                    className={`review-like ${isLiked ? "active" : ""}`}
                    aria-pressed={isLiked}
                    onClick={() => handleToggleLike(review._id)}
                  >
                    <ThumbsUp
                      size={14}
                      fill={isLiked ? "currentColor" : "none"}
                    />
                    {review.likes + (isLiked ? 1 : 0)} helpful
                  </button>
                  <span className="verified-badge">
                    <Star size={11} fill="currentColor" /> Verified reader
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
