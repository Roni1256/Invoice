import React, { useState } from "react";
import { Menu, X, FileText, Zap, Shield, Download, ArrowRight, Check, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate=useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Your Original Header - Unchanged */}
      <header className="flex items-center justify-between lg:pt-10 lg:px-30 px-5 bg-surface py-4">
        <div className="flex items-center gap-4">
          <img src="logo.png" alt="logo" className="w-1/5" />
          <h1 className="text-2xl lg:text-3xl text-primary-dark">Billing</h1>
        </div>
        <nav className="items-center justify-evenly w-1/3 hidden lg:flex">
          <a href="#" className="link-primary">Home</a>
          <a href="#works" className="link-primary">How It Works</a>
          <a href="#about" className="link-primary">About</a>
          <a href="#contact" className="link-primary">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="button-primary text-sm lg:text-md text-nowrap flex items-center justify-center gap-2" onClick={()=>navigate('authenticate')}>Get Started <ChevronRight/></button>
          <button className="button-secondary lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {!isMenuOpen ? <Menu /> : <X />}
          </button>
        </div>
        <div
          className="flex flex-col gap-5 absolute top-20 right-5 bg-surface p-5 rounded-lg shadow-lg lg:hidden w-1/2 border border-gray-300 z-50"
          style={{ display: isMenuOpen ? "flex" : "none" }}
        >
          <a href="#" className="link-primary" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#works" className="link-primary" onClick={() => setIsMenuOpen(false)}>How It Works</a>
          <a href="#about" className="link-primary" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#contact" className="link-primary" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {/* Hero Section */}
        <section className="lg:px-30 px-5 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
                Simple Invoice Generator for Your Business
              </h1>
              <p className="text-lg lg:text-xl text-text-secondary mb-8 leading-relaxed">
                Create professional invoices quickly and easily. Fill in your details, customize the layout, and download as PDF. No signup required for basic features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 text-lg font-medium shadow-lg" onClick={()=>navigate("authenticate")}>
                  <span>Create Invoice</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-surface text-primary px-8 py-4 rounded-lg border-2 border-primary hover:bg-primary/5 transition text-lg font-medium">
                  See Example
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>Download as PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>Professional templates</span>
                </div>
              </div>
            </div>

            {/* Right Content - Invoice Mockup */}
            <div className="relative">
              <div className="bg-surface rounded-2xl shadow-2xl p-6 lg:p-8 border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="h-6 bg-primary/20 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </div>

                  <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-primary/30 rounded w-20"></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                      <div className="h-3 bg-primary/30 rounded w-20"></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="h-3 bg-gray-200 rounded w-36"></div>
                      <div className="h-3 bg-primary/30 rounded w-20"></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-primary">
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gray-300 rounded w-24 font-bold"></div>
                      <div className="h-6 bg-primary rounded w-28"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-light/30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="works" className="bg-surface py-16 lg:py-24 lg:px-30 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-4">
                How It Works
              </h2>
              <p className="text-lg lg:text-xl text-text-secondary">
                Create your invoice in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Enter Details</h3>
                <p className="text-text-secondary">
                  Fill in your business information, client details, and invoice items with quantities and prices.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Customize Design</h3>
                <p className="text-text-secondary">
                  Choose from professional templates, add your logo, and adjust colors to match your brand.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Download & Send</h3>
                <p className="text-text-secondary">
                  Download your invoice as a PDF and send it to your client via email or print it directly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 lg:px-30 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-4">
                Key Features
              </h2>
              <p className="text-lg lg:text-xl text-text-secondary">
                Everything you need to create professional invoices
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-xl hover:bg-primary/5 transition-all duration-300 group border border-transparent hover:border-border">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300">
                  <Zap className="w-7 h-7 text-primary group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Quick Generation</h3>
                <p className="text-text-secondary">
                  Generate invoices instantly with our simple form interface.
                </p>
              </div>

              <div className="p-6 rounded-xl hover:bg-primary/5 transition-all duration-300 group border border-transparent hover:border-border">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300">
                  <Download className="w-7 h-7 text-primary group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">PDF Export</h3>
                <p className="text-text-secondary">
                  Download your invoices as high-quality PDF files ready to send.
                </p>
              </div>

              <div className="p-6 rounded-xl hover:bg-primary/5 transition-all duration-300 group border border-transparent hover:border-border">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300">
                  <FileText className="w-7 h-7 text-primary group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Custom Templates</h3>
                <p className="text-text-secondary">
                  Choose from multiple professional invoice templates.
                </p>
              </div>

              <div className="p-6 rounded-xl hover:bg-primary/5 transition-all duration-300 group border border-transparent hover:border-border">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300">
                  <Shield className="w-7 h-7 text-primary group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Privacy First</h3>
                <p className="text-text-secondary">
                  Your data stays private. No information is stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="about" className="bg-surface py-16 lg:py-24 lg:px-30 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-6">
              Ready to Create Your Invoice?
            </h2>
            <p className="text-lg lg:text-xl text-text-secondary mb-8">
              Start creating professional invoices for your business today
            </p>
            <button className="bg-primary text-white px-10 py-4 rounded-lg hover:bg-primary-dark transition text-lg font-medium shadow-lg"
            onClick={()=>navigate("authenticate")}
            >
              Create Your First Invoice
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-primary-dark text-white py-12 lg:px-30 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Billing</span>
              </div>
              <p className="text-primary-light text-sm">
                A simple tool to create professional invoices for your business.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Features</h4>
              <ul className="space-y-2 text-primary-light text-sm">
                <li><a href="#" className="hover:text-white transition">Invoice Generator</a></li>
                <li><a href="#" className="hover:text-white transition">Templates</a></li>
                <li><a href="#" className="hover:text-white transition">PDF Export</a></li>
                <li><a href="#" className="hover:text-white transition">Customization</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-primary-light text-sm">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-2 text-primary-light text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary pt-8 text-center text-primary-light text-sm">
            <p>© 2025 Billing Invoice Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;