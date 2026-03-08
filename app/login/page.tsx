"use client"

import { useState } from "react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true)
    window.location.href = `/api/auth/${provider}`
  }

  return (
    <main className="min-h-screen victorian-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gold particles overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--victorian-gold)] rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-[var(--victorian-gold)] rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[var(--victorian-gold)] rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-[var(--victorian-gold)] rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-[var(--victorian-gold)] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Victorian Login Card */}
      <div 
        className="w-full max-w-md bg-[var(--victorian-cream)] rounded-lg shadow-2xl relative transform hover:scale-[1.02] transition-all duration-500 ease-out"
        style={{
          border: '4px solid var(--victorian-gold)',
          boxShadow: '0 20px 60px rgba(114, 47, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.3)',
          animation: 'cardLift 0.8s ease-out'
        }}
      >
        {/* Decorative corner flourishes */}
        <div className="absolute -top-3 -left-3 w-12 h-12" style={{
          borderTop: '3px solid var(--victorian-gold)',
          borderLeft: '3px solid var(--victorian-gold)',
          borderRadius: '8px 0 0 0'
        }}></div>
        <div className="absolute -top-3 -right-3 w-12 h-12" style={{
          borderTop: '3px solid var(--victorian-gold)',
          borderRight: '3px solid var(--victorian-gold)',
          borderRadius: '0 8px 0 0'
        }}></div>
        <div className="absolute -bottom-3 -left-3 w-12 h-12" style={{
          borderBottom: '3px solid var(--victorian-gold)',
          borderLeft: '3px solid var(--victorian-gold)',
          borderRadius: '0 0 0 8px'
        }}></div>
        <div className="absolute -bottom-3 -right-3 w-12 h-12" style={{
          borderBottom: '3px solid var(--victorian-gold)',
          borderRight: '3px solid var(--victorian-gold)',
          borderRadius: '0 0 8px 0'
        }}></div>

        {/* Inner gold accent border */}
        <div className="absolute inset-3" style={{
          border: '1px solid var(--victorian-bronze)',
          borderRadius: '4px',
          opacity: 0.5
        }}></div>

        <div className="p-10 relative z-10">
          {/* Victorian Header */}
          <div className="text-center mb-10">
            <h1 className="victorian-heading text-5xl mb-3" style={{
              color: 'var(--victorian-burgundy)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              Image Search
            </h1>
            <p className="font-lato text-lg" style={{ color: 'var(--victorian-bronze)' }}>
              Victorian Edition
            </p>
            
            {/* Ornate divider */}
            <div className="flex items-center justify-center my-6">
              <div className="h-px flex-1" style={{ 
                background: 'linear-gradient(to right, transparent, var(--victorian-gold), transparent)',
                height: '2px'
              }}></div>
              <div className="mx-4" style={{ color: 'var(--victorian-gold)', fontSize: '20px' }}>❧</div>
              <div className="h-px flex-1" style={{ 
                background: 'linear-gradient(to right, transparent, var(--victorian-gold), transparent)',
                height: '2px'
              }}></div>
            </div>

            <p className="font-lato" style={{ color: 'var(--victorian-charcoal)', fontSize: '15px' }}>
              Sign in to explore and save images
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-5">
            {/* Google Button */}
            <button
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-lg font-lato font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4"
              style={{
                background: 'linear-gradient(135deg, var(--victorian-cream) 0%, var(--victorian-antique-white) 100%)',
                border: '2px solid var(--victorian-gold)',
                color: 'var(--victorian-burgundy)',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4), 0 0 15px rgba(212, 175, 55, 0.3)'
                e.currentTarget.style.borderColor = 'var(--victorian-burgundy)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.2)'
                e.currentTarget.style.borderColor = 'var(--victorian-gold)'
              }}
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--victorian-gold)' }}>
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Sign in with Google
              </span>
            </button>

            {/* Facebook Button */}
            <button
              onClick={() => handleOAuthLogin("facebook")}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-lg font-lato font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4"
              style={{
                background: 'linear-gradient(135deg, var(--victorian-burgundy) 0%, #5a252b 100%)',
                border: '2px solid var(--victorian-gold)',
                color: 'var(--victorian-antique-white)',
                boxShadow: '0 4px 15px rgba(114, 47, 55, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4), 0 0 15px rgba(212, 175, 55, 0.3)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(114, 47, 55, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--victorian-gold)' }}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686 0.235 2.686 0.235v2.953H15.83c-1.491 0-1.956 0.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign in with Facebook
              </span>
            </button>

            {/* GitHub Button */}
            <button
              onClick={() => handleOAuthLogin("github")}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-lg font-lato font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4"
              style={{
                background: 'linear-gradient(135deg, var(--victorian-charcoal) 0%, #2d3748 100%)',
                border: '2px solid var(--victorian-gold)',
                color: 'var(--victorian-antique-white)',
                boxShadow: '0 4px 15px rgba(54, 63, 73, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4), 0 0 15px rgba(212, 175, 55, 0.3)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(54, 63, 73, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--victorian-gold)' }}>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-1.334-.442-.258.675-2.57.675-2.57-.956-.256-1.571-.712-1.608-.712-.037 0-.058.03-.058.063 0 .018-.009.568.163 1.005.129.325.758 1.02 1.204 1.02.397 0 .942-.337.942-.899 0-.172.009-.24.009-.24-3.059-.35-4.264-2.758-4.264-2.758-.627-1.441-.095-2.714-.095-2.714.378-.97 1.59-1.247 1.59-1.247.743-.389 1.534.146 1.534.146.587.674 1.85 1.047 2.488 1.047.638 0 1.901-.373 2.488-1.047 0 0 .947-.536 1.532-.146 0 0 .846-.314 2.128.246 0 0 .743.326 1.215 1.247 0 0 .603.557 1.532 2.714 0 0 .566 1.273-.065 2.714 0 0 1.221 2.408-1.029 2.758 0 0-.058.063-.058.24 0 .562.545.899.942.899.445 0 1.076-.695 1.204-1.02.163-.437.163-.987.163-1.005 0-.033-.021-.045-.059-.063 0 0-.058.443-.058.443.202-.865.637-1.123.987-1.285 4.03-1.588 6.781.239 6.781.239.377 1.014-.522 1.588-.522 1.588-.397.305-.626 1.153-.526 1.604.338.299.65.829.762 1.604.686.307 2.422.837 3.492-.997.495-.851.942-1.304 1.839-1.237 0 0 .166-.019.083.729-.058.539-1.062.369-1.608 1.756-.546 1.387-1.014 1.416-4.033 1.416v2.234c.591.111.793.899.793.577C24 17.447 18.627 12.073 12 12.073z"/>
                </svg>
                Sign in with GitHub
              </span>
            </button>
          </div>

          {/* Victorian Terms Notice */}
          <div className="mt-10 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-24" style={{ 
                background: 'linear-gradient(to right, transparent, var(--victorian-gold))',
                height: '1px'
              }}></div>
              <div className="mx-3 w-2 h-2 rounded-full" style={{ 
                background: 'var(--victorian-gold)',
                boxShadow: '0 0 8px var(--victorian-gold)'
              }}></div>
              <div className="h-px w-24" style={{ 
                background: 'linear-gradient(to left, transparent, var(--victorian-gold))',
                height: '1px'
              }}></div>
            </div>
            <p className="font-lato text-sm" style={{ color: 'var(--victorian-bronze)', fontStyle: 'italic' }}>
              By signing in, you agree to our Terms of Service
            </p>
          </div>
        </div>

        {/* Bottom gold gradient accent strip */}
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{
          background: 'linear-gradient(90deg, var(--victorian-gold), var(--victorian-burgundy), var(--victorian-gold))'
        }}></div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes cardLift {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  )
}
