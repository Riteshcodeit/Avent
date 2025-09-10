import { motion } from "framer-motion";
import SpotlightCard from "./ui/SpotlightCard";

const steps = [
  {
    title: "Fetch Data",
    description:
      "Ingests threat feeds from Blocklist.de, Spamhaus, and Digitalside OSINT.",
  },
  {
    title: "Store & Process",
    description:
      "Threat data is stored in React state with deduplication and filtering for accuracy.",
  },
  {
    title: "Visualize",
    description:
      "The dashboard displays threats with sorting, filtering, and real-time counts.",
  },
  {
    title: "Take Action",
    description:
      "Security teams can quickly identify and mitigate threats effectively.",
  },
];

const HowItWorkSection = () => {
  return (
    <div className="bg-black py-16 w-full ">
      <motion.h2
        className="text-5xl text-center md:text-6xl font-extrabold leading-tight font-heading 
                 bg-gradient-to-r from-white via-gray-300 to-gray-500 
                 bg-clip-text text-transparent"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        How It{" "}
        <span className="text-5xl md:text-6xl font-extrabold leading-tight font-heading text-green-500">
          Works
        </span>
      </motion.h2>

      {/* Steps Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
        {steps.map((step, index) => (
          <SpotlightCard
            key={index}
            className="custom-spotlight-card p-6 flex flex-col justify-between"
            spotlightColor="rgba(16, 185, 129, 1)"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Step {index + 1}: {step.title}
            </h3>
            <p className="text-gray-300 text-sm">{step.description}</p>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};

export default HowItWorkSection;
