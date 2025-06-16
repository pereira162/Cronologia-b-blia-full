// MaterialButton.tsx
// Material Design 3 Button component
// Follows Material Design 3 guidelines for buttons with proper accessibility

import React from 'react';
import { useFontSize } from '../hooks';

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
export type ButtonSize = 'small' | 'medium' | 'large';

interface MaterialButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  theme?: any; // Will be properly typed when theme system is updated
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export const MaterialButton: React.FC<MaterialButtonProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  icon,
  iconPosition = 'start',
  onClick,
  className = '',
  theme,
  type = 'button',
  ariaLabel,
}) => {
  const { getFontSizeRem } = useFontSize();
  
  // Default theme fallback
  const defaultTheme = {
    colors: {
      primary: '#6750a4',
      onPrimary: '#ffffff',
      primaryContainer: '#eaddff',
      onPrimaryContainer: '#21005e',
      surfaceContainer: '#f3f0f4',
      surfaceContainerHigh: '#ede6ea',
      secondaryContainer: '#e8def8',
      onSecondaryContainer: '#1d192b',
      outline: '#79747e',
    }
  };
  
  const currentTheme = theme || defaultTheme;
    // Get colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'filled':
        return {
          bg: currentTheme.colors.primary,
          color: currentTheme.colors.onPrimary,
          hoverBg: currentTheme.colors.primaryContainer,
          hoverColor: currentTheme.colors.onPrimaryContainer,
        };
      case 'outlined':
        return {
          bg: 'transparent',
          color: currentTheme.colors.primary,
          hoverBg: currentTheme.colors.primaryContainer,
          hoverColor: currentTheme.colors.onPrimaryContainer,
          border: currentTheme.colors.outline,
        };
      case 'text':
        return {
          bg: 'transparent',
          color: currentTheme.colors.primary,
          hoverBg: currentTheme.colors.primaryContainer,
          hoverColor: currentTheme.colors.onPrimaryContainer,
        };
      case 'elevated':
        return {
          bg: currentTheme.colors.surfaceContainer,
          color: currentTheme.colors.primary,
          hoverBg: currentTheme.colors.surfaceContainerHigh,
          hoverColor: currentTheme.colors.primary,
        };
      case 'tonal':
        return {
          bg: currentTheme.colors.secondaryContainer,
          color: currentTheme.colors.onSecondaryContainer,
          hoverBg: currentTheme.colors.surfaceContainerHigh,
          hoverColor: currentTheme.colors.onSecondaryContainer,
        };
      default:
        return {
          bg: currentTheme.colors.primary,
          color: currentTheme.colors.onPrimary,
          hoverBg: currentTheme.colors.primaryContainer,
          hoverColor: currentTheme.colors.onPrimaryContainer,
        };
    }
  };
  
  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: getFontSizeRem('label'),
          height: '32px',
        };
      case 'medium':
        return {
          padding: '12px 24px',
          fontSize: getFontSizeRem('body'),
          height: '40px',
        };
      case 'large':
        return {
          padding: '16px 32px',
          fontSize: getFontSizeRem('body'),
          height: '48px',
        };
      default:
        return {
          padding: '12px 24px',
          fontSize: getFontSizeRem('body'),
          height: '40px',
        };
    }
  };
  
  const colors = getColors();
  const sizeStyles = getSizeStyles();
  
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: icon ? '8px' : '0',
    border: variant === 'outlined' ? `1px solid ${colors.border}` : 'none',
    borderRadius: '20px', // Material Design 3 rounded corners
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: '500',
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)', // Material Design 3 easing
    outline: 'none',
    opacity: disabled ? 0.38 : 1,
    ...sizeStyles,
  };
  
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  
  const currentStyles = {
    ...baseStyles,
    backgroundColor: (isHovered || isFocused) && !disabled ? colors.hoverBg : colors.bg,
    color: (isHovered || isFocused) && !disabled ? colors.hoverColor : colors.color,
    boxShadow: variant === 'elevated' ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' : 'none',
  };
  
  const iconElement = icon && (
    <span className="flex items-center justify-center">
      {icon}
    </span>
  );
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={currentStyles}
      className={`material-button ${className}`}
      aria-label={ariaLabel}
    >
      {icon && iconPosition === 'start' && iconElement}
      <span>{children}</span>
      {icon && iconPosition === 'end' && iconElement}
    </button>
  );
};
