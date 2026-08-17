import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import ThemeProvider from "./components/ThemeProvider";
import ServiceWorker from "./components/ServiceWorker";

export const metadata: Metadata = {
  title: "أذكار — رفيقك اليومي",
  description: "تجربة هادئة وسهلة لأذكار الصباح والمساء.",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = { themeColor: "#2F6B4F", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body><ThemeProvider><ServiceWorker /><main className="azkar-shell">{children}</main><BottomNav /></ThemeProvider></body></html>;
}
