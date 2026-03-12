"use client";

import React from 'react';
import Link from 'next/link';
import { Cpu, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black font-outfit text-white tracking-tight">
                ResumeForge<span className="text-indigo-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The professional AI resume builder designed to help engineers and tech professionals land interviews at top companies.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-800">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-800">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-800">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/#features" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Features</Link></li>
              <li><Link href="/examples" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Templates</Link></li>
              <li><Link href="/upload" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Resume Builder</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Blog</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Careers</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} ResumeForge AI. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-current" /> for the engineering community.
          </p>
        </div>
      </div>
    </footer>
  );
}
