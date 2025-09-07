import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorkSection from "./components/HowItWorkSection";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-black ">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowItWorkSection />
      <Dashboard/>
      <Footer />
    </div>
  );
}

export default App;
