import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, MessageCircle, X, Clock, Mail, ChevronRight, Zap, Shield, Smartphone, Check, Lock } from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Login State
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'model',
      text: "👋 Welcome to Nexus Solutions! I'm your AI assistant. How can I help you explore our services today?"
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  // --- API INTEGRATION (The Brain) ---
  const fetchGeminiResponse = async (chatHistory) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const BUSINESS_CONTEXT = `
      You are NexusBot, the official customer support AI for "Nexus Solutions".
      Always be polite, professional, and concise. 
      Business Info: We provide AI automation, custom web development, and digital marketing.
      Pricing: Starter Plan is $49/mo, Pro is $99/mo, Enterprise is Custom.
      Working Hours: 9AM - 6PM EST. Email: hello@nexussolutions.com.
    `;

    const formattedContents = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: { parts: [{ text: BUSINESS_CONTEXT }] }
        })
      });
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      return "I apologize, our systems are busy. Please email hello@nexussolutions.com.";
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = { id: Date.now(), sender: 'user', text: inputValue.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    const botResponseText = await fetchGeminiResponse([...messages, newUserMessage]);

    setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'model', text: botResponseText }]);
    setIsLoading(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail.includes('@')) {
      setIsLoggedIn(true);
      setShowLogin(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-x-hidden selection:bg-blue-200 scroll-smooth">

      {/* --- LOGIN MODAL --- */}
      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-[fadeInUp_0.2s_ease-out]">
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-6 h-6" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-600/20">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-center text-slate-500 mb-8 text-sm">Enter your credentials to access your dashboard.</p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-4">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 font-extrabold text-2xl tracking-tight cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          Nexus
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <a href="#products" className="hover:text-blue-600 transition-colors">Products</a>
          <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#resources" className="hover:text-blue-600 transition-colors">Resources</a>
        </div>

        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <span className="text-sm font-medium text-slate-500 hidden sm:block">Hello, {loginEmail.split('@')[0]}</span>
              <button className="bg-slate-100 text-slate-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-200 transition-all border border-slate-200">
                My Dashboard
              </button>
              <button onClick={() => setIsLoggedIn(false)} className="text-sm font-semibold text-red-500 hover:text-red-700">
                Log out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="hidden md:block text-sm font-semibold text-slate-600 hover:text-blue-600">Log in</button>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">
                Get Started Free
              </button>
            </>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Next-Gen AI is Here
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.1] mb-8">
          Build the future with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500"> Intelligent Automation</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Empower your business with a seamless, AI-driven platform. Look at the bottom right to see our AI Support Agent in action!
        </p>
      </section>

      {/* --- PRODUCTS & FEATURES SECTION --- */}
      <section id="products" className="py-24 bg-white border-y border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Everything you need to scale</h2>
            <p className="text-lg text-slate-500 mt-4">Powerful products designed for modern, high-performing teams.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Zap className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Chatbot Widget</h3>
              <p className="text-slate-600 leading-relaxed">Embed our commercially trained AI onto your site in minutes. Automate 80% of customer inquiries instantly.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6"><Shield className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure CRM</h3>
              <p className="text-slate-600 leading-relaxed">A central hub for all your customer data. Bank-grade encryption ensures your privacy is always protected.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-6"><Smartphone className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mobile Analytics</h3>
              <p className="text-slate-600 leading-relaxed">Track user engagement, sales, and AI interactions from our beautifully designed mobile application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOLUTIONS SECTION --- */}
      <section id="solutions" className="py-24 bg-slate-900 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">Tailored solutions for every industry.</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">Whether you are running a fast-paced e-commerce store or managing a healthcare clinic, our AI models are trained to handle your specific business logic and terminology.</p>
            <ul className="space-y-4">
              {['E-Commerce & Retail Support', 'SaaS Onboarding Automation', 'Real Estate Lead Generation', 'Healthcare Appointment Booking'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-blue-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <pre className="text-sm text-blue-300 font-mono relative z-10 overflow-x-auto">
              {`// Seamless Integration Example
import { NexusAI } from '@nexus/react';

export default function App() {
  return (
    <NexusAI 
      apiKey="your_api_key"
      theme="dark"
      commercialTraining={true}
      fallbackEmail="support@company.com"
    />
  );
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500 mt-4">Start for free, upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for small projects and blogs.</p>
              <div className="mb-6"><span className="text-4xl font-extrabold text-slate-900">$49</span><span className="text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Up to 1,000 AI chats/mo</li>
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Basic analytics</li>
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Email support</li>
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-900 font-bold hover:border-slate-300 transition-all">Start Free Trial</button>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-600 p-8 rounded-3xl border border-blue-500 shadow-xl shadow-blue-600/20 flex flex-col transform md:-translate-y-4 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-blue-200 text-sm mb-6">For scaling businesses and agencies.</p>
              <div className="mb-6"><span className="text-4xl font-extrabold text-white">$99</span><span className="text-blue-200">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-white"><Check className="w-5 h-5 text-cyan-300 shrink-0" /> Unlimited AI chats</li>
                <li className="flex gap-3 text-sm text-white"><Check className="w-5 h-5 text-cyan-300 shrink-0" /> Advanced training context</li>
                <li className="flex gap-3 text-sm text-white"><Check className="w-5 h-5 text-cyan-300 shrink-0" /> Custom widget branding</li>
                <li className="flex gap-3 text-sm text-white"><Check className="w-5 h-5 text-cyan-300 shrink-0" /> Priority 24/7 support</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-slate-50 transition-all shadow-md">Get Started Now</button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">Custom solutions for massive scale.</p>
              <div className="mb-6"><span className="text-4xl font-extrabold text-slate-900">Custom</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Dedicated database cluster</li>
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Custom AI model fine-tuning</li>
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-5 h-5 text-blue-500 shrink-0" /> SLA guarantees</li>
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-900 font-bold hover:border-slate-300 transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- RESOURCES & FOOTER --- */}
      <footer id="resources" className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-2xl mb-4"><Sparkles className="w-5 h-5 text-blue-500" /> Nexus</div>
            <p className="max-w-sm leading-relaxed text-sm">Building the bridge between complex artificial intelligence and user-friendly web experiences. Deployed globally, loved by developers.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Community Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm border-t border-slate-800 pt-8 mt-8">
          © 2026 Nexus Solutions. Created and Deployed by you. All rights reserved.
        </div>
      </footer>


      {/* ========================================= */}
      {/* 🤖 FLOATING CHATBOT WIDGET                */}
      {/* ========================================= */}

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        <div className={`bg-white w-[calc(100vw-2rem)] sm:w-[380px] h-[600px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 pointer-events-none absolute bottom-16 right-0'}`}>
          <div className="bg-slate-900 text-white px-5 py-4 rounded-t-2xl flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg"><Bot className="w-5 h-5" /></div>
              <div>
                <h2 className="font-bold text-md leading-tight tracking-tight">Nexus Support</h2>
                <div className="flex items-center gap-1.5 text-slate-300 text-xs mt-0.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Replies instantly</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex justify-between text-[10px] text-slate-500 font-medium shrink-0 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 9AM - 6PM EST</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> hello@nexus.com</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scroll-smooth">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}>
                {message.sender === 'model' && (<div className="w-7 h-7 shrink-0 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 mt-1"><Sparkles className="w-3.5 h-3.5 text-blue-600" /></div>)}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-sm whitespace-pre-wrap leading-relaxed'}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 shrink-0 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 mt-1"><Bot className="w-3.5 h-3.5 text-blue-600" /></div>
                <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-white border-t border-slate-200 rounded-b-2xl shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Message Support..." className="flex-1 max-h-24 min-h-[40px] bg-transparent resize-none outline-none p-2 text-sm text-slate-700 placeholder:text-slate-400" rows={1} />
              <button type="submit" disabled={isLoading || !inputValue.trim()} className="p-2 mb-0.5 mr-0.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-sm"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className={`bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center border border-slate-700`}>
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 fill-current" />}
        </button>
      </div>

      {/* Animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
    </div>
  );
}