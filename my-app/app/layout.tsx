import type { Metadata } from "next";
import {
  EB_Garamond,
  Ephesis,
  Libre_Baskerville,
  Montserrat,
} from "next/font/google";
import "./globals.css";
import { getWeddingConfig } from "@/lib/config";

const script = Ephesis({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-script",
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

const OG_IMAGE_PATH = "/images/img-main.JPG";

function siteMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const base = raw ? raw.replace(/\/$/, "") : "https://ducanhphamhuyen.love";
  return new URL(`${base}/`);
}

export async function generateMetadata(): Promise<Metadata> {
  const { pageTitle } = getWeddingConfig();
  return {
    metadataBase: siteMetadataBase(),
    title: pageTitle,
    description: pageTitle,
    openGraph: {
      title: pageTitle,
      description: pageTitle,
      type: "website",
      locale: "vi_VN",
      images: [
        {
          url: OG_IMAGE_PATH,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageTitle,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${script.variable} ${garamond.variable} ${baskerville.variable} ${montserrat.variable} min-h-full antialiased`}
    >
      <body className="min-h-full overflow-x-clip">{children}</body>
    </html>
  );
}
