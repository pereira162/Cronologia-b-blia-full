// MaterialCard.tsx
// Enhanced Material Design 3 Card component using CSS custom properties
// Follows Material Design 3 guidelines for surface containers

import React from 'react';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

interface MaterialCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  children,
  variant = 'elevated',
  clickable = false,
  onClick,
  className = '',
  style,
  elevation = 1,
}) => {
  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--md-card-container-shape)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
    ...style,
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: 'var(--md-card-container-color)',
          boxShadow: `var(--md-sys-elevation-level${elevation})`,
          border: 'none',
        };
      
      case 'filled':
        return {
          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
          boxShadow: 'var(--md-sys-elevation-level0)',
          border: 'none',
        };
      
      case 'outlined':
        return {
          backgroundColor: 'var(--md-sys-color-surface)',
          boxShadow: 'var(--md-sys-elevation-level0)',
          border: '1px solid var(--md-card-outline-color)',
        };
      
      default:
        return {};
    }
  };

  const getClickableStyles = (): React.CSSProperties => {
    if (!clickable) return {};
    
    return {
      cursor: 'pointer',
      userSelect: 'none',
    };
  };

  const combinedStyles = {
    ...baseStyles,
    ...getVariantStyles(),
    ...getClickableStyles(),
  };

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const getCardClasses = () => {
    const classes = [`md-card`, `md-card-${variant}`];
    
    if (clickable) {
      classes.push('md-card-clickable');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <div
      className={getCardClasses()}
      style={combinedStyles}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      {children}
      
      {/* State Layer for interactions */}
      {clickable && (
        <span 
          className="md-card-state-layer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            transition: 'background-color 0.15s cubic-bezier(0.2, 0, 0, 1)',
            borderRadius: 'inherit',
          }}
        />
      )}
    </div>
  );
};

// Card Header component
interface MaterialCardHeaderProps {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const MaterialCardHeader: React.FC<MaterialCardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  action,
  className = '',
}) => {
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px',
    gap: '16px',
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyles: React.CSSProperties = {
    font: 'var(--md-sys-typescale-title-large)',
    color: 'var(--md-sys-color-on-surface)',
    margin: 0,
    marginBottom: subtitle ? '4px' : 0,
  };

  const subtitleStyles: React.CSSProperties = {
    font: 'var(--md-sys-typescale-body-medium)',
    color: 'var(--md-sys-color-on-surface-variant)',
    margin: 0,
  };

  const avatarStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    flexShrink: 0,
  };

  return (
    <header className={`md-card-header ${className}`} style={headerStyles}>
      {avatar && (
        <div style={avatarStyles} className="md-card-avatar">
          {avatar}
        </div>
      )}
      
      <div style={contentStyles} className="md-card-header-content">
        <h3 style={titleStyles} className="md-card-title">
          {title}
        </h3>
        {subtitle && (
          <p style={subtitleStyles} className="md-card-subtitle">
            {subtitle}
          </p>
        )}
      </div>
      
      {action && (
        <div className="md-card-action">
          {action}
        </div>
      )}
    </header>
  );
};

// Card Content component
interface MaterialCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MaterialCardContent: React.FC<MaterialCardContentProps> = ({
  children,
  className = '',
}) => {
  const contentStyles: React.CSSProperties = {
    padding: '0 16px 16px 16px',
    color: 'var(--md-sys-color-on-surface)',
    font: 'var(--md-sys-typescale-body-medium)',
  };

  return (
    <div className={`md-card-content ${className}`} style={contentStyles}>
      {children}
    </div>
  );
};

// Card Actions component
interface MaterialCardActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'space-between';
}

export const MaterialCardActions: React.FC<MaterialCardActionsProps> = ({
  children,
  className = '',
  align = 'right',
}) => {
  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px 16px 16px',
    gap: '8px',
    justifyContent: align === 'space-between' ? 'space-between' : 
                   align === 'left' ? 'flex-start' : 'flex-end',
  };

  return (
    <div className={`md-card-actions ${className}`} style={actionsStyles}>
      {children}
    </div>
  );
};

// CSS styles for card interactions
const cardStyles = `
.md-card {
  color: var(--md-sys-color-on-surface);
}

.md-card-clickable:hover {
  box-shadow: var(--md-card-hover-container-elevation);
}

.md-card-clickable:hover .md-card-state-layer {
  background-color: rgba(var(--md-sys-color-on-surface), 0.08);
}

.md-card-clickable:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.md-card-clickable:active .md-card-state-layer {
  background-color: rgba(var(--md-sys-color-on-surface), 0.12);
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .md-card {
    transition: none;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = cardStyles;
  if (!document.head.querySelector('style[data-component="MaterialCard"]')) {
    styleSheet.setAttribute('data-component', 'MaterialCard');
    document.head.appendChild(styleSheet);
  }
}
