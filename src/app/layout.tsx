
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const appIcon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%233399FF" /><text x="50" y="55" font-size="50" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-weight="bold">HR</text></svg>`;

export const metadata: Metadata = {
  title: 'HR360+',
  description: 'An all-in-one HR platform powered by AI',
  icons: {
    icon: appIcon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
