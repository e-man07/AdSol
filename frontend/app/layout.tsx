import "@/app/globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import RoleProvider from "@/contexts/RoleContext";
import WalletContextProvider from "@/contexts/WalletContext";
import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SolAds - On-Chain Ads Marketplace on Solana</title>
        <meta
          name="description"
          content="The first decentralized marketplace connecting advertisers and publishers with transparent metrics, instant payments, and zero middlemen."
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletContextProvider>
            <RoleProvider>
              <Header />
              <main className="pt-16">{children}</main>
            </RoleProvider>
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
