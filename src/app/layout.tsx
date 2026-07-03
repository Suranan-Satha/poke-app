// app/layout.tsx
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PokéDex",
  description: "Browse all 1,351 Pokémon — stats, evolution chain, types & cries.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#06080f" }}>
      <AppRouterCacheProvider>
        <CssBaseline />
        <Navbar />
        {children}
      </AppRouterCacheProvider> 
      </body>
      </html>
  );
}