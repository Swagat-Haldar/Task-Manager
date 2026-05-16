import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Team Task Manager",
  description: "Production-quality full-stack project management",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background">
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
