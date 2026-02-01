import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                <span className="text-white">Nut</span>
                <span className="text-gray-400">Sphere</span>
              </span>
              <span className="text-xs text-green-500 font-medium tracking-wider mt-1">
                THE SPHERE OF SUPERFOODS
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Premium quality dry fruits, nuts, and seeds. Hygienically packed and delivered fresh to your doorstep.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-green-900/50 text-green-400 text-xs font-medium rounded-full">
                FSSAI Certified
              </span>
              <span className="px-3 py-1 bg-green-900/50 text-green-400 text-xs font-medium rounded-full">
                GST Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=nuts" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  🥜 Nuts
                </Link>
              </li>
              <li>
                <Link href="/products?category=seeds" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  🌱 Seeds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">
                  H.NO 84, Shivkalyan Nagar Loha<br />
                  Dist-Nanded, Maharashtra<br />
                  Pincode - 431708
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:Hello@nutsphere.com" className="text-gray-400 hover:text-green-500">
                  Hello@nutsphere.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+918766500291" className="text-gray-400 hover:text-green-500">+91 87665 00291</a>
              </li>
            </ul>
            
            {/* FSSAI License */}
            <div className="mt-6 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500">FSSAI License No.</p>
              <p className="text-sm text-white font-mono">1121599900840</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} NutSphere Agrocomm. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-green-500">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-green-500">
                Terms of Service
              </Link>
              <Link href="/shipping" className="text-sm text-gray-500 hover:text-green-500">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
