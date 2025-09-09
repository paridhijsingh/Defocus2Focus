import React from 'react';

/**
 * Modern Animated Welcome Screen for Defocus2Focus
 * Features: Full-screen logo background, animated text, floating icons, smooth transitions
 */
const WelcomeScreen = ({ onGetStarted, onLearnMore }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6">
      {/* Full-screen logo background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://defocus2focus.netlify.app/assets/logo/defocus2focus-hero-v3.png?v=4)',
            backgroundSize: 'cover',
            filter: 'blur(2px)'
          }}
        />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Animated App Title */}
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Defocus2Focus
            </span>
          </h1>
        </div>

        {/* Animated Tagline */}
        <div className="animate-fade-in-up [animation-delay:200ms]">
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-12 font-light">
            Focus Better. Play Smarter. Grow Daily.
          </p>
        </div>

        {/* Animated Get Started Button */}
        <div className="animate-fade-in-up [animation-delay:400ms]">
          <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-12 py-4 sm:px-16 sm:py-5 rounded-full font-bold text-lg sm:text-xl text-white shadow-2xl transition-all duration-500 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 hover:shadow-blue-500/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/50"
            aria-label="Get Started"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Focus Icon */}
        <div className="absolute top-20 left-10 animate-float [animation-delay:0s]">
          <svg className="w-8 h-8 text-blue-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>

        {/* Play Icon */}
        <div className="absolute top-32 right-16 animate-float [animation-delay:1s]">
          <svg className="w-10 h-10 text-purple-400/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>

        {/* Pen Icon */}
        <div className="absolute bottom-32 left-20 animate-float [animation-delay:2s]">
          <svg className="w-9 h-9 text-pink-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>

        {/* Target Icon */}
        <div className="absolute bottom-20 right-12 animate-float [animation-delay:3s]">
          <svg className="w-7 h-7 text-green-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Brain Icon */}
        <div className="absolute top-1/2 left-8 animate-float [animation-delay:4s]">
          <svg className="w-6 h-6 text-yellow-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        {/* Clock Icon */}
        <div className="absolute top-1/3 right-8 animate-float [animation-delay:5s]">
          <svg className="w-8 h-8 text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-pink-500/20 to-orange-500/20 blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl animate-pulse [animation-delay:4s]" />
      </div>
    </div>
  );
};

export default WelcomeScreen;


