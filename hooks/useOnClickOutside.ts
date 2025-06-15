// useOnClickOutside.ts
// Custom hook for handling clicks outside of a referenced element
// This follows React 19 best practices for custom hooks

import { useEffect, useRef } from 'react';

/**
 * Custom hook that triggers a callback when user clicks outside the referenced element
 * 
 * @param handler - Function to call when click outside occurs
 * @returns ref - React ref to attach to the element you want to monitor
 * 
 * @example
 * const ref = useOnClickOutside(() => setIsOpen(false));
 * return <div ref={ref}>Content</div>
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler]);

  return ref;
}
