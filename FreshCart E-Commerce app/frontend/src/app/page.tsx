import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromiseBand } from "@/components/home/PromiseBand";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoryTiles />
        <FeaturedProducts />
        <PromiseBand />
      </main>
      <Footer />
    </>
  );
}
