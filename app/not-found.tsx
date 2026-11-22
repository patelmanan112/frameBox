import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notfound">
      <div>
        <p className="notfound-code">404</p>
        <h1 className="notfound-title">This scene was cut</h1>
        <p className="notfound-text">
          The page you are looking for is not in the final edit.
        </p>
        <Link href="/" className="btn btn-gold">
          Back to FrameBox
        </Link>
      </div>
    </div>
  );
}
