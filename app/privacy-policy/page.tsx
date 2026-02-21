import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - NutSphere',
  description: 'Learn how NutSphere Agrocomm collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Privacy <span className="text-green-600">Policy</span>
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
              At NUTSPHERE AGROCOMM, your trust means everything to us. We are committed to maintaining the privacy, security, and confidentiality of your personal information. This Privacy Policy explains how we collect, use, and protect your data when you interact with our website or purchase our products.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We collect only the information necessary to provide you with a seamless and secure shopping experience. We do not sell, trade, or misuse your personal data.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-4">When you shop with us, we may collect:</p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Personal Details</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping and billing address</li>
              <li>Order history</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Payment Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>All payments are processed through secure and trusted payment partners.</li>
              <li>We do not store your card numbers, CVV, UPI PIN, or banking passwords.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Your information is used to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>Process and deliver your orders</li>
              <li>Send order confirmations and tracking updates</li>
              <li>Provide customer support</li>
              <li>Improve website functionality</li>
              <li>Ensure secure transactions</li>
              <li>Share promotional updates (only if you choose to receive them)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Data Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">We work with reliable service partners such as:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Delivery and logistics providers</li>
              <li>Payment processors</li>
              <li>Technical support providers</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              They receive only the information necessary to perform their services and are expected to maintain confidentiality.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We use cookies to improve your browsing experience, remember preferences, and analyze website traffic. You may disable cookies in your browser settings if you prefer.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              While no digital system is completely secure, we continuously work to safeguard your data.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Your Control</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You remain in control of your personal information. You may:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Request access to your data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              For assistance, contact us at: <a href="mailto:hello@nutsphere.com" className="text-green-600 hover:text-green-700">hello@nutsphere.com</a>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Updates to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We may update this Privacy Policy periodically to reflect improvements or operational changes. The latest version will always be available on this page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Contact</h2>
            <div className="bg-green-50 rounded-2xl p-6 mb-8">
              <p className="font-semibold text-gray-900 mb-2">NUTSPHERE AGROCOMM</p>
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

