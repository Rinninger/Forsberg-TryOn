
import React from 'react';
import { WardrobeIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-zinc-900 shadow-lg border-b border-zinc-800">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-center">
        <WardrobeIcon className="w-10 h-10 mr-4 text-white" />
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          FORSBERG Virtual Try-On
        </h1>
      </div>
    </header>
  );
};

export default Header;