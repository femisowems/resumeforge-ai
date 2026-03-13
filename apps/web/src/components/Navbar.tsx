"use client";

import React from 'react';
import Link from 'next/link';
import { Cpu, Zap, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black font-outfit text-white tracking-tight leading-none">
              ResumeForge<span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase mt-0.5">
              by starterdev.io
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
          <Link href="/examples" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Templates</Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <Link 
            href="/upload" 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            Get Started
            <Zap className="w-4 h-4 fill-current" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            <Link href="/#features" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-400">Features</Link>
            <Link href="/examples" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-400">Templates</Link>
            <Link 
              href="/upload" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl text-lg font-bold"
            >
              Get Started
              <Zap className="w-4 h-4 fill-current" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
