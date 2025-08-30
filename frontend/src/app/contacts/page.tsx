'use client';

import type React from 'react';

import Header from '@/components/header';
import Footer from '@/components/footer';
import {
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Plus,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What charities can I give to?',
      answer:
        'Through our platform, you can support various charitable causes including education, healthcare, clean water initiatives, disaster relief, and community development programs. We partner with verified organizations to ensure your donations make a real impact.',
    },
    {
      question: 'Is there a minimum/maximum amount I can donate?',
      answer:
        'There is no minimum donation amount required. Every contribution, no matter the size, makes a meaningful difference. For maximum amounts, please contact us directly for large donations to ensure proper processing and recognition.',
    },
    {
      question: 'Can I give to more than one charity?',
      answer:
        "You can support multiple causes and charities through our platform. Simply select the different campaigns you&apos;d like to support and allocate your donation amounts accordingly.",
    },
    {
      question: 'When will my charity receive my donation?',
      answer:
        "Donations are typically processed and transferred to the respective charities within 3-5 business days after your payment is confirmed. You'll receive a confirmation email with tracking information.",
    },
    {
      question: 'Will my chosen charity receive all my donation?',
      answer:
        'We ensure that the maximum amount possible goes directly to your chosen charity. A small processing fee may apply to cover transaction costs, but this is clearly disclosed before you complete your donation.',
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Home</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-black font-medium">Contact Us</span>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
          Every Act of Kindness Counts
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Have questions about our mission, need help with donations, or want to get involved? 
          We&apos;re here to help you make a meaningful impact in the lives of those who need it most. 
          Reach out to us and let&apos;s work together to create positive change.
        </p>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info Card */}
          <div className="bg-black text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">
              Share love,
              <br />
              donate hope.
            </h2>
            <p className="text-gray-300 mb-8 text-sm">
              Connect with us to learn more about our ongoing projects and how you can make a difference.
            </p>

            <div className="space-y-6">
              <div>
                <p className="font-semibold mb-2 text-sm">
                  8911 Tanglewood Ave.
                </p>
                <p className="text-gray-300 text-sm">
                  Capital Heights, MD 20743
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span>+863-267-3634</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="break-all">charity@email.net</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>Mon-Fri: 8:00am - 6:00pm</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Twitter className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full h-32 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold w-full"
              >
                SEND MESSAGE
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="w-full h-64 bg-gradient-to-r from-gray-600 to-orange-400 rounded-lg">
          <div className="w-full h-full flex items-center justify-center text-white">
            <span className="text-lg">Interactive Map Location</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold text-black mb-4">
              Frequently
              <br />
              Asked
              <br />
              Questions
            </h2>
            <p className="text-gray-600">
              At eu lobortis pretium tincidunt amet lacus ut senean aliquet
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between py-4 text-left gap-4"
                >
                  <span className="text-base md:text-lg font-semibold text-gray-900 flex-1">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <X className="w-5 h-5 md:w-6 md:h-6 text-orange-500 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="pb-4">
                    <p className="text-gray-600 leading-relaxed text-sm pr-8">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
