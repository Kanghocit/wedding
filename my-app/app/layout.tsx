import type { Metadata } from "next";
import {
  EB_Garamond,
  Libre_Baskerville,
  Montserrat,
  The_Nautigal,
} from "next/font/google";
import "./globals.css";
import { getWeddingConfig } from "@/lib/config";

const nautigal = The_Nautigal({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-nautigal",
});

const garamond = EB_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-garamond",
});

const baskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-baskerville",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
});

export async function generateMetadata(): Promise<Metadata> {
  const { pageTitle } = getWeddingConfig();
  return {
    title: pageTitle,
    description: pageTitle,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${nautigal.variable} ${garamond.variable} ${baskerville.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
