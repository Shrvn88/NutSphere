import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy - NutSphere',
  description: 'Learn about NutSphere Agrocomm shipping and delivery policies.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Shipping <span className="text-green-600">Policy</span>
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
              Thank you for shopping with NUTSPHERE AGROCOMM. We are committed to delivering your products safely and efficiently.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Order Processing</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>Orders are processed within 1–3 business days after payment confirmation.</li>
              <li>Orders placed on weekends or public holidays will be processed on the next working day.</li>
              <li>You will receive a confirmation email once your order is shipped.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Delivery Timeline</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>Estimated delivery time: 3–7 business days depending on location.</li>
              <li>Delivery timelines may vary due to logistics, weather conditions, or high-demand periods.</li>
              <li>Remote locations may require additional delivery time.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Shipping Charges</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>Shipping charges (if applicable) will be displayed at checkout.</li>
              <li>Free shipping may be offered during promotions or above certain order values.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Cash on Delivery (COD) Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To maintain smooth operations and reduce unnecessary order returns, the following conditions apply to COD orders:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>COD is available only for selected locations.</li>
              <li>COD may be available only up to a specific order value (as displayed at checkout).</li>
              <li>A small additional COD handling fee may apply.</li>
              <li>We reserve the right to restrict COD for customers with repeated order cancellations or returns.</li>
              <li>Orders confirmed via COD may require telephonic or SMS verification before dispatch.</li>
              <li>Failure to respond to verification may result in order cancellation.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Address & Delivery Responsibility</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
              <li>Customers must provide complete and accurate delivery details.</li>
              <li>We are not responsible for delays or non-delivery due to incorrect address or contact information.</li>
              <li>If delivery is unsuccessful due to customer unavailability, re-delivery charges may apply.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Damaged or Tampered Packages</h2>
            <p className="text-gray-600 leading-relaxed mb-4">If you receive:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>A damaged package</li>
              <li>A tampered parcel</li>
              <li>An open seal</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              Please refuse delivery or contact us immediately with photos at:{' '}
              <a href="mailto:hello@nutsphere.com" className="text-green-600 hover:text-green-700">hello@nutsphere.com</a>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Order Tracking</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Once shipped, tracking details will be shared via email or SMS. Customers can track orders through the courier partner's website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Delivery Delays</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              While we strive for timely delivery, delays caused by logistics partners, weather, or unforeseen circumstances are beyond our direct control.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">9. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For shipping-related queries, contact us at:
            </p>
            <div className="bg-green-50 rounded-2xl p-6 mb-8">
              <p className="text-gray-600">
                📧 <a href="mailto:hello@nutsphere.com" className="text-green-600 hover:text-green-700">hello@nutsphere.com</a>
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

