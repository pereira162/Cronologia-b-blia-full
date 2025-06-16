// MaterialButton.tsx
// Enhanced Material Design 3 Button component using CSS custom properties
// Follows Material Design 3 guidelines with proper token architecture

import React from 'react';
import { useFontSize } from '../hooks';

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
export type ButtonSize = 'small' | 'medium' | 'large';

interface MaterialButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
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
  type = 'button',
  ariaLabel,
}) => {
  const { getFontSizeRem } = useFontSize();
  
  // Base button styles using CSS custom properties
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
    fontFamily: 'var(--md-ref-typeface-plain)',
    fontSize: `calc(${getFontSizeRem('label')} * 1rem)`,
    fontWeight: '500',
    letterSpacing: '0.1px',
    textDecoration: 'none',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    outline: 'none',
    // Focus styles
    ...(disabled && {
      opacity: 0.38,
      cursor: 'not-allowed',
    }),
  };

  // Variant-specific styles using Material Design tokens
  const getVariantStyles = (): React.CSSProperties => {
    const sizeHeight = {
      small: '32px',
      medium: '40px',
      large: '48px'
    }[size];

    const sizePadding = {
      small: icon ? '8px 16px' : '8px 12px',
      medium: icon ? '10px 24px' : '10px 16px',
      large: icon ? '12px 32px' : '12px 24px'
    }[size];

    switch (variant) {
      case 'filled':
        return {
          backgroundColor: 'var(--md-filled-button-container-color)',
          color: 'var(--md-filled-button-label-text-color)',
          borderRadius: 'var(--md-filled-button-container-shape)',
          height: sizeHeight,
          padding: sizePadding,
          boxShadow: 'var(--md-sys-elevation-level0)',
          border: 'none',
        };
      
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: 'var(--md-outlined-button-label-text-color)',
          borderRadius: 'var(--md-outlined-button-container-shape)',
          height: sizeHeight,
          padding: sizePadding,
          border: '1px solid var(--md-outlined-button-outline-color)',
        };
      
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: 'var(--md-text-button-label-text-color)',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          height: sizeHeight,
          padding: sizePadding,
          border: 'none',
        };
      
      case 'elevated':
        return {
          backgroundColor: 'var(--md-elevated-button-container-color)',
          color: 'var(--md-elevated-button-label-text-color)',
          borderRadius: 'var(--md-elevated-button-container-shape)',
          height: sizeHeight,
          padding: sizePadding,
          boxShadow: 'var(--md-elevated-button-container-elevation)',
          border: 'none',
        };
      
      case 'tonal':
        return {
          backgroundColor: 'var(--md-tonal-button-container-color)',
          color: 'var(--md-tonal-button-label-text-color)',
          borderRadius: 'var(--md-tonal-button-container-shape)',
          height: sizeHeight,
          padding: sizePadding,
          border: 'none',
        };
      
      default:
        return {};
    }
  };

  // Hover and focus styles
  const getHoverStyles = (): string => {
    const hoverClass = `md-button-${variant}-hover`;
    return hoverClass;
  };

  // Icon sizing
  const getIconSize = () => {
    return {
      small: '16px',
      medium: '18px',
      large: '20px'
    }[size];
  };

  const iconStyles: React.CSSProperties = {
    width: getIconSize(),
    height: getIconSize(),
    flexShrink: 0,
  };

  const combinedStyles = {
    ...baseStyles,
    ...getVariantStyles(),
  };

  return (
    <button
      type={type}
      className={`md-button md-button-${variant} ${getHoverStyles()} ${className}`}
      style={combinedStyles}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && iconPosition === 'start' && (
        <span style={iconStyles} className="md-button-icon">
          {icon}
        </span>
      )}
      <span className="md-button-label">{children}</span>
      {icon && iconPosition === 'end' && (
        <span style={iconStyles} className="md-button-icon">
          {icon}
        </span>
      )}
      
      {/* Material Design State Layer */}
      <span 
        className="md-button-state-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          transition: 'background-color 0.15s cubic-bezier(0.2, 0, 0, 1)',
        }}
      />
    </button>
  );
};

// CSS-in-JS for hover and focus states (will be moved to CSS file)
const buttonStyles = `
.md-button {
  position: relative;
}

.md-button:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* Filled Button Hover States */
.md-button-filled:hover:not(:disabled) {
  background-color: var(--md-filled-button-hover-container-color);
  color: var(--md-filled-button-hover-label-text-color);
  box-shadow: var(--md-sys-elevation-level1);
}

.md-button-filled:hover:not(:disabled) .md-button-state-layer {
  background-color: rgba(255, 255, 255, 0.08);
}

.md-button-filled:active:not(:disabled) .md-button-state-layer {
  background-color: rgba(255, 255, 255, 0.12);
}

/* Outlined Button Hover States */
.md-button-outlined:hover:not(:disabled) {
  background-color: var(--md-outlined-button-hover-container-color);
  color: var(--md-outlined-button-hover-label-text-color);
}

.md-button-outlined:hover:not(:disabled) .md-button-state-layer {
  background-color: rgba(var(--md-sys-color-primary), 0.08);
}

/* Text Button Hover States */
.md-button-text:hover:not(:disabled) {
  background-color: var(--md-text-button-hover-container-color);
  color: var(--md-text-button-hover-label-text-color);
}

.md-button-text:hover:not(:disabled) .md-button-state-layer {
  background-color: rgba(var(--md-sys-color-primary), 0.08);
}

/* Elevated Button Hover States */
.md-button-elevated:hover:not(:disabled) {
  box-shadow: var(--md-elevated-button-hover-container-elevation);
}

.md-button-elevated:hover:not(:disabled) .md-button-state-layer {
  background-color: rgba(var(--md-sys-color-primary), 0.08);
}

/* Tonal Button Hover States */
.md-button-tonal:hover:not(:disabled) .md-button-state-layer {
  background-color: rgba(var(--md-sys-color-on-secondary-container), 0.08);
}

/* Ripple effect */
@keyframes md-ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.md-button:active:not(:disabled)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: currentColor;
  transform: translate(-50%, -50%);
  animation: md-ripple 0.6s cubic-bezier(0.2, 0, 0, 1);
  pointer-events: none;
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .md-button {
    transition: none;
  }
  
  .md-button:active:not(:disabled)::after {
    animation: none;
  }
}
`;

// Inject styles (in a real app, this would be in a separate CSS file)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = buttonStyles;
  if (!document.head.querySelector('style[data-component="MaterialButton"]')) {
    styleSheet.setAttribute('data-component', 'MaterialButton');
    document.head.appendChild(styleSheet);
  }
}
