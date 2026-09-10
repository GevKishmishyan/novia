import type { Metadata } from "next";
import { Alex_Brush, Allura, Bodoni_Moda, Cinzel, Cormorant_Garamond, Great_Vibes, Handjet, Iosevka_Charon, Marcellus, Noto_Sans_Armenian, Noto_Serif_Armenian, Parisienne, Playfair_Display, Sacramento } from "next/font/google";
import "./globals.css";

const notoSansArmenian = Noto_Sans_Armenian({ display: "swap", subsets: ["armenian", "latin"], variable: "--font-noto-sans-armenian" });
const notoSerifArmenian = Noto_Serif_Armenian({ display: "swap", subsets: ["armenian", "latin"], variable: "--font-noto-serif-armenian" });
const handjet = Handjet({ display: "swap", subsets: ["armenian", "latin"], variable: "--font-handjet" });
const iosevkaCharon = Iosevka_Charon({ display: "swap", subsets: ["armenian", "latin"], variable: "--font-iosevka-charon", weight: ["300", "400", "500", "700"] });
const alexBrush = Alex_Brush({ display: "swap", subsets: ["latin"], variable: "--font-alex-brush", weight: "400" });
const allura = Allura({ display: "swap", subsets: ["latin"], variable: "--font-allura", weight: "400" });
const bodoniModa = Bodoni_Moda({ display: "swap", subsets: ["latin"], variable: "--font-bodoni-moda" });
const cinzel = Cinzel({ display: "swap", subsets: ["latin"], variable: "--font-cinzel" });
const cormorant = Cormorant_Garamond({ display: "swap", subsets: ["latin"], variable: "--font-cormorant", weight: ["300", "400", "500", "600", "700"] });
const greatVibes = Great_Vibes({ display: "swap", subsets: ["latin"], variable: "--font-great-vibes", weight: "400" });
const marcellus = Marcellus({ display: "swap", subsets: ["latin"], variable: "--font-marcellus", weight: "400" });
const parisienne = Parisienne({ display: "swap", subsets: ["latin"], variable: "--font-parisienne", weight: "400" });
const playfair = Playfair_Display({ display: "swap", subsets: ["latin"], variable: "--font-playfair" });
const sacramento = Sacramento({ display: "swap", subsets: ["latin"], variable: "--font-sacramento", weight: "400" });

export const metadata: Metadata = {
  title: "Novia — Plan beautifully. Celebrate fully.",
  description: "Keep your guests, budget, and to-dos together in one calm place.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html className={`${notoSansArmenian.variable} ${notoSerifArmenian.variable} ${handjet.variable} ${iosevkaCharon.variable} ${alexBrush.variable} ${allura.variable} ${bodoniModa.variable} ${cinzel.variable} ${cormorant.variable} ${greatVibes.variable} ${marcellus.variable} ${parisienne.variable} ${playfair.variable} ${sacramento.variable}`} lang="en" suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>;
}
