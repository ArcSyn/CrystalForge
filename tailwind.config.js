/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agent: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          green: '#10b981',
          dark: '#0a0a0f',
          darker: '#1a1a2e'
        }
      },
      backgroundColor: {
        'zinc-900/50': 'rgba(24, 24, 27, 0.5)',
        'zinc-900/80': 'rgba(24, 24, 27, 0.8)',
        'zinc-900/95': 'rgba(24, 24, 27, 0.95)',
        'zinc-800/30': 'rgba(39, 39, 42, 0.3)',
        'zinc-800/50': 'rgba(39, 39, 42, 0.5)',
        'purple-900/20': 'rgba(88, 28, 135, 0.2)',
        'purple-600/20': 'rgba(147, 51, 234, 0.2)',
        'purple-500/10': 'rgba(168, 85, 247, 0.1)',
        'purple-500/20': 'rgba(168, 85, 247, 0.2)',
        'blue-600/20': 'rgba(37, 99, 235, 0.2)',
        'emerald-500/10': 'rgba(16, 185, 129, 0.1)',
        'zinc-700/30': 'rgba(63, 63, 70, 0.3)',
        'emerald-500/30': 'rgba(16, 185, 129, 0.3)',
      },
      borderColor: {
        'zinc-800/50': 'rgba(39, 39, 42, 0.5)',
        'zinc-700/30': 'rgba(63, 63, 70, 0.3)',
        'purple-500/20': 'rgba(168, 85, 247, 0.2)',
        'purple-500/30': 'rgba(168, 85, 247, 0.3)',
        'emerald-500/30': 'rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
  safelist: [
    // Text colors for dynamic usage
    'text-purple-400', 'text-purple-500', 'text-purple-600',
    'text-blue-400', 'text-blue-500', 'text-blue-600',
    'text-green-400', 'text-green-500', 'text-green-600',
    'text-red-400', 'text-red-500', 'text-red-600',
    'text-yellow-400', 'text-yellow-500', 'text-yellow-600',
    'text-pink-400', 'text-pink-500', 'text-pink-600',
    'text-indigo-400', 'text-indigo-500', 'text-indigo-600',
    'text-cyan-400', 'text-cyan-500', 'text-cyan-600',
    'text-orange-400', 'text-orange-500', 'text-orange-600',
    'text-teal-400', 'text-teal-500', 'text-teal-600',
    'text-gray-400', 'text-gray-500', 'text-gray-600',
    'text-emerald-400', 'text-emerald-500', 'text-emerald-600',
    'text-zinc-400', 'text-zinc-500', 'text-zinc-600',
    
    // Background colors
    'bg-purple-50', 'bg-purple-100', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
    'bg-blue-50', 'bg-blue-100', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'bg-green-50', 'bg-green-100', 'bg-green-500', 'bg-green-600', 'bg-green-700',
    'bg-red-50', 'bg-red-100', 'bg-red-500', 'bg-red-600', 'bg-red-700',
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700',
    'bg-pink-50', 'bg-pink-100', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700',
    'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700',
    'bg-cyan-50', 'bg-cyan-100', 'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-700',
    'bg-orange-50', 'bg-orange-100', 'bg-orange-500', 'bg-orange-600', 'bg-orange-700',
    'bg-teal-50', 'bg-teal-100', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700',
    'bg-gray-50', 'bg-gray-100', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
    'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700',
    'bg-zinc-800', 'bg-zinc-900',
    
    // Border colors
    'border-purple-200', 'border-purple-300', 'border-purple-500',
    'border-blue-200', 'border-blue-300', 'border-blue-500',
    'border-green-200', 'border-green-300', 'border-green-500',
    'border-red-200', 'border-red-300', 'border-red-500',
    'border-yellow-200', 'border-yellow-300', 'border-yellow-500',
    'border-pink-200', 'border-pink-300', 'border-pink-500',
    'border-indigo-200', 'border-indigo-300', 'border-indigo-500',
    'border-cyan-200', 'border-cyan-300', 'border-cyan-500',
    'border-orange-200', 'border-orange-300', 'border-orange-500',
    'border-teal-200', 'border-teal-300', 'border-teal-500',
    'border-gray-200', 'border-gray-300', 'border-gray-500', 'border-gray-700',
    'border-emerald-200', 'border-emerald-300', 'border-emerald-500',
    'border-zinc-700', 'border-zinc-800',
    
    // Ring colors
    'ring-purple-500', 'ring-blue-500', 'ring-green-500', 'ring-red-500',
    'ring-yellow-500', 'ring-pink-500', 'ring-indigo-500', 'ring-cyan-500',
    'ring-orange-500', 'ring-teal-500', 'ring-gray-500', 'ring-emerald-500',
    
    // Hover states
    'hover:bg-purple-600', 'hover:bg-blue-600', 'hover:bg-green-600',
    'hover:bg-red-600', 'hover:bg-yellow-600', 'hover:bg-pink-600',
    'hover:bg-indigo-600', 'hover:bg-cyan-600', 'hover:bg-orange-600',
    'hover:bg-teal-600', 'hover:bg-gray-600', 'hover:bg-gray-700',
    'hover:bg-emerald-600', 'hover:bg-zinc-700',
    
    // Focus states
    'focus:ring-purple-500', 'focus:ring-blue-500', 'focus:ring-green-500',
    'focus:ring-red-500', 'focus:ring-yellow-500', 'focus:ring-pink-500',
    'focus:ring-indigo-500', 'focus:ring-cyan-500', 'focus:ring-orange-500',
    'focus:ring-teal-500', 'focus:ring-gray-500', 'focus:ring-emerald-500',
    
    // Shadow utilities
    'shadow-purple-500/50', 'shadow-blue-500/50', 'shadow-pink-500/50',
    'shadow-cyan-500/50', 'shadow-indigo-500/50', 'shadow-emerald-500/50',
    
    // Gradient colors
    'from-purple-500', 'from-blue-500', 'from-pink-500', 'from-indigo-500',
    'to-purple-600', 'to-blue-600', 'to-pink-600', 'to-cyan-500', 'to-indigo-600',
  ]
}
