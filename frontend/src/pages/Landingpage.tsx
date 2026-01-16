import React, { useState, useEffect } from 'react';
import { Code, Zap, Trophy, Users, Clock, TrendingUp } from 'lucide-react';
import SignupPage from './Signuppage.tsx';
import { Navigate, useNavigate } from 'react-router';

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Real-time Coding",
      description: "Code together in a powerful IDE with syntax highlighting and instant feedback"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Live Leaderboard",
      description: "See who's ahead with real-time rankings based on speed and accuracy"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Get immediate test results and performance metrics after submission"
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "10K+", label: "Active Users" },
    { icon: <Clock className="w-6 h-6" />, value: "50K+", label: "Battles Fought" },
    { icon: <TrendingUp className="w-6 h-6" />, value: "95%", label: "Satisfaction" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden fixed inset-0 overflow-y-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Code className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodeBattle
          </span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm">
          <a href="#" className="hover:text-purple-400 transition">Features</a>
          <a href="#" className="hover:text-purple-400 transition">How it Works</a>
          <a href="#" className="hover:text-purple-400 transition">Pricing</a>
        </div>
        <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center space-y-8">
          <div className="inline-block">
            <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/30">
              🚀 The Ultimate Coding Competition Platform
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Code. Compete.
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Conquer.
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Challenge your friends in real-time coding battles. Write code, submit solutions, and climb the leaderboard to prove you're the ultimate developer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105">
              Start Battle
              <Zap className="inline-block ml-2 w-5 h-5 group-hover:animate-bounce" />
            </button>
            <button className="border-2 border-purple-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-500/10 transition">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center transform hover:scale-105 transition"
            >
              <div className="flex justify-center mb-3 text-purple-400">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why CodeBattle?</h2>
          <p className="text-gray-400 text-lg">Everything you need for competitive coding</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`bg-white/5 backdrop-blur-lg border rounded-xl p-8 transform transition-all duration-500 hover:scale-105 ${
                activeFeature === idx ? 'border-purple-500 shadow-lg shadow-purple-500/30' : 'border-white/10'
              }`}
            >
              <div className={`mb-4 text-purple-400 transition-transform duration-500 ${activeFeature === idx ? 'scale-110' : ''}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg">Get started in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Create Session", desc: "Invite your friend and select a coding challenge" },
            { step: "02", title: "Code Together", desc: "Write code simultaneously in our powerful IDE" },
            { step: "03", title: "View Results", desc: "Submit and see who wins on the leaderboard" }
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-purple-500 transition">
                <div className="text-6xl font-bold text-purple-500/30 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
              {idx < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/10 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Battling?</h2>
          <p className="text-gray-300 text-lg mb-8">Join thousands of developers competing daily</p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105">
            Launch Your First Battle
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>&copy; 2025 CodeBattle. Built for developers who love to compete.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;