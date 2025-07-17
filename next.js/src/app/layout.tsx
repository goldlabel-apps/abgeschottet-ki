import type { Metadata } from "next";
import { UbereduxProvider } from '../gl-core/cartridges/Uberedux';

export const metadata: Metadata = {
  title: "Abgeschottet KI",
  description: "Ringfenced Artificial Intelligence",
};

const shortcutIcon = '/svg/favicon.svg';
const appleTouchIcon = '/png/favicon.png';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFF" />
        <link rel="icon" href={shortcutIcon} type="image/x-icon" />
        <link rel="shortcut icon" href={shortcutIcon} type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
      </head>
      <body>
        <UbereduxProvider>{children}</UbereduxProvider>
      </body>
    </html>
  );
}
