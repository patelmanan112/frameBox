import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import FilterableSeriesGrid from "@/components/series/FilterableSeriesGrid";
import { getAllSeries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Series",
  description:
    "Every series in the FrameBox collection, filterable by genre and status.",
};

export default function SeriesPage() {
  const series = getAllSeries();

  return (
    <>
      <PageHero
        kicker="The small screen"
        title="Series"
        subtitle="Long-form storytelling with the ambition of cinema. Filter by genre and status to find your next binge."
        image={series[0]?.backdropUrl}
      />

      <div className="container" style={{ paddingTop: 24 }}>
        <FilterableSeriesGrid series={series} />
      </div>
    </>
  );
}
