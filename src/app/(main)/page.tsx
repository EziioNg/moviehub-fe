import Hero from "@/components/Hero";
import FeatureMovies from "@/components/categories/FeatureMovies";
import AdventureMovies from "@/components/categories/AdventureMovies";
import ActionMovies from "@/components/categories/ActionMovies";
import FantasyMovies from "@/components/categories/FantasyMovies";
import SciFiMovies from "@/components/categories/SciFiMovies";
import XenoMovies from "@/components/categories/XenoMovies";

export default function Home() {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 transition-colors duration-200">
      <Hero />
      <div className="bg-slate-200 dark:bg-slate-700 transition-colors duration-200">
        <FeatureMovies />
        <AdventureMovies />
        <ActionMovies />
        <FantasyMovies />
        <SciFiMovies />
        <XenoMovies />
      </div>
    </div>
  );
}
