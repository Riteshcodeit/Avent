import { Github, PlayCircle, Linkedin,  } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
        {/* Call to Action */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to explore the <span className="text-green-500">dashboard?</span>
          </h2>
          <div className="flex gap-4 mt-6 justify-center">
            <a
              href="#dashboard" // replace with actual demo link
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-500 transition"
            >
              <PlayCircle className="w-5 h-5" />
              View DashBoard
            </a>
            <a
              href="https://github.com/Riteshcodeit/Avent" // replace with your repo
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-neutral-800 text-white font-medium rounded-xl hover:bg-neutral-700 transition border border-neutral-700"
            >
              <Github className="w-5 h-5" />
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/ritesh-dussani-253728286/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-md bg-neutral-900 hover:bg-neutral-700 transition"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-neutral-800" />

        {/* Bottom Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400 gap-4">
          <p>
            © 2024 Securifide. All rights reserved. Made with{" "}
            <span className="text-red-500">♥</span> for learners worldwide by{" "}
            <span className="text-green-500 font-medium">Securifide</span>
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms and Conditions
            </a>
            <a href="#" className="hover:text-white">
              Refund Policy
            </a>
            <a href="#" className="hover:text-white">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
