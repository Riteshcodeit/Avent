import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bell,
  Shield,
  FileText,
  Settings,
} from "lucide-react";

const features = [
  {
    id: "dashboard",
    title: "Threat Feed Dashboard",
    desc: "Interactive view of IPs, Subnets & URLs with filters.",
    icon: LayoutDashboard,
    media: "maangic-mountains-dark.png", // replace with your image/video path
    type: "image",
  },
  {
    id: "alerts",
    title: "Real-time Alerts",
    desc: "Get instant notifications for high-severity threats.",
    icon: Bell,
    media: "roadmaps-dark.mp4",
    type: "video",
  },
  {
    id: "analyzer",
    title: "IOC Analyzer",
    desc: "Drill down into threat data with detailed metadata.",
    icon: Shield,
    media: "battlepass-rewards-dark.png",
    type: "image",
  },
  {
    id: "reports",
    title: "Reports & Exports",
    desc: "Generate PDF/CSV reports & share securely.",
    icon: FileText,
    media: "ai-analyzer-demo-dark.mp4",
    type: "video",
  },
  {
    id: "config",
    title: "Custom Configurations",
    desc: "Set refresh intervals, dark mode & custom views.",
    icon: Settings,
    media: "ai-quiz-demo-dark.mp4",
    type: "video",
  },
];

const FeaturesSection = () => {
  // your code here
  const [active, setActive] = useState(features[0]);

  return (
    <section className="w-full bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-12">
        {/* Heading Section */}
        <motion.div
          className="flex flex-col items-center text-center"
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <button className="px-5 py-2 bg-gradient-to-b from-[#111321] to-[#0C1C28] border-neutral-700 rounded-full text-green-400 text-sm font-medium mb-4">
            Our Features
          </button>
          <motion.h2
            className="text-5xl md:text-6xl font-extrabold leading-tight font-heading 
               bg-gradient-to-r from-white via-gray-300 to-gray-500 
               bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Smarter Tools for{" "}
            <span
              className="text-5xl md:text-6xl font-extrabold leading-tight font-heading 
               bg-gradient-to-r text-green-500
               bg-clip-text "
            >
              Learning & Upskilling
            </span>
          </motion.h2>
        </motion.div>

        {/* Features Layout */}
        <div className="flex flex-col md:flex-row gap-10 w-full">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-black border border-amber-100 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-4">Explore Features</h3>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => setActive(f)}
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-xl transition 
                  ${
                    active.id === f.id
                      ? "bg-green-600 text-white"
                      : "bg-neutral-800 hover:bg-neutral-700"
                  }`}
                  >
                    <f.icon className="w-5 h-5" />
                    <span>{f.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 bg-black border border-amber-100 rounded-2xl p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-3xl font-bold text-green-500">
                    {active.title}
                  </h2>
                  <p className="text-neutral-300 mt-2">{active.desc}</p>
                </div>

                {/* Media Preview */}
                <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-800">
                  {active.type === "image" ? (
                    <img
                      src={active.media}
                      alt={active.title}
                      className="w-full h-[400px] object-cover"
                    />
                  ) : (
                    <video
                      src={active.media}
                      autoPlay
                      loop
                      muted
                      className="w-full h-[400px] object-cover"
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
