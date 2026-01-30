import { useEffect, useRef } from 'react';

/**
 * Hook to automatically scroll to the bottom when content changes.
 *
 * Uses ResizeObserver to detect content size changes and automatically
 * scrolls to the bottom. Behavior varies based on context:
 * - **Smooth scroll**: For new messages in the same conversation
 * - **Instant scroll**: When switching to a different conversation
 *
 * @typeParam T - Type of the dependency used to detect context changes
 * @param dependency - Value that identifies the current context (e.g., conversation ID)
 * @returns React ref to attach to the scrollable container
 *
 * @example
 * ```tsx
 * function MessageThread({ conversationId, messages }) {
 *   const scrollRef = useAutoScroll(conversationId);
 *
 *   return (
 *     <div ref={scrollRef} className="overflow-y-auto h-96">
 *       <div>
 *         {messages.map(msg => <Message key={msg.id} {...msg} />)}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @category Hooks
 */
export function useAutoScroll<T>(dependency: T) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastDepId = useRef<T>(dependency);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const performScroll = (behavior: ScrollBehavior = 'smooth') => {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior,
      });
    };

    /**
     * ResizeObserver detects content size changes
     * (new messages, images loading, etc.)
     */
    const resizeObserver = new ResizeObserver(() => {
      const isNewContext = lastDepId.current !== dependency;

      /**
       * Use 'auto' (instant) if switching conversations,
       * otherwise use 'smooth' for new messages.
       */
      performScroll(isNewContext ? 'auto' : 'smooth');

      if (isNewContext) {
        lastDepId.current = dependency;
      }
    });

    /**
     * Observe the first child (the message wrapper)
     * to detect internal height changes.
     */
    const contentWrapper = scrollContainer.firstChild;
    if (contentWrapper instanceof Element) {
      resizeObserver.observe(contentWrapper);
    }

    return () => resizeObserver.disconnect();
  }, [dependency]);

  return scrollRef;
}
