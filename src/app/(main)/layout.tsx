import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: "MovieHub - Stream Movies Online",
  description:
    "Watch your favorite movies online with MovieHub. Stream the latest movies, TV shows, and series in high quality.",
};

const themeScript = `
  (function() {
    function getTheme() {
      const theme = localStorage.getItem('theme');
      if (theme) return theme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    const theme = getTheme();
    document.documentElement.classList.add(theme);
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider>
            <div
              className="min-h-screen flex flex-col transition-colors duration-200
      bg-slate-50 dark:bg-slate-900"
            >
              <Header className="bg-white dark:bg-slate-950" />

              {/* Spacer to prevent content from going under fixed header */}
              <div className="h-16 flex-shrink-0" />

              <main className="flex-1">{children}</main>

              <Footer className="bg-white dark:bg-slate-950" />
            </div>
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </>
  );
}
