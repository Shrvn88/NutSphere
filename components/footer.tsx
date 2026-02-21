import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 -mt-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logowithoutbg.png"
                alt="NutSphere - The Sphere of Superfoods"
                width={240}
                height={72}
                className="w-auto h-20"
                style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
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

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold mb-4">Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Shipping Policy
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
                  <Image src="/nuts.svg" alt="Nut" width={16} height={16} className="inline-block mr-1" /> Dry-Fruits & Nuts
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
                <a href="mailto:hello@nutsphere.com" className="text-gray-400 hover:text-green-500">
                  hello@nutsphere.com
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

      {/* Payment Methods & Social Media Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Payment Methods */}
          <div className="text-center mb-8">
            <h3 className="text-white font-semibold mb-4 text-lg">We Accept</h3>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* GPay */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center h-12 w-20">
                <span className="text-2xl font-bold text-blue-600">G</span>
                <span className="text-sm font-semibold text-gray-700">Pay</span>
              </div>
              
              {/* PhonePe */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center h-12 w-24">
                <span className="text-sm font-bold text-purple-600">PhonePe</span>
              </div>
              
              {/* Paytm */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center h-12 w-20">
                <span className="text-sm font-bold text-blue-600">Paytm</span>
              </div>
              
              {/* VISA */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center h-12 w-20">
                <span className="text-xl font-bold text-blue-800">VISA</span>
              </div>
              
              {/* Mastercard */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center h-12 w-24">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-red-500 opacity-80"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80 -ml-3"></div>
                </div>
              </div>
              
              {/* RuPay */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center h-12 w-20">
                <span className="text-sm font-bold text-green-600">RuPay</span>
              </div>
              
              {/* UPI */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center h-12 w-20">
                <span className="text-sm font-bold text-orange-600">UPI</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h3 className="text-white font-semibold mb-4 text-lg">Follow Us!</h3>
            <div className="flex items-center justify-center gap-4">
              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Twitter */}
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md"
              >
                <svg className="w-6 h-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md"
              >
                <svg className="w-6 h-6 text-transparent bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 bg-clip-text" fill="currentColor" viewBox="0 0 24 24" style={{fill: 'url(#instagram-gradient)'}}>
                  <defs>
                    <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#833AB4'}} />
                      <stop offset="50%" style={{stopColor: '#E1306C'}} />
                      <stop offset="100%" style={{stopColor: '#FD1D1D'}} />
                    </linearGradient>
                  </defs>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-blue-700 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-red-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
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
              <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-green-500">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-green-500">
                Terms of Service
              </Link>
              <Link href="/shipping-policy" className="text-sm text-gray-500 hover:text-green-500">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
