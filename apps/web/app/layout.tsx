import "./globals.css";
import DemoToolbar from "./components/DemoToolbar";

export const metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-7xl mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">AI Plant Commerce — Demo</h1>
          <nav className="mt-2 text-sm underline grid grid-cols-2 md:flex gap-3">
            <a href="/">Home</a>
            <a href="/solo">Solo Buy</a>
            <a href="/group">Group Buy</a>
            <a href="/exchange">Exchange</a>
            <a href="/rescue">Rescue</a>
            <a href="/ai-craft">AI Craft</a>
            <a href="/maintenance">Maintenance</a>
          </nav>
        </header>
        <DemoToolbar />
        {children}
      </body>
    </html>
  );
}
