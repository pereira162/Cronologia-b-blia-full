# Event Card Dragging and Positioning Customization

This document explains how to customize the draggable event card system in the timeline application.

## Overview

Event cards are now draggable and can be positioned vertically along the timeline. They feature:
- Horizontal centering by default
- Vertical dragging capability
- Collision detection to avoid overlap
- Manual alignment controls (left/center/right)
- Visual feedback during dragging

## Customization Options

### 1. Default Positioning

Event cards start with default positions that can be customized in `TimelineView.tsx`:

```typescript
const getEventCardPosition = (eventId: string): EventCardPosition => {
  return eventCardPositions[eventId] || {
    eventId,
    x: 0,
    y: 100, // Default vertical offset from timeline (customizable)
    alignment: 'center', // Default alignment: 'left' | 'center' | 'right'
    isDragging: false
  };
};
```

**Customization:**
- Change `y: 100` to adjust the default vertical position
- Change `alignment: 'center'` to set default horizontal alignment

### 2. Collision Detection

The collision detection system prevents event cards from overlapping:

```typescript
const avoidEventCardCollisions = (currentEventId: string, proposedY: number): number => {
  const CARD_HEIGHT = 40; // Approximate event card height (customizable)
  const MIN_GAP = 10; // Minimum gap between cards (customizable)
  
  // ... collision logic
};
```

**Customization:**
- Adjust `CARD_HEIGHT` to match your event card design
- Modify `MIN_GAP` to increase or decrease spacing between cards

### 3. Dragging Constraints

Vertical dragging is constrained to keep cards within the timeline:

```typescript
const handleEventCardDrag = (event: MouseEvent) => {
  // ...
  
  // Prevent dragging too high (minimum 20px from top)
  newY = Math.max(20, newY); // Customizable minimum
  
  // Prevent dragging below timeline (maximum timeline height - 50px)
  newY = Math.min(timelineHeight - 50, newY); // Customizable margin
  
  // ...
};
```

**Customization:**
- Change `Math.max(20, newY)` to adjust the minimum vertical position
- Modify `timelineHeight - 50` to change the bottom margin

### 4. Visual Styling

Event cards have customizable visual elements:

```tsx
<div
  className={`px-2 py-1 bg-theme-event-label-bg text-theme-event-label-text rounded shadow-lg border border-theme-border
    flex items-center space-x-2 transition-all duration-200 hover:shadow-xl group
    ${isDragging ? 'scale-105 shadow-2xl' : ''}`}
  // ...
>
```

**Customization:**
- Modify Tailwind classes for different padding, colors, borders, etc.
- Adjust the `scale-105` transform for different dragging visual feedback
- Change shadow intensities and transition durations

### 5. Alignment Controls

The alignment buttons can be customized:

```tsx
{/* Alignment controls */}
<div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
  <button className="w-3 h-3 text-xs ...">◀</button> {/* Left */}
  <button className="w-3 h-3 text-xs ...">●</button> {/* Center */}
  <button className="w-3 h-3 text-xs ...">▶</button> {/* Right */}
</div>
```

**Customization:**
- Change button sizes with `w-3 h-3`
- Modify icons (◀, ●, ▶) to use different symbols or components
- Adjust `opacity-0 group-hover:opacity-100` for different visibility behavior
- Add more alignment options if needed

### 6. Horizontal Positioning

Horizontal positioning is controlled by alignment settings:

```typescript
switch (eventCardPosition.alignment) {
  case 'left':
    cardX = xPos - 100; // Offset to the left (customizable)
    transform = 'translateX(0%)';
    break;
  case 'right':
    cardX = xPos + 100; // Offset to the right (customizable)
    transform = 'translateX(-100%)';
    break;
  case 'center':
  default:
    cardX = xPos; // Centered on timeline
    transform = 'translateX(-50%)';
    break;
}
```

**Customization:**
- Modify the offset values (`-100`, `+100`) to change how far left/right cards move
- Add additional alignment options (e.g., 'far-left', 'far-right')

## Data Persistence

Event card positions are stored in the `eventCardPositions` state in `App.tsx`. To persist positions:

1. **Local Storage**: Add persistence to browser storage
2. **Database**: Save positions to a backend
3. **Export/Import**: Allow users to save/load positioning configurations

Example local storage implementation:

```typescript
// Save positions
useEffect(() => {
  localStorage.setItem('eventCardPositions', JSON.stringify(eventCardPositions));
}, [eventCardPositions]);

// Load positions
useEffect(() => {
  const saved = localStorage.getItem('eventCardPositions');
  if (saved) {
    setEventCardPositions(JSON.parse(saved));
  }
}, []);
```

## Performance Considerations

For large numbers of events:

1. **Debounce dragging updates** to reduce re-renders
2. **Virtualize off-screen event cards** to improve performance
3. **Memoize collision calculations** for better responsiveness

## Accessibility

The current implementation includes:
- Keyboard navigation support
- ARIA labels for screen readers
- Focus management during dragging
- Clear visual indicators

Customize accessibility by:
- Modifying ARIA labels and descriptions
- Adding keyboard shortcuts for alignment
- Implementing voice control support

## Integration with Other Features

Event card positions work with:
- **Bible reference clicking**: Still functional on dragged cards
- **Event selection**: Cards remain clickable when repositioned  
- **Timeline scaling**: Positions scale with the timeline
- **Theme switching**: Visual styling adapts to theme changes

## Future Enhancements

Potential additions:
- **Snap-to-grid positioning**
- **Group dragging** for multiple events
- **Auto-layout algorithms** for optimal positioning
- **Undo/redo** for position changes
- **Position templates** for common layouts
