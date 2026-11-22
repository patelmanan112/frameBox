import Link from "next/link";
import {
  AtSign,
  Camera,
  Play,
  ThumbsUp,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

const explore = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/genres", label: "Genres" },
  { href: "/top-rated", label: "Top Rated" },
];

const discover = [
  { href: "/top-rated?type=movie", label: "Top ten films" },
  { href: "/top-rated?type=series", label: "Top ten series" },
  { href: "/genres/Drama", label: "Drama" },
  { href: "/genres/Sci-Fi", label: "Sci-Fi" },
];

const socials = [
  { href: "https://instagram.com", label: "Instagram", Icon: Camera },
  { href: "https://x.com", label: "X", Icon: AtSign },
  { href: "https://youtube.com", label: "YouTube", Icon: Play },
  { href: "https://facebook.com", label: "Facebook", Icon: ThumbsUp },
];

export default function Footer() {
  const year = 2026;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="stream-logo" aria-label="FrameBox home">
              <Logo size="md" />
            </Link>
            <p>
              An independent journal for people who stay through the credits.
              Curated reviews, honest rankings, and the craft behind every
              frame.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            {explore.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Discover</h4>
            {discover.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:hello@framebox.example">hello@framebox.example</a>
            <a href="mailto:hello@framebox.example?subject=Suggest%20a%20title">
              Suggest a title
            </a>
            <a href="mailto:press@framebox.example">Press enquiries</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} FrameBox. All rights reserved.</span>
          <div className="footer-socials">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="footer-social"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
