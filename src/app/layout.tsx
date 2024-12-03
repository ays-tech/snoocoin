import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { Root } from "@/components/Root/Root";
import AppWalletProvider from "./components/AppWalletProvider";
import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";
import GoogleAnalytics from './GoogleAnalytics';

export const metadata: Metadata = {
  title: "BIBI BOT",
  description: "BIBI is the most cutest cat on solana",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <body>
      <GoogleAnalytics />
      <AppWalletProvider>
        <Root>{children}</Root>
        </AppWalletProvider>
      </body>
    </html>
  );
}
