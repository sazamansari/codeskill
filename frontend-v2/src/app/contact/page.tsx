"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-20" />
      <div className="absolute top-0 inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions about CodeSkill or want to integrate our platform into your institution? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-card/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-black/5 border border-border/50 flex items-start gap-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-2">Our friendly team is here to help.</p>
                <a href="mailto:support@evolvian.in" className="text-primary hover:underline font-medium">support@evolvian.in</a>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-black/5 border border-border/50 flex items-start gap-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Office</h3>
                <p className="text-sm text-muted-foreground mb-2">Come say hello at our HQ.</p>
                <span className="text-foreground font-medium">Evolvian Headquarters<br/>Bangalore, India</span>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-black/5 border border-border/50 flex items-start gap-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <p className="text-sm text-muted-foreground mb-2">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+919876543210" className="text-primary hover:underline font-medium">+91 98765 43210</a>
              </div>
            </div>
            
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-card/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl shadow-black/5 border border-border/50 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground max-w-md text-lg">
                    Thank you for reaching out to Evolvian. Our team will get back to you within 24-48 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold rounded-full hover:scale-105 transition-transform"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        required 
                        className="w-full h-12 bg-transparent border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" 
                        placeholder="John" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        required 
                        className="w-full h-12 bg-transparent border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" 
                        placeholder="Doe" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required 
                      className="w-full h-12 bg-transparent border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" 
                      placeholder="john@example.com" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                    <textarea 
                      id="message" 
                      required 
                      rows={5} 
                      className="w-full p-4 bg-transparent border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none" 
                      placeholder="How can we help you?" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                  >
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
