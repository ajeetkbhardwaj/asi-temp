import type React from "react";
import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Kumar Press — Books & Digital Editions by Ajeet Kumar",
  description:
    "Independent digital bookstore and publishing house by Ajeet Kumar. Read multi-volume engineering, systems, and craft books online.",
  authors: [{ name: "Ajeet Kumar" }],
  creator: "Ajeet Kumar",
  publisher: "Kumar Press",
  openGraph: {
    title: "Kumar Press — Books & Digital Editions by Ajeet Kumar",
    description:
      "Read multi-volume books and essays written by Ajeet Kumar across technical clarity and engineering craft.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kumar Press — Books by Ajeet Kumar",
    description:
      "Independent digital bookstore and multi-volume publishing house by Ajeet Kumar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${lora.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
