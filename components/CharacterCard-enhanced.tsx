// CharacterCard-enhanced.tsx
// Enhanced Character Card using Material Design 3 components and tokens
// Demonstrates proper use of MaterialCard and CSS custom properties

import React from 'react';
import { MaterialCard, MaterialCardHeader, MaterialCardContent, MaterialCardActions } from './MaterialCard';
import { MaterialButton } from './MaterialButton-enhanced';
import { Person } from '../types';
import { useBibleApi } from '../hooks';

interface CharacterCardProps {
  character: Person;
  fontSize: number;
  onBibleReferenceClick?: (reference: string) => void;
}

export const CharacterCardEnhanced: React.FC<CharacterCardProps> = ({
  character,
  fontSize,
  onBibleReferenceClick,
}) => {
  const { fetchVerse } = useBibleApi();

  const handleBibleClick = async (reference: string) => {
    if (onBibleReferenceClick) {
      onBibleReferenceClick(reference);
    }
    // Fetch verse for preview
    try {
      await fetchVerse(reference);
    } catch (error) {
      console.warn('Failed to fetch verse:', error);
    }
  };

  const formatBibleReference = (text: string) => {
    // Regex para identificar referências bíblicas
    const bibleRefRegex = /\b(\d?\s?[A-Za-z]+\s?\d{1,3}:\d{1,3}(?:-\d{1,3})?)\b/g;
    
    return text.split(bibleRefRegex).map((part, index) => {
      if (bibleRefRegex.test(part)) {
        return (
          <button
            key={index}
            onClick={() => handleBibleClick(part.trim())}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--md-sys-color-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              font: 'inherit',
              padding: 0,
              margin: 0,
              display: 'inline',
            }}
            className="bible-reference"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  const getCharacterAvatar = () => {
    // Create a simple avatar with the first letter of the character's name
    const firstLetter = character.name.charAt(0).toUpperCase();
    
    return (
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--md-sys-color-primary-container)',
          color: 'var(--md-sys-color-on-primary-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: 'var(--md-sys-typescale-title-medium)',
          fontWeight: '500',
        }}
      >
        {firstLetter}
      </div>
    );
  };

  const getSubtitle = () => {
    const parts = [];
    
    if (character.nameMeaning) {
      parts.push(`Significado: ${character.nameMeaning}`);
    }
    
    if (character.birthYear && character.deathYear) {
      parts.push(`${character.birthYear} - ${character.deathYear}`);
    } else if (character.birthYear) {
      parts.push(`Nasceu em ${character.birthYear}`);
    } else if (character.deathYear) {
      parts.push(`Morreu em ${character.deathYear}`);
    }
    
    if (character.totalLifespan) {
      parts.push(`Viveu ${character.totalLifespan} anos`);
    }
    
    return parts.join(' • ');
  };

  return (
    <MaterialCard
      variant="elevated"
      elevation={1}
      style={{
        maxWidth: '400px',
        margin: '8px',
      }}
    >
      <MaterialCardHeader
        title={character.name}
        subtitle={getSubtitle()}
        avatar={getCharacterAvatar()}
      />
      
      <MaterialCardContent>
        <div style={{
          fontSize: `${fontSize}rem`,
          lineHeight: 1.6,
          color: 'var(--md-sys-color-on-surface)',
        }}>
          {character.description && (
            <p style={{ 
              margin: '0 0 12px 0',
              font: 'var(--md-sys-typescale-body-large)',
            }}>
              {formatBibleReference(character.description)}
            </p>
          )}
          
          {character.bibleReference && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{
                font: 'var(--md-sys-typescale-title-medium)',
                color: 'var(--md-sys-color-on-surface)',
                margin: '0 0 8px 0',
              }}>
                Referência Bíblica
              </h4>
              <p style={{
                margin: 0,
                font: 'var(--md-sys-typescale-body-medium)',
                color: 'var(--md-sys-color-on-surface-variant)',
              }}>
                {formatBibleReference(character.bibleReference)}
              </p>
            </div>
          )}
          
          {character.isCovenantLine && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'var(--md-sys-color-tertiary-container)',
              color: 'var(--md-sys-color-on-tertiary-container)',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              font: 'var(--md-sys-typescale-body-medium)',
            }}>
              ✨ Faz parte da linhagem da aliança
            </div>
          )}
        </div>
      </MaterialCardContent>
      
      <MaterialCardActions align="space-between">
        <MaterialButton
          variant="text"
          size="small"
          onClick={() => {
            console.log('Ver genealogia de', character.name);
          }}
        >
          Ver Genealogia
        </MaterialButton>
        
        <MaterialButton
          variant="outlined"
          size="small"
          onClick={() => {
            console.log('Ver cronologia de', character.name);
          }}
        >
          Ver na Cronologia
        </MaterialButton>
      </MaterialCardActions>
    </MaterialCard>
  );
};

// CSS for bible references
const characterCardStyles = `
.bible-reference:hover {
  color: var(--md-sys-color-primary);
  background-color: var(--md-sys-color-primary-container);
  border-radius: var(--md-sys-shape-corner-extra-small);
  padding: 2px 4px;
  margin: -2px -4px;
}

.bible-reference:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
  border-radius: var(--md-sys-shape-corner-extra-small);
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .bible-reference {
    transition: none;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = characterCardStyles;
  if (!document.head.querySelector('style[data-component="CharacterCardEnhanced"]')) {
    styleSheet.setAttribute('data-component', 'CharacterCardEnhanced');
    document.head.appendChild(styleSheet);
  }
}
