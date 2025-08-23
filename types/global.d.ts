// Global type declarations

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement> & { inert?: boolean },
        HTMLDivElement
      >;
    }
  }
}

export {};
