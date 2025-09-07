
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-transparent font-body z-10 relative">
      {/* Logo */}
      <div className="text-2xl font-bold text-primary">Avent</div>

      {/* Menu */}
      <ul className="flex space-x-8 text-white">
        <li className="hover:text-primary cursor-pointer border-b-2 border-primary">
          Home
        </li>
        <li className="hover:text-primary cursor-pointer">Features</li>
        <li className="hover:text-primary cursor-pointer">Demo Preview</li>
      </ul>

      {/* Button */}
      <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-[#075555]">
       Github
      </button>
    </nav>
  );
}
