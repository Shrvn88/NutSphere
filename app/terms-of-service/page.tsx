import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - NutSphere',
  description: 'Read the terms and conditions for using NutSphere Agrocomm services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Terms of <span className="text-green-600">Service</span>
            </h1>
            <p className="text-lg text-gray-600">
              NUTSPHERE AGROCOMM
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-8">
              Welcome to NUTSPHERE AGROCOMM. By accessing or using our website, you agree to the following Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. About Us</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              NUTSPHERE AGROCOMM "NUTSPHERE" provides premium quality dry fruits, nuts, seeds, and related products through our online platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Website Use</h2>
            <p className="text-gray-600 leading-relaxed mb-4">By using our website, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Provide accurate and complete information while placing orders</li>
              <li>Use the website only for lawful and genuine purchase purposes</li>
              <li>Not misuse, copy, or interfere with the website content or functionality</li>
              <li>Not attempt unauthorized access to any part of the website</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              We reserve the right to restrict or terminate access if misuse is detected.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Product Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We aim to provide accurate product descriptions, images, pricing, and availability details.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">However:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Minor variations in color, size, or packaging may occur</li>
              <li>Product availability may change without prior notice</li>
              <li>Pricing errors, if any, may be corrected at our discretion</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              We reserve the right to cancel any order due to incorrect pricing or stock issues.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Orders & Payments</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>Orders are confirmed only after successful payment confirmation</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>In case of cancellation after payment, the refund will be processed to the original payment method</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Shipping & Delivery</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>Delivery timelines are estimates and may vary</li>
              <li>Delays due to logistics or unforeseen circumstances may occur</li>
              <li>Customers must provide complete and accurate delivery details</li>
              <li>We are not responsible for delays caused by incorrect address details</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Returns & Refunds</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>Returns and refunds are handled as per our Return Policy available on the website</li>
              <li>Products that are opened, damaged due to misuse, or tampered with may not be eligible for return</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">All content on this website, including:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Brand name</li>
              <li>Logo</li>
              <li>Product images</li>
              <li>Designs</li>
              <li>Text content</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              belongs to NUTSPHERE AGROCOMM. Unauthorized use, copying, or reproduction is strictly prohibited.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Limitation of Responsibility</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We strive to ensure a smooth shopping experience. However, we are not responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Temporary website interruptions</li>
              <li>Technical errors beyond our control</li>
              <li>Delays caused by third-party logistics providers</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our maximum responsibility is limited to the value of the product purchased.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">9. Modifications</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We may update these Terms of Service at any time. Updated terms will be posted on this page. Continued use of the website means acceptance of updated terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">10. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For any questions regarding these Terms of Service, please contact:
            </p>
            <div className="bg-green-50 rounded-2xl p-6 mb-8">
              <p className="text-gray-600">
                Email: <a href="mailto:hello@nutsphere.com" className="text-green-600 hover:text-green-700">hello@nutsphere.com</a>
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
