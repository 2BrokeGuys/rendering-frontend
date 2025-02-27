import Link from "next/link"
import {  Twitter, Linkedin, Send } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">RenderPro</h3>
            <p className="text-gray-400">
              Revolutionizing the world of rendering with lightning-fast speed and unparalleled quality.
            </p>
          </div>

          {/* Sitemap */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Sitemap</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter />
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 flex-grow"
              />
              <button type="submit" className="bg-lime hover:bg-darklime px-4 py-2 rounded-r-md transition-colors text-black">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RenderPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

