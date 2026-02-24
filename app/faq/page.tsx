export default function FAQPage() {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn items in their original packaging. Please visit our Shipping & Returns page for more details."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you will receive an email with a tracking number. You can use this number to track your package on our website."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to select countries worldwide. Shipping costs and delivery times vary by location."
    },
    {
      question: "How should I care for my t-shirt?",
      answer: "We recommend washing your t-shirt inside out in cold water and hanging it to dry to preserve the fabric and print quality."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Apple Pay."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <h1 className="text-4xl font-playfair font-bold text-center" style={{ marginTop: '40px' }}>Frequently Asked Questions</h1>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8" style={{ marginTop: '40px' }}>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-8 last:border-0">
              <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
