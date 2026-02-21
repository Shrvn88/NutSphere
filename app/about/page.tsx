import Link from 'next/link'

export const metadata = {
  title: 'About Us - NutSphere',
  description: 'Learn about NutSphere - The Sphere of Superfoods. Premium quality dry fruits, nuts, and seeds delivered to your doorstep.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-green-600">NutSphere</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              The Sphere of Superfoods — delivering premium quality dry fruits, nuts, 
              and seeds to health-conscious families across India.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                Our Story
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                From Farm to Your Table
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  NutSphere Agrocomm was founded with a simple yet powerful vision — to bring 
                  the finest, most authentic dry fruits and superfoods directly from trusted 
                  sources to Indian households.
                </p>
                <p>
                  We believe that everyone deserves access to pure, unadulterated nutrition. 
                  That's why every product at NutSphere goes through rigorous quality checks 
                  to ensure you receive only the best.
                </p>
                <p>
                  Our commitment to hygiene, freshness, and honest pricing has made us a 
                  trusted name among health-conscious consumers who refuse to compromise 
                  on quality.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-green-100 rounded-full blur-3xl opacity-50" />
              <div className="relative bg-gradient-to-br from-green-50 to-amber-50 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600 mt-1">Natural Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">FSSAI</div>
                    <div className="text-sm text-gray-600 mt-1">Certified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">Fresh</div>
                    <div className="text-sm text-gray-600 mt-1">Always</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">Pure</div>
                    <div className="text-sm text-gray-600 mt-1">Quality</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at NutSphere
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is carefully selected and 
                tested to meet our high standards before reaching your hands.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Love</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. Your satisfaction 
                and trust drive us to constantly improve and deliver excellence.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                We believe in honest business practices. From sourcing to pricing, 
                we maintain complete transparency with our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-green-100 leading-relaxed">
                To make premium quality superfoods accessible to every Indian household, 
                promoting healthier lifestyles through pure, natural, and honestly-priced 
                dry fruits, nuts, and seeds.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-amber-100 leading-relaxed">
                To become India's most trusted superfood brand, known for uncompromising 
                quality, sustainable practices, and a genuine commitment to customer health 
                and satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FSSAI Certification */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Government Certified
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  FSSAI Certified for Your Safety
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  NutSphere is certified by the Food Safety and Standards Authority of India (FSSAI), 
                  ensuring that all our products meet the highest standards of food safety and quality.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">License Number:</div>
                  <div className="text-xl font-bold font-mono text-green-600">11525048000250</div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">FSSAI Certified</p>
                  <p className="text-sm text-gray-600 mt-1">Food Safety Assured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Experience the NutSphere Difference
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join thousands of health-conscious families who trust NutSphere for their daily nutrition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

