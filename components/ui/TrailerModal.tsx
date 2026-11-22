"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/,
  );
  return match
    ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`
    : null;
}

type TrailerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  title: string;
};

export default function TrailerModal({
  isOpen,
  onClose,
  trailerUrl,
  title,
}: TrailerModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const embedUrl = getYoutubeEmbedUrl(trailerUrl);

  return (
    <div
      className="trailer-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} Trailer`}
    >
      <div
        className="trailer-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trailer-modal-header">
          <div className="trailer-modal-title">
            <span className="trailer-modal-kicker">NOW SCREENING</span>
            <h3>{title}</h3>
          </div>
          <div className="trailer-modal-actions">
            <a
              href={trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="trailer-modal-ext"
              title="Open on YouTube"
            >
              <ExternalLink size={16} />
            </a>
            <button
              type="button"
              className="trailer-modal-close"
              onClick={onClose}
              aria-label="Close trailer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="trailer-modal-player">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="trailer-modal-fallback">
              <p>Direct preview unavailable in player.</p>
              <a
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold btn-sm"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
