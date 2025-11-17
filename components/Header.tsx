
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm py-6 text-center border-b border-gray-700/50 sticky top-0 z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          ImGui on WSL Guide
        </span>
      </h1>
      <p className="mt-3 text-lg text-gray-300 max-w-2xl mx-auto">
        Your AI-powered guide to building C++ GUI applications on Linux with Windows.
      </p>
    </header>
  );
};

export default Header;
