import { Github } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-transparent font-body z-10 relative">
      {/* Logo */}
      <div className="text-2xl font-bold text-primary"><a href="/">Avent</a></div>

      {/* Menu */}
      <ul className="flex space-x-8 text-white">
        <li className="hover:text-primary cursor-pointer border-b-2 border-primary">
          Home
        </li>
        <a href="#features"><li className="hover:text-primary cursor-pointer">Features</li></a>
        <a href="#dashboard"> <li className="hover:text-primary cursor-pointer">DashBoard</li></a>
      </ul>

      {/* Button */}
      <button>
       <a
              href="https://github.com/Riteshcodeit/Avent" // replace with your repo
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-neutral-700 transition border border-neutral-700"
            >
              <Github className="w-5 h-5" />
              GitHub Repo
            </a>
      </button>
    </nav>
  );
}
