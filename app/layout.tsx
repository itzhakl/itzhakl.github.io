// This file is required for the app directory to work.
// It's not used for rendering since we have [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
