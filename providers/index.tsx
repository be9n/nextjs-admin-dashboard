import { QueryProvider } from "./QueryProvider";
import { DirectionProvider } from "./DirectionProvider";
import { NuqsProvider } from "./NuqsProvider";
import { IntlProvider } from "./IntlProvider";

/**
 * Combined provider component that wraps all the application providers
 * in the correct order.
 * 
 * No 'use client' directive is needed here because:
 * 1. Each client provider component has its own 'use client' directive
 * 2. This component is just composing those components
 * 3. The 'use client' boundary is established at the individual component level
 * 
 * The IntlProvider is a server component, and including it here doesn't force
 * this component to become a client component, since server components
 * can import and render client components while remaining server components.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IntlProvider>
      <QueryProvider>
        <DirectionProvider>
          <NuqsProvider>{children}</NuqsProvider>
        </DirectionProvider>
      </QueryProvider>
    </IntlProvider>
  );
} 