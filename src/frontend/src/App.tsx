import { BreakingNewsTicker } from "./components/BreakingNewsTicker";
import { EditorsPicks } from "./components/EditorsPicks";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSlider } from "./components/HeroSlider";
import { LatestNews } from "./components/LatestNews";

export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0b0b0b" }}>
      {/* Sticky header */}
      <Header />

      {/* Breaking news ticker */}
      <BreakingNewsTicker />

      {/* Main content */}
      <main>
        {/* Hero + Editor's Picks section */}
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Hero Slider (70%) */}
            <div className="flex-1 min-w-0">
              <HeroSlider />
            </div>

            {/* Editor's Picks (30%) */}
            <div className="lg:w-[320px] shrink-0">
              <EditorsPicks />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="h-px" style={{ backgroundColor: "#2d2d2d" }} />
        </div>

        {/* Latest News section */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <LatestNews />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
