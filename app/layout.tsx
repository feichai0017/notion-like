import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {Inter} from "next/font/google";
import {ConvexClientProvider} from "@/components/providers/convex-provider";
import {Toaster} from "sonner";
import {ModalProvider} from "@/components/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteLab",
  description: "The connected workspace where better," +
      "faster work happens.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ConvexClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="note-lab-theme-2"
        >
          <Toaster position="bottom-center" />
          <ModalProvider/>
          {children}
        </ThemeProvider>
      </ConvexClientProvider>
      </body>
    </html>
  );
}
