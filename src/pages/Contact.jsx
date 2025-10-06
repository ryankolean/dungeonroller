import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SendEmail } from "@/api/integrations";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await SendEmail({
        from_name: formData.name,
        to: "info@summitsoftwaresolutions.dev",
        subject: `DungeonRoller Contact - ${formData.category}`,
        body: `
From: ${formData.name} (${formData.email})
Category: ${formData.category}

Message:
${formData.message}
        `
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", category: "general", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send message. Please try emailing us directly at info@summitsoftwaresolutions.dev");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="parchment p-8 sm:p-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-6" style={{ fontFamily: 'var(--font-header)' }}>
            Contact Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-header)' }}>
                Summit Software Solutions LLC
              </h2>
              <div className="space-y-4 text-amber-900/90">
                <div className="bg-amber-800/10 p-6 rounded-lg border border-amber-800/20">
                  <p className="font-bold mb-2 text-lg">📧 Contact Us</p>
                  <p className="mb-3 text-amber-800/80">
                    For all inquiries including general questions, technical support, legal matters, and privacy concerns:
                  </p>
                  <a 
                    href="mailto:info@summitsoftwaresolutions.dev" 
                    className="text-xl text-amber-700 hover:text-amber-900 font-semibold"
                  >
                    info@summitsoftwaresolutions.dev
                  </a>
                </div>
                
                <div className="bg-gradient-to-br from-amber-800/5 to-amber-900/5 p-4 rounded-lg border border-amber-800/10">
                  <p className="text-sm text-amber-800/70">
                    <strong>Response Time:</strong> We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-header)' }}>
                Send us a Message
              </h2>
              
              {submitted ? (
                <div className="bg-green-100 border border-green-300 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">Message Sent!</h3>
                  <p className="text-green-800">We'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-green-700 hover:text-green-900 font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">Your Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="medieval-input"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">Your Email *</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="medieval-input"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="medieval-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="legal">Legal Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">Your Message *</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className="medieval-textarea h-32"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-scroll w-full h-14 text-lg"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="text-center pt-8 border-t-2 border-amber-800/30">
            <p className="text-lg text-amber-900/80" style={{ fontFamily: 'var(--font-fantasy)' }}>
              "We're here to help you on your adventure!"
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}