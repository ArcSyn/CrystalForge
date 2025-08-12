/**
 * Test Component Generator for Phase 2 Verification
 * This utility generates sample components to verify Tailwind v3 is working correctly
 */

export const generateTestComponents = () => {
  const components = {
    // Test 1: Primary Button with hover effects
    primaryButton: `import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`
        \${sizeClasses[size]}
        bg-purple-600 text-white font-semibold rounded-lg
        hover:bg-purple-700 active:bg-purple-800
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 ease-in-out
        shadow-lg hover:shadow-xl
        transform hover:-translate-y-0.5 active:translate-y-0
      \`}
      aria-label={typeof children === 'string' ? children : 'Primary action'}
    >
      {children}
    </button>
  );
};`,

    // Test 2: Status Badge with dynamic colors
    statusBadge: `import React from 'react';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  text: string;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text, 
  pulse = false 
}) => {
  const colorClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const pulseClasses = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <span className="relative inline-flex items-center">
      {pulse && (
        <span className={\`absolute -left-1 -top-1 h-3 w-3 rounded-full \${pulseClasses[status]} animate-ping\`} />
      )}
      <span
        className={\`
          inline-flex items-center px-3 py-1
          text-sm font-medium rounded-full
          border \${colorClasses[status]}
        \`}
        role="status"
        aria-label={\`Status: \${text}\`}
      >
        {text}
      </span>
    </span>
  );
};`,

    // Test 3: User Card with avatar
    userCard: `import React from 'react';

interface UserCardProps {
  name: string;
  role: string;
  avatarUrl?: string;
  email: string;
  isOnline?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  name, 
  role, 
  avatarUrl, 
  email,
  isOnline = false 
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-start space-x-4">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={\`\${name}'s avatar\`}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-zinc-800 rounded-full" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-purple-400">{name}</h3>
          <p className="text-sm text-zinc-400 mb-2">{role}</p>
          <a 
            href={\`mailto:\${email}\`}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {email}
          </a>
          
          <div className="mt-4 flex space-x-2">
            <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
              Message
            </button>
            <button className="px-3 py-1 bg-zinc-700 text-white text-sm rounded-lg hover:bg-zinc-600 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};`,

    // Test 4: Responsive Navigation
    responsiveNav: `import React, { useState } from 'react';
import { Menu, X, Home, Code, Settings, User } from 'lucide-react';

export const ResponsiveNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', href: '#' },
    { icon: Code, label: 'Projects', href: '#' },
    { icon: User, label: 'About', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' }
  ];

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crystal Forge
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center space-x-2 text-zinc-300 hover:text-purple-400 transition-colors"
              >
                <Icon size={18} />
                <span>{label}</span>
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-800 border-t border-zinc-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                <Icon size={20} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};`,

    // Test 5: Form Input with validation states
    formInput: `import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  success,
  required = false
}) => {
  const inputClasses = \`
    w-full px-4 py-2 rounded-lg
    bg-zinc-800 text-white
    border transition-all duration-200
    focus:outline-none focus:ring-2
    \${error 
      ? 'border-red-500 focus:ring-red-500' 
      : success 
        ? 'border-green-500 focus:ring-green-500'
        : 'border-zinc-700 focus:border-purple-500 focus:ring-purple-500'
    }
  \`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? \`\${label}-error\` : undefined}
        />
        
        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p id={\`\${label}-error\`} className="text-sm text-red-500 flex items-center space-x-1">
          <span>{error}</span>
        </p>
      )}
      
      {success && !error && (
        <p className="text-sm text-green-500 flex items-center space-x-1">
          <span>Looks good!</span>
        </p>
      )}
    </div>
  );
};`
  };

  return components;
};

// Helper function to test if Tailwind classes are working
export const verifyTailwindClasses = () => {
  const testElement = document.createElement('div');
  testElement.className = 'bg-purple-600 text-white p-4';
  document.body.appendChild(testElement);
  
  const styles = window.getComputedStyle(testElement);
  const bgColor = styles.backgroundColor;
  const textColor = styles.color;
  const padding = styles.padding;
  
  document.body.removeChild(testElement);
  
  return {
    isWorking: bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)',
    details: {
      backgroundColor: bgColor,
      color: textColor,
      padding: padding
    }
  };
};
