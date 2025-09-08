import React from 'react';

/**
 * Responsive Welcome Screen for the web app (React + TailwindCSS)
 * Background: deep navy (#0A1B3A)
 * - Centered logo at the top
 * - Main heading and subheading
 * - Primary and secondary actions with subtle hover animations
 * - Uses gradient accents matching the brand logo
 */
const WelcomeScreen = ({ onGetStarted, onLearnMore, logoSrc = 'https://defocus2focus.netlify.app/assets/logo/defocus2focus-hero-v3.png?v=4', logoAlt = 'Defocus2Focus' }) => {
  return (
    <div className="min-h-screen w-full bg-[#0A1B3A] text-white flex flex-col items-center px-6">
      {/* Logo */}
      <div className="w-full flex flex-col items-center pt-16 sm:pt-20 md:pt-24 animate-fade-in-up">
        <img
          src={logoSrc}
          alt={logoAlt}
          className="h-24 w-auto sm:h-28 md:h-32 drop-shadow-[0_6px_18px_rgba(59,130,246,0.35)]"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = 'https://defocus2focus.netlify.app/assets/logo/defocus2focus-icon.svg?v=4';
          }}
        />
      </div>

      {/* Headings */}
      <div className="mt-6 sm:mt-8 md:mt-10 text-center max-w-2xl animate-fade-in-up [animation-delay:120ms]">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui' }}>
          Welcome to <span className="logo-gradient-text">Defocus2Focus</span>!
        </h1>
        <p className="mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-indigo-100/90">
          Your journey from distraction to clarity begins here.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center animate-fade-in-up [animation-delay:220ms]">
        {/* Primary: Get Started (gradient fill) */}
        <button
          onClick={onGetStarted}
          className="group inline-flex items-center justify-center px-7 py-3 sm:px-8 sm:py-3.5 rounded-full font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 hover:scale-[1.03] hover:shadow-pink-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/70"
          aria-label="Get Started"
        >
          <span className="mr-2">Get Started</span>
          <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L12 6.414V17a1 1 0 11-2 0V6.414L5.707 10.707A1 1 0 114.293 9.293l6-6z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Secondary: Learn More (transparent with gradient border) */}
        <div className="p-[2px] rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
          <button
            onClick={onLearnMore}
            className="inline-flex items-center justify-center px-7 py-3 sm:px-8 sm:py-3.5 rounded-full font-semibold text-white/90 bg-[#0A1B3A] hover:scale-[1.03] hover:bg-[#0A1B3A]/90 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/70"
            aria-label="Learn More"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none select-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -right-12 sm:-right-16 md:-right-24 top-24 sm:top-20 md:top-24 h-56 w-56 sm:h-72 sm:w-72 md:h-96 md:w-96 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 animate-float" />
        <div className="absolute -left-16 sm:-left-20 md:-left-32 bottom-12 h-48 w-48 sm:h-64 sm:w-64 md:h-80 md:w-80 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-float [animation-delay:400ms]" />
      </div>
    </div>
  );
};

export default WelcomeScreen;


