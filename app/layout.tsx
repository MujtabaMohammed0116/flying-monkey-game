import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flying Monkey Game",
  description: "A Flappy Bird-style arcade game with a monkey character",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
