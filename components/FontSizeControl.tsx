// FontSizeControl.tsx
// Simplified Material Design 3 Font Size Control component
// Simple +/- buttons with 5 size levels

import React from 'react';
import { MaterialButton } from './MaterialButton';
import { useFontSize } from '../hooks';

interface FontSizeControlProps {
  theme: any; // Will be properly typed when theme system is updated
}

export const FontSizeControl: React.FC<FontSizeControlProps> = ({ theme }) => {
  const { fontSize, setFontSize, availableScales } = useFontSize();
  
  const currentIndex = availableScales.findIndex(config => config.scale === fontSize.scale);
  const canDecrease = currentIndex > 0;
  const canIncrease = currentIndex < availableScales.length - 1;
  
  const decrease = () => {
    if (canDecrease) {
      setFontSize(availableScales[currentIndex - 1].scale);
    }
  };
  
  const increase = () => {
    if (canIncrease) {
      setFontSize(availableScales[currentIndex + 1].scale);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4 rounded-xl border"
      style={{ 
        backgroundColor: theme.colors.surfaceContainer || 'var(--md-sys-color-surface-container)',
        borderColor: theme.colors.outline || 'var(--md-sys-color-outline)'
      }}
    >      <h3 
        className="text-md-title-medium font-md-title-medium text-center"
        style={{ 
          color: theme.colors.onSurface || 'var(--md-sys-color-on-surface)'
        }}
      >
        Tamanho da Fonte
      </h3>
      
      <div className="flex items-center space-x-3">
        <MaterialButton
          variant="outlined"
          size="small"
          onClick={decrease}
          disabled={!canDecrease}
          theme={theme}
          ariaLabel="Diminuir fonte"
        >
          A-
        </MaterialButton>
        
        <div className="text-center min-w-[80px]">          <div 
            className="text-md-label-large font-md-label-large"
            style={{ 
              color: theme.colors.onSurface || 'var(--md-sys-color-on-surface)',
              fontSize: `${fontSize.baseSize}px`
            }}
          >
            {fontSize.description}
          </div>
          <div 
            className="text-md-label-small font-md-label-small"
            style={{ 
              color: theme.colors.onSurfaceVariant || 'var(--md-sys-color-on-surface-variant)',
            }}
          >
            {fontSize.baseSize}px
          </div>
        </div>
        
        <MaterialButton
          variant="outlined"
          size="small"
          onClick={increase}
          disabled={!canIncrease}
          theme={theme}
          ariaLabel="Aumentar fonte"
        >
          A+
        </MaterialButton>
      </div>
      
      {/* Size indicator dots */}
      <div className="flex space-x-1">
        {availableScales.map((config, index) => (
          <div
            key={config.scale}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: index === currentIndex 
                ? (theme.colors.primary || 'var(--md-sys-color-primary)')
                : (theme.colors.outline || 'var(--md-sys-color-outline)')
            }}
          />
        ))}
      </div>
    </div>
  );
};
