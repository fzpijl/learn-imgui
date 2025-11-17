
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm py-6 text-center border-b border-gray-700/50 sticky top-0 z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          ImGui on WSL 入门教程
        </span>
      </h1>
      <p className="mt-3 text-lg text-gray-300 max-w-2xl mx-auto">
        一个为 Web 开发者准备的 C++ GUI 应用入门指南。
      </p>
    </header>
  );
};

export default Header;
