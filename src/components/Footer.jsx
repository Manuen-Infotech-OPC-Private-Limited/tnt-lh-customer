import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Coffee } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-16 border-t mt-auto bg-[#052e16] border-emerald-900/40 text-emerald-100/70">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                {/* Upper grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#064e3b]">
                    
                    {/* Brand Info */}
                    <div className="md:col-span-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <Coffee className="w-6 h-6 text-emerald-400" />
                            <span className="text-lg font-black uppercase tracking-[0.2em] text-emerald-50">
                                Teas N Trees
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed max-w-xs text-emerald-200/60">
                            Where nature meets your perfect cup. Experience curated teas, rich single-origin coffees, and dining in Guntur's finest garden sanctuary.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-200">
                            Discover
                        </h4>
                        <ul className="space-y-2 text-xs font-semibold">
                            <li>
                                <Link to="/menu" className="transition-colors hover:text-emerald-400">
                                    Our Menu
                                </Link>
                            </li>
                            <li>
                                <Link to="/seasonal" className="transition-colors hover:text-emerald-400">
                                    Seasonal Specials
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="transition-colors hover:text-emerald-400">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="transition-colors hover:text-emerald-400">
                                    Gallery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Legals */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-200">
                            Support & Legal
                        </h4>
                        <ul className="space-y-2 text-xs font-semibold">
                            <li>
                                <Link to="/contact" className="transition-colors hover:text-emerald-400">
                                    Contact Support
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="transition-colors hover:text-emerald-400">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Direct Contact info */}
                    <div className="md:col-span-4 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-200">
                            Visit Us
                        </h4>
                        <div className="space-y-3 text-xs text-emerald-200/80">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>Teas N Trees, Sy No. 248, Near Collectorate, Guntur</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>+91 98765 12345</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>contact@teasntrees.in</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/40">
                    <p>© {new Date().getFullYear()} Teas N Trees Cafe. All rights reserved.</p>
                    <p className="text-[11px] uppercase tracking-wider text-emerald-400/80">Garden Sanctuary & Specialty Dining</p>
                </div>
            </div>
        </footer>
    );
}
