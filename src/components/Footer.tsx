import Link from "next/link";
import { Ticket, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { G } from "@react-pdf/renderer";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            EventHorizon
          </div>
          <p className="text-sm leading-relaxed">
            The next generation of live event ticketing. Secure, seamless, and
            built for experiences that matter.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="https://x.com/Jedediah_xo"
              className="hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com/Jay963-sys"
              className="hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://linkedin.com/in/ogbekhilu-osaro"
              className="hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-white font-bold mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/events"
                className="hover:text-blue-400 transition-colors"
              >
                Browse Events
              </Link>
            </li>
            <li>
              <Link
                href="/events?category=music"
                className="hover:text-blue-400 transition-colors"
              >
                Concerts
              </Link>
            </li>
            <li>
              <Link
                href="/events?category=tech"
                className="hover:text-blue-400 transition-colors"
              >
                Tech Meetups
              </Link>
            </li>
            <li>
              <Link
                href="/events?category=sports"
                className="hover:text-blue-400 transition-colors"
              >
                Sports
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-white font-bold mb-4">Organizers</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/organizer"
                className="hover:text-blue-400 transition-colors"
              >
                Host an Event
              </Link>
            </li>
            <li>
              <Link
                href="/organizer"
                className="hover:text-blue-400 transition-colors"
              >
                Organizer Dashboard
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Success Stories
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        <p>
          &copy; {new Date().getFullYear()} EventHorizon Inc. All rights
          reserved.
        </p>
        <p className="italic">
          <Link
            href="https://jay-dev-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="
    font-medium
    underline
    underline-offset-4
    decoration-neutral-600
    hover:decoration-white
    hover:text-white
    transition-colors
  "
          >
            Designed by Jay
          </Link>
        </p>
      </div>
    </footer>
  );
}
