import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const LuckiestGuy = localFont({
  src: "./fonts/LuckiestGuy-Regular.ttf",
  variable: "--font-luckiest-guy",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pastel">
      <body
        className={`${LuckiestGuy.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
