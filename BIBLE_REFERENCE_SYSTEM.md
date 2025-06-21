# Bible Reference System Documentation

## Overview
The Bible reference system has been completely refactored to support multiple formats and ensure all references are clickable and lead to the Bible Digital API.

## Supported Reference Formats

### Single References
- `Genesis 1` - Single chapter
- `Genesis 1:1` - Single verse
- `Genesis 1:1-3` - Verse range within chapter

### Multiple References
- `Genesis 1,2,3` - Multiple chapters
- `Genesis 1:1,5,10` - Multiple verses in same chapter
- `Genesis 1:1-3,8-10` - Multiple verse ranges

### Complex References
- `Genesis 1-5` - Chapter ranges
- `Genesis 4:25, 5:3-8` - Mixed references (verse + range)

## Implementation

### API Integration (`services/bibleService.ts`)
- **Parser Function**: `parseReference()` - Handles all reference formats
- **Fetcher Function**: `getVerseByReference()` - Makes multiple API calls as needed
- **Interface**: `BibleReferenceResult` - Unified return format for all reference types

### React Hook (`hooks/useBibleApi.ts`)
- Centralized hook for Bible API operations
- Loading and error state management
- Automatic formatting for display

### UI Components

#### Bible Verse Modal (`components/BibleVerseModal.tsx`)
- Displays single verses, ranges, multiple chapters
- Proper formatting for complex references
- Material Design 3 styling
- Loading states and error handling

#### Character Card (`components/CharacterCard.tsx`)
- **Bible References**: Clickable Bible reference for each character
- **Family Navigation**: Clickable links for father, mother, spouse(s), and children
- **Event References**: Bible references for related events

#### Event Card (`components/EventCard.tsx`)
- **Bible References**: Clickable Genesis chapter references
- **Participant Navigation**: Links to character profiles

## User Experience Features

### Navigation Between Characters
1. Click on any family member (father, mother, spouse, children) in a character card
2. The current card closes and the selected family member's card opens
3. Seamless navigation through the family tree

### Bible Reference Access
1. All Bible references are displayed as clickable blue links
2. Clicking opens a modal with the full text from Bible Digital API
3. Support for complex references (ranges, multiple chapters, etc.)
4. Proper error handling if reference is invalid

## Bible Digital API Integration

### Key Features
- **Base URL**: `https://www.abibliadigital.com.br/api`
- **Version**: `nvi` (Nova Versão Internacional)
- **Rate Limiting**: Automatic handling of API limitations
- **Multiple Requests**: For ranges and lists that can't be fetched in single API call

### Error Handling
- Invalid reference format detection
- API connection error handling
- User-friendly error messages in Portuguese
- Fallback display for missing data

## Usage Examples

### For Users
1. **Viewing Character**: Click any character in timeline to see their profile
2. **Bible References**: Click blue underlined references to read verses
3. **Family Navigation**: Click family member names to navigate
4. **Event Details**: Click events to see participants and Bible references

### For Developers
```typescript
// Using the Bible API hook
const { data, loading, error, fetchReference } = useBibleApi();

// Fetch any reference format
await fetchReference('Genesis 1:1-3,8-10');

// The returned data will be properly structured for display
```

## Data Requirements

### Character Profiles (`characterProfiles.ts`)
- `bibleReference`: String with Bible reference (any supported format)
- `fatherId`: ID of father character (optional)
- `motherId`: ID of mother character (optional)  
- `spouseIds`: Array of spouse IDs (optional)
- `childrenIds`: Array of children IDs (optional)

### Events (`data.ts`)
- `genesisChapter`: String with Genesis chapter number
- `bibleReference`: Optional additional Bible reference
- `characterIds`: Array of participant character IDs

## Technical Notes

### API Limitations Handled
- Bible Digital API doesn't support range requests in single call
- Solution: Multiple API calls combined into unified response
- Automatic parsing of complex reference formats
- Proper error handling for invalid references

### Performance Considerations
- Bible API responses are not cached (could be improved)
- Multiple API calls are made sequentially for ranges
- Loading states prevent UI blocking during fetches

### Accessibility
- All clickable elements have proper ARIA labels
- Keyboard navigation support
- Screen reader friendly text
- High contrast support through theming
