import Image from "next/image";

type PageHeroProps = {
  kicker: string;
  title: string;
  subtitle: string;
  image?: string;
};

export default function PageHero({
  kicker,
  title,
  subtitle,
  image,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      {image ? (
        <div className="page-hero-bg">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 25%" }}
          />
          <div className="page-hero-shade" />
        </div>
      ) : null}
      <div className="container page-hero-content">
        <span className="page-hero-kicker">{kicker}</span>
        <h1 className="page-hero-title">{title}</h1>
        <p className="page-hero-sub">{subtitle}</p>
      </div>
    </section>
  );
}
