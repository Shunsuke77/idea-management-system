import React from 'react';
import { ButtonProps, IconButtonProps } from '../types/components';

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  size = 'medium',
  ...props
}) => {
  const baseClasses = 'rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'primary',
  disabled = false,
  size = 'medium',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        inline-flex items-center justify-center rounded-full
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variant === 'primary' ? 'text-blue-600 hover:text-blue-700 focus:ring-blue-500' : ''}
        ${variant === 'secondary' ? 'text-gray-600 hover:text-gray-700 focus:ring-gray-400' : ''}
        ${variant === 'danger' ? 'text-red-600 hover:text-red-700 focus:ring-red-500' : ''}
        ${size === 'small' ? 'p-1' : ''}
        ${size === 'medium' ? 'p-2' : ''}
        ${size === 'large' ? 'p-3' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};
